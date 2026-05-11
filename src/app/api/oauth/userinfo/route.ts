import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/oauth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { withCors, corsPreflightResponse } from "@/lib/oauth-cors";
import { logger, errCtx } from "@/lib/logger";
import { rateLimitClient } from "@/lib/rate-limit";

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
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return withCors(NextResponse.json({ error: "invalid_token" }, { status: 401 }), req);
  }
  const token = auth.slice(7).trim();
  const verified = await verifyAccessToken(token);
  if (!verified) {
    return withCors(NextResponse.json({ error: "invalid_token" }, { status: 401 }), req);
  }

  // per-client レートリミット — トークン検証成功後にカウント
  // userinfoはSPAのページ遷移ごとに叩かれうるためtokenよりは緩め
  const limited = await rateLimitClient(verified.clientId, "userinfo");
  if (limited) {
    logger.warn("userinfo-rate-limit-exceeded", { clientId: verified.clientId });
    return withCors(limited, req);
  }

  let user;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("ha_users")
      .select("id, handle, display_name, avatar_url, email, email_verified, verification_level")
      .eq("id", verified.userId)
      .single();
    if (error) throw new Error(error.message);
    user = data;
  } catch (e) {
    logger.error("userinfo-db-failed", { userId: verified.userId, ...errCtx(e) });
    return withCors(NextResponse.json({ error: "server_error" }, { status: 500 }), req);
  }

  if (!user) {
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
  if (verified.scopes.includes("email") && user.email) {
    claims.email = user.email;
    claims.email_verified = user.email_verified;
  }

  return withCors(NextResponse.json(claims), req);
}

export const GET = handle;
export const POST = handle;

export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req);
}
