import { NextRequest, NextResponse } from "next/server";
import { signRequest } from "@worldcoin/idkit/signing";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = await rateLimit(`auth-rp:${ip}`, 30);
  if (limited) return limited;
  const signingKey = process.env.WORLD_ID_SIGNING_KEY;
  if (!signingKey) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const { sig, nonce, createdAt, expiresAt } = signRequest({
    signingKeyHex: signingKey,
    action: "humanauth-dashboard-login",
  });

  return NextResponse.json({
    rp_context: {
      rp_id: process.env.WORLD_ID_RP_ID,
      nonce,
      created_at: createdAt,
      expires_at: expiresAt,
      signature: sig,
    },
  });
}
