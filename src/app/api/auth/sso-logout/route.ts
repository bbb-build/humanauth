import { NextRequest, NextResponse } from "next/server";
import { revokeSsoSession } from "@/lib/sso-session";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// IdP側のSSOセッションを破棄する。
// 呼び元: ダッシュボードのSign out / /account のSign out。
// cookieが無い場合も成功扱い（冪等）。
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = await rateLimit(`sso-logout:${ip}`, 30);
  if (limited) return limited;

  await revokeSsoSession();
  return NextResponse.json({ ok: true });
}
