// セキュリティイベント記録ヘルパ。
//   - 「ユーザー特定できない失敗試行・異常イベント」を ha_security_events に1行追加する
//   - ブルートフォース検出 / 監査用。ha_access_logs（成功証跡）とは別管理
//   - 記録失敗は黙殺（warn のみ）
//
// 使い方:
//   await recordSecurityEvent(req, {
//     eventType: "invalid_token",
//     clientId: null,
//     requestId,
//     errorDetail: { reason: "Bearer header missing" },
//   });

import type { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { logger, errCtx } from "@/lib/logger";
import { extractIp } from "@/lib/access-log";

export type SecurityEventType =
  | "invalid_token"
  | "expired_token"
  | "unknown_client"
  | "invalid_client"
  | "invalid_grant"
  | "rate_limited"
  | "consent_denied";

export interface RecordSecurityEventArgs {
  eventType: SecurityEventType;
  clientId?: string | null;
  requestId?: string | null;
  errorDetail?: Record<string, unknown> | null;
}

export async function recordSecurityEvent(
  req: NextRequest,
  args: RecordSecurityEventArgs,
): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("ha_security_events").insert({
      event_type: args.eventType,
      client_id: args.clientId ?? null,
      ip_address: extractIp(req),
      user_agent: req.headers.get("user-agent"),
      error_detail: args.errorDetail ?? null,
      request_id: args.requestId ?? null,
    });
    if (error) {
      logger.warn("security-event-insert-failed", {
        eventType: args.eventType,
        clientId: args.clientId,
        error: error.message,
      });
    }
  } catch (e) {
    logger.warn("security-event-exception", {
      eventType: args.eventType,
      clientId: args.clientId,
      ...errCtx(e),
    });
  }
}
