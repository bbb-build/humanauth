// "Login with Humanary" client SDK (OAuth 2.1 + OIDC, PKCE).
// Works in both browser and Node 18+ (uses globalThis.crypto).

const DEFAULT_API_URL = "https://humanauth.vercel.app";

export interface OAuthClientConfig {
  clientId: string;
  redirectUri: string;
  scopes?: string[];
  apiUrl?: string;
}

export interface TokenSet {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn: number;
  scope: string;
  tokenType: "Bearer";
}

export interface UserInfo {
  sub: string;
  handle?: string;
  display_name?: string;
  avatar_url?: string;
  verified_human?: boolean;
  verification_level?: "orb" | "device";
  email?: string;
  email_verified?: boolean;
}

// PKCE実装: S256
function base64UrlEncode(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function getCrypto(): Crypto {
  const c = (globalThis as unknown as { crypto?: Crypto }).crypto;
  if (!c || !c.subtle) {
    throw new Error("Web Crypto API not available. Use Node 18+ or a modern browser.");
  }
  return c;
}

export async function generatePkcePair(): Promise<{ verifier: string; challenge: string }> {
  const c = getCrypto();
  const random = c.getRandomValues(new Uint8Array(32));
  const verifier = base64UrlEncode(random);
  const challengeBuf = await c.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  const challenge = base64UrlEncode(new Uint8Array(challengeBuf));
  return { verifier, challenge };
}

function generateState(): string {
  return base64UrlEncode(getCrypto().getRandomValues(new Uint8Array(16)));
}

// ============================================================
// Browser-side helpers
// ============================================================

const STORAGE_PREFIX = "humanauth_oauth_";

interface PendingAuth {
  verifier: string;
  state: string;
  redirectUri: string;
  scopes: string[];
}

function storage(): Storage {
  if (typeof sessionStorage === "undefined") {
    throw new Error("sessionStorage not available — call signIn() from a browser");
  }
  return sessionStorage;
}

/**
 * Browser entry point.
 * Generates PKCE + state, stores them in sessionStorage, and redirects to the authorize endpoint.
 * After the user signs in and consents, they are redirected back to redirectUri with ?code=&state=.
 */
export async function signIn(config: OAuthClientConfig & { state?: string }): Promise<void> {
  const apiUrl = config.apiUrl || DEFAULT_API_URL;
  const scopes = config.scopes || ["openid", "profile", "verified_human"];
  const { verifier, challenge } = await generatePkcePair();
  const state = config.state || generateState();

  const pending: PendingAuth = {
    verifier,
    state,
    redirectUri: config.redirectUri,
    scopes,
  };
  storage().setItem(STORAGE_PREFIX + state, JSON.stringify(pending));

  const url = new URL(`${apiUrl}/api/oauth/authorize`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("scope", scopes.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");

  window.location.href = url.toString();
}

export interface CallbackResult {
  tokens: TokenSet;
  state: string;
  scopes: string[];
}

/**
 * Browser entry point. Handles ?code=&state= query on the redirectUri page.
 * Exchanges code for tokens and returns them. Throws on error.
 */
export async function handleCallback(opts: {
  clientId: string;
  apiUrl?: string;
}): Promise<CallbackResult> {
  if (typeof window === "undefined") {
    throw new Error("handleCallback() must run in a browser");
  }

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");
  const errorCode = params.get("error");

  if (errorCode) {
    const desc = params.get("error_description");
    throw new Error(`OAuth error: ${errorCode}${desc ? ` — ${desc}` : ""}`);
  }
  if (!code || !state) throw new Error("Missing code or state in callback URL");

  const raw = storage().getItem(STORAGE_PREFIX + state);
  if (!raw) throw new Error("Unknown state — possible CSRF or expired flow");
  const pending = JSON.parse(raw) as PendingAuth;
  storage().removeItem(STORAGE_PREFIX + state);

  const tokens = await exchangeCodeForTokens({
    clientId: opts.clientId,
    code,
    codeVerifier: pending.verifier,
    redirectUri: pending.redirectUri,
    apiUrl: opts.apiUrl,
  });

  return { tokens, state, scopes: pending.scopes };
}

// ============================================================
// Universal (browser + server) low-level API
// ============================================================

export interface ExchangeParams {
  clientId: string;
  code: string;
  codeVerifier: string;
  redirectUri: string;
  clientSecret?: string;
  apiUrl?: string;
}

export async function exchangeCodeForTokens(params: ExchangeParams): Promise<TokenSet> {
  const apiUrl = params.apiUrl || DEFAULT_API_URL;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: params.code,
    redirect_uri: params.redirectUri,
    client_id: params.clientId,
    code_verifier: params.codeVerifier,
  });
  if (params.clientSecret) body.set("client_secret", params.clientSecret);

  const res = await fetch(`${apiUrl}/api/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Token exchange failed: ${res.status} ${detail}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    id_token?: string;
    expires_in: number;
    scope: string;
    token_type: string;
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    scope: data.scope,
    tokenType: "Bearer",
  };
}

export interface RefreshParams {
  clientId: string;
  refreshToken: string;
  clientSecret?: string;
  apiUrl?: string;
}

export async function refreshAccessToken(params: RefreshParams): Promise<TokenSet> {
  const apiUrl = params.apiUrl || DEFAULT_API_URL;
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: params.refreshToken,
    client_id: params.clientId,
  });
  if (params.clientSecret) body.set("client_secret", params.clientSecret);

  const res = await fetch(`${apiUrl}/api/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);

  const data = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    id_token?: string;
    expires_in: number;
    scope: string;
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    scope: data.scope,
    tokenType: "Bearer",
  };
}

export async function getUserInfo(opts: {
  accessToken: string;
  apiUrl?: string;
}): Promise<UserInfo> {
  const apiUrl = opts.apiUrl || DEFAULT_API_URL;
  const res = await fetch(`${apiUrl}/api/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${opts.accessToken}` },
  });
  if (!res.ok) throw new Error(`UserInfo failed: ${res.status}`);
  return (await res.json()) as UserInfo;
}

/**
 * Convenience getter — same as getUserInfo() but accepts a TokenSet.
 */
export async function getUser(tokens: TokenSet, apiUrl?: string): Promise<UserInfo> {
  return getUserInfo({ accessToken: tokens.accessToken, apiUrl });
}

export interface SignOutParams {
  token: string;
  tokenTypeHint?: "access_token" | "refresh_token";
  clientId: string;
  clientSecret?: string;
  apiUrl?: string;
}

export async function signOut(params: SignOutParams): Promise<void> {
  const apiUrl = params.apiUrl || DEFAULT_API_URL;
  const body = new URLSearchParams({
    token: params.token,
    client_id: params.clientId,
  });
  if (params.tokenTypeHint) body.set("token_type_hint", params.tokenTypeHint);
  if (params.clientSecret) body.set("client_secret", params.clientSecret);

  await fetch(`${apiUrl}/api/oauth/revoke`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}
