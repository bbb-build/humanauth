import { SignJWT } from "jose";
import { getSupabaseAdmin } from "./supabase";
import { getPrivateKey, getKeyId, getIssuer } from "./oidc-keys";
import type { Scope } from "./oauth";

// id_token (JWT) 生成 — OIDC仕様準拠
export async function signIdToken(params: {
  userId: string;
  clientId: string;
  scopes: Scope[];
  nonce?: string | null;
}): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("ha_users")
    .select("handle, display_name, avatar_url, email, email_verified, verification_level")
    .eq("id", params.userId)
    .single();

  const now = Math.floor(Date.now() / 1000);
  const payload: Record<string, unknown> = {
    sub: params.userId,
    aud: params.clientId,
    iat: now,
    exp: now + 60 * 60, // id_token有効期限: 1時間（access tokenより長くてよい）
    auth_time: now,
    // Humanary独自claim
    verified_human: true,
    verification_level: user?.verification_level ?? "orb",
  };

  if (params.nonce) payload.nonce = params.nonce;

  // scopeに応じてclaimを追加
  if (user) {
    if (params.scopes.includes("profile")) {
      payload.preferred_username = user.handle;
      if (user.display_name) payload.name = user.display_name;
      if (user.avatar_url) payload.picture = user.avatar_url;
    }
    if (params.scopes.includes("email") && user.email) {
      payload.email = user.email;
      payload.email_verified = user.email_verified;
    }
  }

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "RS256", kid: getKeyId(), typ: "JWT" })
    .setIssuer(getIssuer())
    .sign(await getPrivateKey());

  return jwt;
}
