import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/oauth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { withCors, corsPreflightResponse } from "@/lib/oauth-cors";

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

  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("ha_users")
    .select("id, handle, display_name, avatar_url, email, email_verified, verification_level")
    .eq("id", verified.userId)
    .single();

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
