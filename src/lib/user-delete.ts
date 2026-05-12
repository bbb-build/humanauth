// ユーザー完全削除の単一の正本。
//
// 「アカウント削除」と一口に言っても、Humad では以下のテーブルが関係する:
//   - ha_users                : 本体
//   - ha_oauth_codes          : 認可コード (FK ON DELETE CASCADE)
//   - ha_oauth_tokens         : access / refresh トークン (FK CASCADE)
//   - ha_user_sessions        : SSO セッション (FK CASCADE)
//   - ha_oauth_consents       : クライアント別同意記録 (FK CASCADE)
//   - ha_access_logs          : データアクセス証跡 (FK CASCADE / GDPR 削除権)
//   - ha_user_data_items      : Vault データ (FK CASCADE)
//   - ha_oauth_clients.owner_user_id : 所有 OAuth クライアント (FK ON DELETE SET NULL)
//
// 設計判断:
//   - 「DB の FK CASCADE に全部任せる」が前提。アプリ側で手動 DELETE を並べると
//     新しい子テーブルが増えたとき確実に漏れる。SQL 側を単一の正本にする
//   - 所有 OAuth クライアントは「即削除」ではなく「所有者 NULL のまま残す」(SET NULL)。
//     利用中の RP を巻き添えで停止させないため。運営は所有者なし client を後で精算する
//   - 削除前に各テーブルの行数を集計し、構造化ログに残す
//     （ha_users 自身が消えるので user_id 起点の監査行は作れない → ログのみ）
//   - 失敗時は中途半端な状態を残さない: 単一 DELETE で CASCADE に乗せる
//   - 冪等: 既に存在しない user は { deleted: false, reason: "not_found" } を返す
//
// 呼び元:
//   - DELETE /api/users/me  (ユーザー自身による削除)
//   - 将来の運営側コマンド (CLI / admin API) もここを通す

import { getSupabaseAdmin } from "@/lib/supabase";
import { logger, errCtx } from "@/lib/logger";

export type DeleteUserReason = "not_found" | "db_error";

export interface DeleteUserCounts {
  oauthCodes: number;
  oauthTokens: number;
  userSessions: number;
  oauthConsents: number;
  accessLogs: number;
  userDataItems: number;
  // 所有 OAuth クライアント (FK は SET NULL なので削除されない)
  orphanedOauthClients: number;
}

export interface DeleteUserResult {
  deleted: boolean;
  reason?: DeleteUserReason;
  counts?: DeleteUserCounts;
}

// テーブル名 → 集計に使う列。head:true + count:"exact" で行は返さず件数だけ取る
const COUNT_TABLES: { table: string; column: string }[] = [
  { table: "ha_oauth_codes", column: "user_id" },
  { table: "ha_oauth_tokens", column: "user_id" },
  { table: "ha_user_sessions", column: "user_id" },
  { table: "ha_oauth_consents", column: "user_id" },
  { table: "ha_access_logs", column: "user_id" },
  { table: "ha_user_data_items", column: "user_id" },
];

async function countOwnedClients(userId: string): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { count } = await supabase
    .from("ha_oauth_clients")
    .select("client_id", { count: "exact", head: true })
    .eq("owner_user_id", userId);
  return count ?? 0;
}

async function collectCounts(userId: string): Promise<DeleteUserCounts> {
  const supabase = getSupabaseAdmin();
  const result: DeleteUserCounts = {
    oauthCodes: 0,
    oauthTokens: 0,
    userSessions: 0,
    oauthConsents: 0,
    accessLogs: 0,
    userDataItems: 0,
    orphanedOauthClients: 0,
  };

  const lookup: Record<string, keyof DeleteUserCounts> = {
    ha_oauth_codes: "oauthCodes",
    ha_oauth_tokens: "oauthTokens",
    ha_user_sessions: "userSessions",
    ha_oauth_consents: "oauthConsents",
    ha_access_logs: "accessLogs",
    ha_user_data_items: "userDataItems",
  };

  for (const { table, column } of COUNT_TABLES) {
    const { count, error } = await supabase
      .from(table)
      .select(column, { count: "exact", head: true })
      .eq(column, userId);
    if (error) {
      logger.warn("user-delete-count-failed", { userId, table, error: error.message });
      continue;
    }
    const key = lookup[table];
    if (key) result[key] = count ?? 0;
  }

  result.orphanedOauthClients = await countOwnedClients(userId);
  return result;
}

// 単一の正本: user 完全削除。
// 内部的には ha_users を1行 DELETE するだけ。子テーブルは全て FK CASCADE で連鎖削除される。
// 所有 OAuth クライアントは SET NULL で残るので、戻り値に件数を含めて呼び元が判断できるようにする。
export async function deleteUserCompletely(userId: string): Promise<DeleteUserResult> {
  if (!userId || typeof userId !== "string") {
    return { deleted: false, reason: "not_found" };
  }

  const supabase = getSupabaseAdmin();

  // 存在チェック (冪等性)。削除前に counts を採取するため、ここで取得しておく
  const { data: existing, error: lookupErr } = await supabase
    .from("ha_users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  if (lookupErr) {
    logger.error("user-delete-lookup-failed", { userId, ...errCtx(lookupErr) });
    return { deleted: false, reason: "db_error" };
  }
  if (!existing) {
    return { deleted: false, reason: "not_found" };
  }

  // 削除前に件数を採取 (監査ログ用)。集計失敗は致命ではないので続行
  const counts = await collectCounts(userId);

  // 本体削除。FK CASCADE で関連テーブルも全て消える
  const { error: delErr, data: deleted } = await supabase
    .from("ha_users")
    .delete()
    .eq("id", userId)
    .select("id")
    .maybeSingle();

  if (delErr) {
    logger.error("user-delete-failed", { userId, ...errCtx(delErr), counts });
    return { deleted: false, reason: "db_error", counts };
  }
  if (!deleted) {
    // 並行リクエストで先に消されたケース
    return { deleted: false, reason: "not_found", counts };
  }

  logger.info("user-deleted", {
    userId,
    counts,
  });

  return { deleted: true, counts };
}
