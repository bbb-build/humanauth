// ha_users.email の暗号化境界。
//
// ステップ3 (2026-05-11) でメールアドレスは AES-GCM で暗号化された状態で DB に保存される。
// 暗号文は "v<N>:base64..." 形式 (lib/crypto.ts 参照)。
//
// 直接 ha_users.email を select / update する経路はこのファイルに集約する。
// userinfo / id_token / users/me / handle 等は必ず getUserEmail を経由すること。
//
// Lazy migration:
//   既存の平文値 (prefix 無し) を読み出した瞬間に、アクティブ鍵で暗号化して書き戻す。
//   バックフィル script を待たずに少しずつ移行される。
//
// 復号失敗時の方針:
//   鍵ローテで該当世代の鍵が落とされた場合など、復号に失敗したら email を null として返す。
//   ID トークンや userinfo の email claim は単に欠落する形になる (= ユーザーは email scope を
//   付けていないのと同じ挙動)。エラーで 500 にしない。

import { getSupabaseAdmin } from "@/lib/supabase";
import {
  encryptWithActiveKey,
  decryptVersioned,
  looksEncrypted,
} from "@/lib/crypto";
import { logger, errCtx } from "@/lib/logger";

export interface UserEmailRecord {
  email: string | null;
  emailVerified: boolean;
}

const EMPTY: UserEmailRecord = { email: null, emailVerified: false };

export async function getUserEmail(userId: string): Promise<UserEmailRecord> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ha_users")
    .select("email, email_verified")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    logger.warn("email-get-failed", { userId, error: error.message });
    return EMPTY;
  }
  if (!data) return EMPTY;

  const stored = (data.email as string | null) ?? null;
  const verified = !!data.email_verified;

  if (!stored) return { email: null, emailVerified: verified };

  if (looksEncrypted(stored)) {
    try {
      const plain = await decryptVersioned(stored);
      return { email: plain, emailVerified: verified };
    } catch (e) {
      logger.warn("email-decrypt-failed", { userId, ...errCtx(e) });
      return { email: null, emailVerified: verified };
    }
  }

  // 旧データ (平文)。lazy migration: 暗号化して書き戻す。失敗しても平文を返す
  try {
    const ciphertext = await encryptWithActiveKey(stored);
    const { error: updateErr } = await supabase
      .from("ha_users")
      .update({ email: ciphertext })
      .eq("id", userId);
    if (updateErr) {
      logger.warn("email-lazy-migrate-update-failed", {
        userId,
        error: updateErr.message,
      });
    } else {
      logger.info("email-lazy-migrated", { userId });
    }
  } catch (e) {
    logger.warn("email-lazy-migrate-encrypt-failed", { userId, ...errCtx(e) });
  }

  return { email: stored, emailVerified: verified };
}

export interface SetUserEmailOptions {
  // 同時に email_verified も更新する場合に指定
  verified?: boolean;
}

export async function setUserEmail(
  userId: string,
  email: string | null,
  opts: SetUserEmailOptions = {},
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  let stored: string | null = null;
  if (email !== null) {
    try {
      stored = await encryptWithActiveKey(email);
    } catch (e) {
      logger.error("email-encrypt-failed", { userId, ...errCtx(e) });
      return false;
    }
  }
  const update: Record<string, unknown> = { email: stored };
  if (opts.verified !== undefined) update.email_verified = opts.verified;
  const { error } = await supabase
    .from("ha_users")
    .update(update)
    .eq("id", userId);
  if (error) {
    logger.warn("email-set-failed", { userId, error: error.message });
    return false;
  }
  return true;
}
