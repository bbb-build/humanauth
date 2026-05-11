// アクセスログ記録ヘルパ。
//   - 「ユーザーの個人データがクライアントに渡った証跡」を ha_access_logs に1行追加する
//   - 失敗ログ（invalid_token 等）は対象外。security-event.ts を使うこと
//   - 記録失敗は黙殺（warn のみ）。ログ書き込み障害で本筋の応答が落ちては本末転倒
//
// 使い方:
//   await recordAccess(req, {
//     userId, clientId, endpoint: "userinfo",
//     scopes: ["openid", "email"],
//     claimsReturned: ["sub", "email", "email_verified"],
//     requestId,
//   });
//
// request_id は handler 先頭で `crypto.randomUUID()` を発行し、関連イベントで共有する。

import type { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { logger, errCtx } from "@/lib/logger";

export type AccessEndpoint = "userinfo" | "token_issue" | "token_refresh" | "introspect";

export interface RecordAccessArgs {
  userId: string;
  clientId: string;
  endpoint: AccessEndpoint;
  scopes: string[];
  claimsReturned?: string[];
  requestId: string;
}

export async function recordAccess(req: NextRequest, args: RecordAccessArgs): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("ha_access_logs").insert({
      user_id: args.userId,
      client_id: args.clientId,
      endpoint: args.endpoint,
      scopes: args.scopes,
      claims_returned: args.claimsReturned ?? [],
      ip_address: extractIp(req),
      user_agent: req.headers.get("user-agent"),
      request_id: args.requestId,
    });
    if (error) {
      logger.warn("access-log-insert-failed", {
        endpoint: args.endpoint,
        userId: args.userId,
        clientId: args.clientId,
        error: error.message,
      });
    }
  } catch (e) {
    logger.warn("access-log-exception", {
      endpoint: args.endpoint,
      userId: args.userId,
      clientId: args.clientId,
      ...errCtx(e),
    });
  }
}

// Vercel / プロキシ越しの IP 取得。x-forwarded-for 先頭がオリジナル
export function extractIp(req: NextRequest): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip");
}

export function newRequestId(): string {
  return crypto.randomUUID();
}
