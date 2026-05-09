import { cookies } from "next/headers";
import { getSupabaseAdmin } from "./supabase";
import { generateOpaqueToken, hashToken, SSO_COOKIE_NAME, SSO_SESSION_TTL_SEC } from "./oauth";

// humanary.world側のSSOセッション（authorizeから直接利用）
// session_id: cookieに保存する平文（クライアントから受け取る）
// session_id_hash: DBに保存するハッシュ

export async function createSsoSession(params: {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<string> {
  const sessionId = generateOpaqueToken(32);
  const session_id_hash = hashToken(sessionId);
  const supabase = getSupabaseAdmin();

  await supabase.from("ha_user_sessions").insert({
    session_id_hash,
    user_id: params.userId,
    ip_address: params.ipAddress ?? null,
    user_agent: params.userAgent ?? null,
    expires_at: new Date(Date.now() + SSO_SESSION_TTL_SEC * 1000).toISOString(),
  });

  return sessionId;
}

export async function setSsoCookie(sessionId: string): Promise<void> {
  const jar = await cookies();
  jar.set(SSO_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SSO_SESSION_TTL_SEC,
  });
}

// 現在のリクエストのセッションからuser_idを取得
export async function getSsoUserId(): Promise<string | null> {
  const jar = await cookies();
  const sessionId = jar.get(SSO_COOKIE_NAME)?.value;
  if (!sessionId) return null;
  return await getSsoUserIdFromValue(sessionId);
}

export async function getSsoUserIdFromValue(sessionId: string): Promise<string | null> {
  const session_id_hash = hashToken(sessionId);
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("ha_user_sessions")
    .select("user_id, expires_at, revoked_at")
    .eq("session_id_hash", session_id_hash)
    .single();

  if (!data || data.revoked_at) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;

  // last_activity_at更新
  await supabase
    .from("ha_user_sessions")
    .update({ last_activity_at: new Date().toISOString() })
    .eq("session_id_hash", session_id_hash);

  return data.user_id as string;
}

export async function revokeSsoSession(): Promise<void> {
  const jar = await cookies();
  const sessionId = jar.get(SSO_COOKIE_NAME)?.value;
  if (!sessionId) return;
  const session_id_hash = hashToken(sessionId);
  const supabase = getSupabaseAdmin();
  await supabase
    .from("ha_user_sessions")
    .update({ revoked_at: new Date().toISOString() })
    .eq("session_id_hash", session_id_hash);
  jar.delete(SSO_COOKIE_NAME);
}
