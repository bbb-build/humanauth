import { NextRequest, NextResponse } from "next/server";
import { authenticateWidget } from "@/lib/widget-auth";
import { decrypt } from "@/lib/crypto";
import { signRequest } from "@worldcoin/idkit/signing";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = await rateLimit(`widget-rp:${ip}`, 30);
  if (limited) return limited;

  const body = await req.json().catch(() => ({}));
  const appId = body.app_id;

  const appCtx = await authenticateWidget(req, appId);
  if (appCtx instanceof NextResponse) return appCtx;

  // アプリ固有のaction_nameを優先（Google Analytics方式で自動生成されたもの）
  const action = appCtx.actionName || body.action || "humanauth-verify";

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
    world_app_id: appCtx.rpId,
    app_name: appCtx.appName,
    action,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
