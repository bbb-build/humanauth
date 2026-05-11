import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/oauth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { withCors, corsPreflightResponse } from "@/lib/oauth-cors";
import { logger, errCtx } from "@/lib/logger";
import { recordAccess, newRequestId } from "@/lib/access-log";
import { recordSecurityEvent } from "@/lib/security-event";
import { getUserEmail } from "@/lib/email-store";

// OIDC Userinfo Endpoint
// GET/POST /api/oauth/userinfo
// Authorization: Bearer <access_token>
//
// 返却claimはアクセストークンのscope次第:
//   openid          → sub のみ
//   profile         → preferred_username, name, picture
//   verified_human  → verified_human, verification_level
//   email           → email, email_verified

async function handle(req: NextRequest) {
  const requestId = newRequestId();

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    await recordSecurityEvent(req, {
      eventType: "invalid_token",
      requestId,
      errorDetail: { reason: "missing_bearer_header" },
    });
    return withCors(NextResponse.json({ error: "invalid_token" }, { status: 401 }), req);
  }
  const token = auth.slice(7).trim();
  const verified = await verifyAccessToken(token);
  if (!verified) {
    await recordSecurityEvent(req, {
      eventType: "invalid_token",
      requestId,
      errorDetail: { reason: "verify_failed" },
    });
    return withCors(NextResponse.json({ error: "invalid_token" }, { status: 401 }), req);
  }

  let user;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("ha_users")
      .select("id, handle, display_name, avatar_url, verification_level")
      .eq("id", verified.userId)
      .single();
    if (error) throw new Error(error.message);
    user = data;
  } catch (e) {
    logger.error("userinfo-db-failed", { userId: verified.userId, ...errCtx(e) });
    return withCors(NextResponse.json({ error: "server_error" }, { status: 500 }), req);
  }

  if (!user) {
    await recordSecurityEvent(req, {
      eventType: "invalid_token",
      clientId: verified.clientId,
      requestId,
      errorDetail: { reason: "user_not_found", userId: verified.userId },
    });
    return withCors(NextResponse.json({ error: "invalid_token" }, { status: 401 }), req);
  }

  const claims: Record<string, unknown> = { sub: user.id };

  if (verified.scopes.includes("profile")) {
    claims.preferred_username = user.handle;
    if (user.display_name) claims.name = user.display_name;
    if (user.avatar_url) claims.picture = user.avatar_url;
  }
  if (verified.scopes.includes("verified_human")) {
    claims.verified_human = true;
    claims.verification_level = user.verification_level;
  }
  if (verified.scopes.includes("email")) {
    const { email, emailVerified } = await getUserEmail(verified.userId);
    if (email) {
      claims.email = email;
      claims.email_verified = emailVerified;
    }
  }

  // 成功時のみアクセスログ記録（claim が実際に渡る瞬間が証跡対象）
  await recordAccess(req, {
    userId: verified.userId,
    clientId: verified.clientId,
    endpoint: "userinfo",
    scopes: verified.scopes,
    claimsReturned: Object.keys(claims),
    requestId,
  });

  return withCors(NextResponse.json(claims), req);
}

export const GET = handle;
export const POST = handle;

export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req);
}
