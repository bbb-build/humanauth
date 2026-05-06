import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";
import { decrypt } from "@/lib/crypto";
import { signRequest } from "@worldcoin/idkit/signing";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`rp:${ip}`, 60);
  if (limited) return limited;

  const appCtx = await authenticateApiKey(req);
  if (appCtx instanceof NextResponse) return appCtx;

  const body = await req.json().catch(() => ({}));
  const action = body.action || "humanauth-verify";

  const signingKey = await decrypt(appCtx.signingKeyEncrypted);

  const { sig, nonce, createdAt, expiresAt } = signRequest({
    signingKeyHex: signingKey,
    action,
  });

  return NextResponse.json({
    rp_context: {
      rp_id: appCtx.rpId,
      nonce,
      created_at: createdAt,
      expires_at: expiresAt,
      signature: sig,
    },
  });
}
