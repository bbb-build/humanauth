// "Login with Humad" client SDK (OAuth 2.1 + OIDC, PKCE).
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

// ============================================================
// Silent refresh — keep access tokens fresh without user interaction
// ============================================================

export interface AutoRefreshController {
  /** Stop the auto-refresh timer. Safe to call multiple times. */
  stop(): void;
}

export interface AutoRefreshParams {
  clientId: string;
  initialTokens: TokenSet;
  onUpdate: (next: TokenSet) => void;
  onError?: (err: Error) => void;
  /**
   * Seconds before expiry to trigger refresh. Default: 60.
   * Must be < initialTokens.expiresIn or the first refresh fires immediately.
   */
  refreshLeewaySec?: number;
  clientSecret?: string;
  apiUrl?: string;
}

/**
 * Start a timer that calls refreshAccessToken() shortly before each access
 * token expires. Reschedules itself after every successful refresh.
 *
 * Requires `initialTokens.refreshToken`. Throws synchronously if absent.
 *
 * The caller is responsible for persisting the updated TokenSet via onUpdate,
 * and for calling controller.stop() when the session ends (sign-out, route
 * unmount, etc).
 *
 * Example:
 *   const ctrl = startAutoRefresh({
 *     clientId,
 *     initialTokens: tokens,
 *     onUpdate: (next) => setTokens(next),
 *     onError: (err) => console.warn("refresh failed", err),
 *   });
 *   // later
 *   ctrl.stop();
 */
export function startAutoRefresh(params: AutoRefreshParams): AutoRefreshController {
  if (!params.initialTokens.refreshToken) {
    throw new Error("startAutoRefresh requires a refresh_token on initialTokens");
  }

  const leeway = Math.max(1, params.refreshLeewaySec ?? 60);
  let stopped = false;
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let currentRefreshToken = params.initialTokens.refreshToken;
  let nextDelaySec = Math.max(1, params.initialTokens.expiresIn - leeway);

  const tick = async () => {
    if (stopped) return;
    try {
      const next = await refreshAccessToken({
        clientId: params.clientId,
        refreshToken: currentRefreshToken,
        clientSecret: params.clientSecret,
        apiUrl: params.apiUrl,
      });
      if (stopped) return;
      // refresh tokenはローテーションされる前提（rotateRefreshToken）。
      // 新しいrefresh_tokenが返ってきたらそれを使い続ける
      if (next.refreshToken) currentRefreshToken = next.refreshToken;
      nextDelaySec = Math.max(1, next.expiresIn - leeway);
      params.onUpdate(next);
      schedule();
    } catch (err) {
      if (stopped) return;
      params.onError?.(err instanceof Error ? err : new Error(String(err)));
      // 失敗時はタイマーを止める。RP側でonErrorを受けて再ログインに誘導する想定
    }
  };

  const schedule = () => {
    if (stopped) return;
    timerId = setTimeout(tick, nextDelaySec * 1000);
  };

  schedule();

  return {
    stop() {
      stopped = true;
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
    },
  };
}

// ============================================================
// Silent renew via hidden iframe + prompt=none
// ============================================================

const SILENT_RENEW_MESSAGE_TYPE = "humad:silent-renew" as const;

interface SilentRenewMessage {
  type: typeof SILENT_RENEW_MESSAGE_TYPE;
  ok: boolean;
  tokens?: TokenSet;
  scopes?: string[];
  error?: string;
  state: string;
}

export interface SilentRenewParams {
  clientId: string;
  /**
   * URL to load inside the silent iframe. This page MUST call
   * handleSilentCallback() to relay the result back to the parent window.
   * Often the same as the regular signIn redirectUri (the page can detect
   * iframe context via window.parent !== window).
   */
  redirectUri: string;
  scopes?: string[];
  apiUrl?: string;
  /** Max wait in ms before rejecting. Default: 10000. */
  timeoutMs?: number;
}

/**
 * Silent renewal flow:
 *   1. Create a hidden <iframe> pointing at /api/oauth/authorize with prompt=none
 *   2. The IdP either redirects to redirectUri with ?code=&state= (SSO active)
 *      or returns ?error=login_required (SSO expired)
 *   3. The page at redirectUri calls handleSilentCallback() which postMessages
 *      the TokenSet (or error) back to the parent
 *   4. We resolve / reject with that result and remove the iframe
 *
 * Requires the user to be signed in to the Humad SSO session (cookie).
 * If not, rejects with "login_required" — the caller should fall back to
 * the interactive signIn() flow.
 */
export async function silentRenew(params: SilentRenewParams): Promise<CallbackResult> {
  if (typeof window === "undefined") {
    throw new Error("silentRenew() must run in a browser");
  }

  const apiUrl = params.apiUrl || DEFAULT_API_URL;
  const scopes = params.scopes || ["openid", "profile", "verified_human"];
  const { verifier, challenge } = await generatePkcePair();
  const state = generateState();

  const pending: PendingAuth = {
    verifier,
    state,
    redirectUri: params.redirectUri,
    scopes,
  };
  storage().setItem(STORAGE_PREFIX + state, JSON.stringify(pending));

  const url = new URL(`${apiUrl}/api/oauth/authorize`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", params.clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("scope", scopes.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("prompt", "none");

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.setAttribute("aria-hidden", "true");
  iframe.src = url.toString();

  const timeoutMs = params.timeoutMs ?? 10_000;

  return new Promise<CallbackResult>((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      settled = true;
      window.removeEventListener("message", onMessage);
      clearTimeout(timer);
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      storage().removeItem(STORAGE_PREFIX + state);
    };

    const onMessage = (ev: MessageEvent) => {
      const data = ev.data as Partial<SilentRenewMessage> | null;
      if (!data || data.type !== SILENT_RENEW_MESSAGE_TYPE) return;
      if (data.state !== state) return;
      const expectedOrigin = new URL(params.redirectUri).origin;
      if (ev.origin !== expectedOrigin) return;
      if (settled) return;

      if (data.ok && data.tokens && data.scopes) {
        cleanup();
        resolve({ tokens: data.tokens, state, scopes: data.scopes });
      } else {
        cleanup();
        reject(new Error(data.error || "silent renew failed"));
      }
    };

    const timer = setTimeout(() => {
      if (settled) return;
      cleanup();
      reject(new Error("silent renew timed out"));
    }, timeoutMs);

    window.addEventListener("message", onMessage);
    document.body.appendChild(iframe);
  });
}

/**
 * Call this from the redirect page when it detects it's loaded inside a
 * silent renew iframe (e.g. window.parent !== window).
 * Exchanges the code for tokens and postMessages the result to the parent.
 *
 * The parent's silentRenew() promise resolves with this result.
 *
 * Returns true if this was a silent callback (handled), false otherwise
 * (the page should run its normal handleCallback() logic).
 */
export async function handleSilentCallback(opts: {
  clientId: string;
  apiUrl?: string;
}): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.parent === window) return false; // top-level navigation, not silent

  const params = new URLSearchParams(window.location.search);
  const state = params.get("state");
  if (!state) return false;

  const post = (msg: Omit<SilentRenewMessage, "type">) => {
    // postMessage to parent. ターゲットoriginは限定したいが、複数RPが同じredirectUri
    // を共有しないため "*" でも実害は低い。受信側で origin / state を二重チェックする
    window.parent.postMessage({ type: SILENT_RENEW_MESSAGE_TYPE, ...msg }, "*");
  };

  const errorCode = params.get("error");
  if (errorCode) {
    const desc = params.get("error_description");
    post({ ok: false, error: `${errorCode}${desc ? ` — ${desc}` : ""}`, state });
    return true;
  }

  const code = params.get("code");
  if (!code) {
    post({ ok: false, error: "Missing code in callback URL", state });
    return true;
  }

  const raw = storage().getItem(STORAGE_PREFIX + state);
  if (!raw) {
    post({ ok: false, error: "Unknown state — possible CSRF or expired flow", state });
    return true;
  }
  const pending = JSON.parse(raw) as PendingAuth;
  storage().removeItem(STORAGE_PREFIX + state);

  try {
    const tokens = await exchangeCodeForTokens({
      clientId: opts.clientId,
      code,
      codeVerifier: pending.verifier,
      redirectUri: pending.redirectUri,
      apiUrl: opts.apiUrl,
    });
    post({ ok: true, tokens, scopes: pending.scopes, state });
  } catch (err) {
    post({ ok: false, error: err instanceof Error ? err.message : String(err), state });
  }
  return true;
}

export interface SignOutParams {
  /**
   * Token to revoke. Required when mode is "revoke" (default).
   * Not required when mode is "navigate".
   */
  token?: string;
  tokenTypeHint?: "access_token" | "refresh_token";
  clientId: string;
  clientSecret?: string;
  apiUrl?: string;
  /**
   * "revoke" (default): call /api/oauth/revoke to invalidate the token.
   *   Quiet, server-friendly, no browser navigation.
   * "navigate": redirect the browser to /api/oauth/end-session for
   *   OIDC RP-Initiated Logout. Also ends the user's Humad SSO session.
   *   Requires a browser; throws if window is not available.
   */
  mode?: "revoke" | "navigate";
  /**
   * OIDC RP-Initiated Logout parameters (used only when mode="navigate").
   * id_token issued earlier — helps the IdP identify the user / RP.
   */
  idTokenHint?: string;
  /**
   * Where the IdP should send the browser after logout.
   * MUST be pre-registered on the client's post_logout_redirect_uris.
   */
  postLogoutRedirectUri?: string;
  /**
   * Opaque value echoed back as ?state= on post_logout_redirect_uri.
   */
  state?: string;
}

export async function signOut(params: SignOutParams): Promise<void> {
  const apiUrl = params.apiUrl || DEFAULT_API_URL;
  const mode = params.mode ?? "revoke";

  if (mode === "navigate") {
    if (typeof window === "undefined") {
      throw new Error('signOut({ mode: "navigate" }) requires a browser');
    }
    const url = buildEndSessionUrl({
      apiUrl,
      clientId: params.clientId,
      idTokenHint: params.idTokenHint,
      postLogoutRedirectUri: params.postLogoutRedirectUri,
      state: params.state,
    });
    window.location.href = url;
    return;
  }

  // mode === "revoke" — preserve existing behavior
  if (!params.token) {
    throw new Error('signOut({ mode: "revoke" }) requires a token');
  }
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

export interface EndSessionUrlParams {
  apiUrl?: string;
  clientId?: string;
  idTokenHint?: string;
  postLogoutRedirectUri?: string;
  state?: string;
}

/**
 * Build the OIDC RP-Initiated Logout URL without performing navigation.
 * Useful when the caller wants to attach the URL to a link or perform
 * the redirect via a framework router.
 */
export function buildEndSessionUrl(params: EndSessionUrlParams): string {
  const apiUrl = params.apiUrl || DEFAULT_API_URL;
  const url = new URL(`${apiUrl}/api/oauth/end-session`);
  if (params.idTokenHint) url.searchParams.set("id_token_hint", params.idTokenHint);
  if (params.clientId) url.searchParams.set("client_id", params.clientId);
  if (params.postLogoutRedirectUri) {
    url.searchParams.set("post_logout_redirect_uri", params.postLogoutRedirectUri);
  }
  if (params.state) url.searchParams.set("state", params.state);
  return url.toString();
}
