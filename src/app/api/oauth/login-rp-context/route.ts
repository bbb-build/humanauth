import { NextRequest, NextResponse } from "next/server";
import { signRequest } from "@worldcoin/idkit/signing";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { HUMANARY_LOGIN_ACTION } from "@/lib/oauth";

// /oauth/signin 画面が World ID 認証ウィジェットを起動する直前に呼ぶ。
// Humanary 専用 RP の signing_key で rp_context を生成して返す。
//
// Humanary 専用 action 'humanary-login-v1' は固定。クライアントから上書きさせない。

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = await rateLimit(`oauth-login-rp:${ip}`, 30);
  if (limited) return limited;

  const rpId = process.env.HUMANARY_LOGIN_RP_ID;
  const worldAppId = process.env.HUMANARY_LOGIN_WORLD_APP_ID;
  const signingKey = process.env.HUMANARY_LOGIN_SIGNING_KEY;

  if (!rpId || !worldAppId || !signingKey) {
    return NextResponse.json(
      { error: "Server misconfigured: HUMANARY_LOGIN_* env vars missing" },
      { status: 500 },
    );
  }

  const { sig, nonce, createdAt, expiresAt } = signRequest({
    signingKeyHex: signingKey,
    action: HUMANARY_LOGIN_ACTION,
  });

  return NextResponse.json({
    rp_context: {
      rp_id: rpId,
      nonce,
      created_at: createdAt,
      expires_at: expiresAt,
      signature: sig,
    },
    world_app_id: worldAppId,
    action: HUMANARY_LOGIN_ACTION,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
