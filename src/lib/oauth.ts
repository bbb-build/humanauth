import { randomBytes, createHash } from "node:crypto";
import { getSupabaseAdmin } from "./supabase";

// OAuth/OIDC共通定数
export const SUPPORTED_SCOPES = ["openid", "profile", "verified_human", "email"] as const;
export type Scope = (typeof SUPPORTED_SCOPES)[number];

export const ACCESS_TOKEN_TTL_SEC = 15 * 60; // 15min
export const REFRESH_TOKEN_TTL_SEC = 30 * 24 * 60 * 60; // 30d
export const AUTH_CODE_TTL_SEC = 60; // 60s（短命）
export const SSO_SESSION_TTL_SEC = 30 * 24 * 60 * 60; // 30d
export const SSO_COOKIE_NAME = "ha_sso";

// World ID固定action — これ配下のnullifierが「同一人物」として扱われる
export const HUMANARY_LOGIN_ACTION = "humanary-login-v1";

// ランダム生成（URLセーフbase64）
export function generateOpaqueToken(byteLen = 32): string {
  return randomBytes(byteLen).toString("base64url");
}

// SHA-256ハッシュ（DB保存用）
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// PKCE検証: S256のみサポート（plainは脆弱なので拒否）
export function verifyPkce(verifier: string, challenge: string, method: string): boolean {
  if (method !== "S256") return false;
  const expected = createHash("sha256").update(verifier).digest("base64url");
  return expected === challenge;
}

// scope正規化（空白区切り→配列、未知のscopeは除外）
export function parseScopes(raw: string | null | undefined): Scope[] {
  if (!raw) return [];
  const all = raw.split(/\s+/).filter(Boolean);
  return all.filter((s): s is Scope => (SUPPORTED_SCOPES as readonly string[]).includes(s));
}

// scopeフィルタ（クライアントが許可されているscope内に絞り込む）
export function filterScopes(requested: Scope[], allowed: string[]): Scope[] {
  return requested.filter((s) => allowed.includes(s));
}

// redirect_uri完全一致チェック
export function isRedirectUriAllowed(uri: string, allowedList: string[]): boolean {
  return allowedList.includes(uri);
}

// 認可コード発行: 平文codeを返し、code_hashをDBに保存
export async function issueAuthCode(params: {
  clientId: string;
  userId: string;
  scopes: Scope[];
  redirectUri: string;
  pkceCodeChallenge: string;
  pkceMethod: string;
  nonce: string | null;
}): Promise<string> {
  const code = generateOpaqueToken(32);
  const code_hash = hashToken(code);
  const expires_at = new Date(Date.now() + AUTH_CODE_TTL_SEC * 1000).toISOString();

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("ha_oauth_codes").insert({
    code_hash,
    client_id: params.clientId,
    user_id: params.userId,
    scopes: params.scopes,
    redirect_uri: params.redirectUri,
    pkce_code_challenge: params.pkceCodeChallenge,
    pkce_method: params.pkceMethod,
    nonce: params.nonce,
    expires_at,
  });

  if (error) throw new Error(`Failed to issue auth code: ${error.message}`);
  return code;
}

// 認可コード消費: 取り出して即座にconsumed_atをセット（ワンタイム）
export async function consumeAuthCode(code: string): Promise<{
  clientId: string;
  userId: string;
  scopes: Scope[];
  redirectUri: string;
  pkceCodeChallenge: string;
  pkceMethod: string;
  nonce: string | null;
} | null> {
  const code_hash = hashToken(code);
  const supabase = getSupabaseAdmin();

  // 取得
  const { data, error } = await supabase
    .from("ha_oauth_codes")
    .select("*")
    .eq("code_hash", code_hash)
    .is("consumed_at", null)
    .single();

  if (error || !data) return null;

  // 期限チェック
  if (new Date(data.expires_at).getTime() < Date.now()) return null;

  // 消費マーク（同時消費レース防止のため update WHERE consumed_at IS NULL）
  const { data: marked } = await supabase
    .from("ha_oauth_codes")
    .update({ consumed_at: new Date().toISOString() })
    .eq("code_hash", code_hash)
    .is("consumed_at", null)
    .select("code_hash");

  if (!marked || marked.length === 0) return null; // 別のリクエストが先に消費した

  return {
    clientId: data.client_id,
    userId: data.user_id,
    scopes: data.scopes,
    redirectUri: data.redirect_uri,
    pkceCodeChallenge: data.pkce_code_challenge,
    pkceMethod: data.pkce_method,
    nonce: data.nonce,
  };
}

// access/refreshトークン発行（DB側はハッシュのみ保存）
export async function issueTokenPair(params: {
  clientId: string;
  userId: string;
  scopes: Scope[];
  parentRefreshTokenHash?: string;
}): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = generateOpaqueToken(32);
  const refreshToken = generateOpaqueToken(48);
  const supabase = getSupabaseAdmin();

  const accessRow = {
    token_hash: hashToken(accessToken),
    token_type: "access" as const,
    client_id: params.clientId,
    user_id: params.userId,
    scopes: params.scopes,
    expires_at: new Date(Date.now() + ACCESS_TOKEN_TTL_SEC * 1000).toISOString(),
  };

  const refreshRow = {
    token_hash: hashToken(refreshToken),
    token_type: "refresh" as const,
    client_id: params.clientId,
    user_id: params.userId,
    scopes: params.scopes,
    parent_token_hash: params.parentRefreshTokenHash ?? null,
    expires_at: new Date(Date.now() + REFRESH_TOKEN_TTL_SEC * 1000).toISOString(),
  };

  const { error } = await supabase.from("ha_oauth_tokens").insert([accessRow, refreshRow]);
  if (error) throw new Error(`Failed to issue tokens: ${error.message}`);

  return { accessToken, refreshToken };
}

// refresh tokenローテーション: 旧tokenをrevokeして新規ペア発行
export async function rotateRefreshToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  scopes: Scope[];
} | null> {
  const refresh_hash = hashToken(refreshToken);
  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from("ha_oauth_tokens")
    .select("*")
    .eq("token_hash", refresh_hash)
    .eq("token_type", "refresh")
    .single();

  if (!existing) return null;
  if (existing.revoked_at) {
    // 既に失効済みのrefreshが使われた = 漏洩の可能性。同一client+userの全refreshを失効
    await supabase
      .from("ha_oauth_tokens")
      .update({ revoked_at: new Date().toISOString() })
      .eq("client_id", existing.client_id)
      .eq("user_id", existing.user_id)
      .eq("token_type", "refresh")
      .is("revoked_at", null);
    return null;
  }
  if (new Date(existing.expires_at).getTime() < Date.now()) return null;

  // 旧をrevoke
  await supabase
    .from("ha_oauth_tokens")
    .update({ revoked_at: new Date().toISOString() })
    .eq("token_hash", refresh_hash);

  // 新ペア発行
  const pair = await issueTokenPair({
    clientId: existing.client_id,
    userId: existing.user_id,
    scopes: existing.scopes,
    parentRefreshTokenHash: refresh_hash,
  });

  return { ...pair, scopes: existing.scopes };
}

// access token検証（userinfo等で使用）
export async function verifyAccessToken(token: string): Promise<{
  userId: string;
  clientId: string;
  scopes: Scope[];
} | null> {
  const access_hash = hashToken(token);
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("ha_oauth_tokens")
    .select("*")
    .eq("token_hash", access_hash)
    .eq("token_type", "access")
    .is("revoked_at", null)
    .single();

  if (!data) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;

  // last_used_at更新（fire-and-forget）
  await supabase
    .from("ha_oauth_tokens")
    .update({ last_used_at: new Date().toISOString() })
    .eq("token_hash", access_hash);

  return {
    userId: data.user_id,
    clientId: data.client_id,
    scopes: data.scopes,
  };
}

// クライアント取得
export async function getOAuthClient(clientId: string) {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("ha_oauth_clients")
    .select("*")
    .eq("client_id", clientId)
    .single();
  return data;
}

// 同意の永続化 / 取得
export async function recordConsent(userId: string, clientId: string, scopes: Scope[]) {
  const supabase = getSupabaseAdmin();
  await supabase.from("ha_oauth_consents").upsert(
    {
      user_id: userId,
      client_id: clientId,
      scopes,
      granted_at: new Date().toISOString(),
      revoked_at: null,
    },
    { onConflict: "user_id,client_id" },
  );
}

export async function getConsent(userId: string, clientId: string): Promise<Scope[] | null> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("ha_oauth_consents")
    .select("scopes, revoked_at")
    .eq("user_id", userId)
    .eq("client_id", clientId)
    .single();
  if (!data || data.revoked_at) return null;
  return data.scopes as Scope[];
}

// 既存の同意で要求scopeをすべてカバーできるか（true=consent画面スキップ可）
export function consentCoversRequest(granted: Scope[] | null, requested: Scope[]): boolean {
  if (!granted) return false;
  return requested.every((s) => granted.includes(s));
}
