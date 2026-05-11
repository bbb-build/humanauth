import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getPrivateKey, getCurrentPublicKey } from "@/lib/oidc-keys";
import { logger, errCtx } from "@/lib/logger";

// ヘルスチェックエンドポイント。
// - DB ping（oauth_clients への軽量SELECT）で接続性を確認
// - JWKS の active 鍵が存在することを確認
// 200 = 全パス, 503 = 失敗あり。失敗時は logger.error で通知される。
//
// UptimeRobot / Vercel Cron 等から定期叩きする想定。

export const runtime = "nodejs";

interface Check {
  ok: boolean;
  durationMs: number;
  error?: string;
}

export async function GET() {
  const start = Date.now();
  const checks: Record<string, Check> = {};

  // DB
  const dbStart = Date.now();
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("ha_oauth_clients").select("client_id").limit(1);
    if (error) throw new Error(error.message);
    checks.db = { ok: true, durationMs: Date.now() - dbStart };
  } catch (e) {
    checks.db = { ok: false, durationMs: Date.now() - dbStart, ...errCtx(e) };
  }

  // JWKS（OIDC署名鍵が env から正しくロードできるか）
  const jwksStart = Date.now();
  try {
    await Promise.all([getPrivateKey(), getCurrentPublicKey()]);
    checks.jwks = { ok: true, durationMs: Date.now() - jwksStart };
  } catch (e) {
    checks.jwks = { ok: false, durationMs: Date.now() - jwksStart, ...errCtx(e) };
  }

  const allOk = Object.values(checks).every((c) => c.ok);
  const body = {
    ok: allOk,
    service: "humanauth",
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    sha: (process.env.VERCEL_GIT_COMMIT_SHA || "").slice(0, 7) || "dev",
    durationMs: Date.now() - start,
    checks,
  };

  if (!allOk) {
    logger.error("health-check-failed", { checks });
  }

  return NextResponse.json(body, { status: allOk ? 200 : 503 });
}
