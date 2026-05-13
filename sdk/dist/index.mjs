// src/oauth.ts
var DEFAULT_API_URL = "https://humanauth.vercel.app";
function base64UrlEncode(buf) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function getCrypto() {
  const c = globalThis.crypto;
  if (!c || !c.subtle) {
    throw new Error("Web Crypto API not available. Use Node 18+ or a modern browser.");
  }
  return c;
}
async function generatePkcePair() {
  const c = getCrypto();
  const random = c.getRandomValues(new Uint8Array(32));
  const verifier = base64UrlEncode(random);
  const challengeBuf = await c.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  const challenge = base64UrlEncode(new Uint8Array(challengeBuf));
  return { verifier, challenge };
}
function generateState() {
  return base64UrlEncode(getCrypto().getRandomValues(new Uint8Array(16)));
}
var STORAGE_PREFIX = "humanauth_oauth_";
function storage() {
  if (typeof sessionStorage === "undefined") {
    throw new Error("sessionStorage not available \u2014 call signIn() from a browser");
  }
  return sessionStorage;
}
async function signIn(config) {
  const apiUrl = config.apiUrl || DEFAULT_API_URL;
  const scopes = config.scopes || ["openid", "profile", "verified_human"];
  const { verifier, challenge } = await generatePkcePair();
  const state = config.state || generateState();
  const pending = {
    verifier,
    state,
    redirectUri: config.redirectUri,
    scopes
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
async function handleCallback(opts) {
  if (typeof window === "undefined") {
    throw new Error("handleCallback() must run in a browser");
  }
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");
  const errorCode = params.get("error");
  if (errorCode) {
    const desc = params.get("error_description");
    throw new Error(`OAuth error: ${errorCode}${desc ? ` \u2014 ${desc}` : ""}`);
  }
  if (!code || !state) throw new Error("Missing code or state in callback URL");
  const raw = storage().getItem(STORAGE_PREFIX + state);
  if (!raw) throw new Error("Unknown state \u2014 possible CSRF or expired flow");
  const pending = JSON.parse(raw);
  storage().removeItem(STORAGE_PREFIX + state);
  const tokens = await exchangeCodeForTokens({
    clientId: opts.clientId,
    code,
    codeVerifier: pending.verifier,
    redirectUri: pending.redirectUri,
    apiUrl: opts.apiUrl
  });
  return { tokens, state, scopes: pending.scopes };
}
async function exchangeCodeForTokens(params) {
  const apiUrl = params.apiUrl || DEFAULT_API_URL;
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: params.code,
    redirect_uri: params.redirectUri,
    client_id: params.clientId,
    code_verifier: params.codeVerifier
  });
  if (params.clientSecret) body.set("client_secret", params.clientSecret);
  const res = await fetch(`${apiUrl}/api/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Token exchange failed: ${res.status} ${detail}`);
  }
  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    scope: data.scope,
    tokenType: "Bearer"
  };
}
async function refreshAccessToken(params) {
  const apiUrl = params.apiUrl || DEFAULT_API_URL;
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: params.refreshToken,
    client_id: params.clientId
  });
  if (params.clientSecret) body.set("client_secret", params.clientSecret);
  const res = await fetch(`${apiUrl}/api/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  });
  if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);
  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    scope: data.scope,
    tokenType: "Bearer"
  };
}
async function getUserInfo(opts) {
  const apiUrl = opts.apiUrl || DEFAULT_API_URL;
  const res = await fetch(`${apiUrl}/api/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${opts.accessToken}` }
  });
  if (!res.ok) throw new Error(`UserInfo failed: ${res.status}`);
  return await res.json();
}
async function getUser(tokens, apiUrl) {
  return getUserInfo({ accessToken: tokens.accessToken, apiUrl });
}
function startAutoRefresh(params) {
  if (!params.initialTokens.refreshToken) {
    throw new Error("startAutoRefresh requires a refresh_token on initialTokens");
  }
  const leeway = Math.max(1, params.refreshLeewaySec ?? 60);
  let stopped = false;
  let timerId = null;
  let currentRefreshToken = params.initialTokens.refreshToken;
  let nextDelaySec = Math.max(1, params.initialTokens.expiresIn - leeway);
  const tick = async () => {
    if (stopped) return;
    try {
      const next = await refreshAccessToken({
        clientId: params.clientId,
        refreshToken: currentRefreshToken,
        clientSecret: params.clientSecret,
        apiUrl: params.apiUrl
      });
      if (stopped) return;
      if (next.refreshToken) currentRefreshToken = next.refreshToken;
      nextDelaySec = Math.max(1, next.expiresIn - leeway);
      params.onUpdate(next);
      schedule();
    } catch (err) {
      if (stopped) return;
      params.onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  };
  const schedule = () => {
    if (stopped) return;
    timerId = setTimeout(tick, nextDelaySec * 1e3);
  };
  schedule();
  return {
    stop() {
      stopped = true;
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
    }
  };
}
var SILENT_RENEW_MESSAGE_TYPE = "humad:silent-renew";
async function silentRenew(params) {
  if (typeof window === "undefined") {
    throw new Error("silentRenew() must run in a browser");
  }
  const apiUrl = params.apiUrl || DEFAULT_API_URL;
  const scopes = params.scopes || ["openid", "profile", "verified_human"];
  const { verifier, challenge } = await generatePkcePair();
  const state = generateState();
  const pending = {
    verifier,
    state,
    redirectUri: params.redirectUri,
    scopes
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
  const timeoutMs = params.timeoutMs ?? 1e4;
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => {
      settled = true;
      window.removeEventListener("message", onMessage);
      clearTimeout(timer);
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      storage().removeItem(STORAGE_PREFIX + state);
    };
    const onMessage = (ev) => {
      const data = ev.data;
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
async function handleSilentCallback(opts) {
  if (typeof window === "undefined") return false;
  if (window.parent === window) return false;
  const params = new URLSearchParams(window.location.search);
  const state = params.get("state");
  if (!state) return false;
  const post = (msg) => {
    window.parent.postMessage({ type: SILENT_RENEW_MESSAGE_TYPE, ...msg }, "*");
  };
  const errorCode = params.get("error");
  if (errorCode) {
    const desc = params.get("error_description");
    post({ ok: false, error: `${errorCode}${desc ? ` \u2014 ${desc}` : ""}`, state });
    return true;
  }
  const code = params.get("code");
  if (!code) {
    post({ ok: false, error: "Missing code in callback URL", state });
    return true;
  }
  const raw = storage().getItem(STORAGE_PREFIX + state);
  if (!raw) {
    post({ ok: false, error: "Unknown state \u2014 possible CSRF or expired flow", state });
    return true;
  }
  const pending = JSON.parse(raw);
  storage().removeItem(STORAGE_PREFIX + state);
  try {
    const tokens = await exchangeCodeForTokens({
      clientId: opts.clientId,
      code,
      codeVerifier: pending.verifier,
      redirectUri: pending.redirectUri,
      apiUrl: opts.apiUrl
    });
    post({ ok: true, tokens, scopes: pending.scopes, state });
  } catch (err) {
    post({ ok: false, error: err instanceof Error ? err.message : String(err), state });
  }
  return true;
}
async function signOut(params) {
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
      state: params.state
    });
    window.location.href = url;
    return;
  }
  if (!params.token) {
    throw new Error('signOut({ mode: "revoke" }) requires a token');
  }
  const body = new URLSearchParams({
    token: params.token,
    client_id: params.clientId
  });
  if (params.tokenTypeHint) body.set("token_type_hint", params.tokenTypeHint);
  if (params.clientSecret) body.set("client_secret", params.clientSecret);
  await fetch(`${apiUrl}/api/oauth/revoke`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  });
}
function buildEndSessionUrl(params) {
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

// src/agents.ts
var DEFAULT_API_URL2 = "https://humanauth.vercel.app";
var HumadAgentClient = class {
  constructor(params) {
    this.accessToken = params.accessToken;
    this.apiUrl = (params.apiUrl || DEFAULT_API_URL2).replace(/\/+$/, "");
  }
  async startAgentRegistration() {
    return this.request("/api/v1/agents", {
      method: "POST"
    });
  }
  async finalizeAgentRegistration(address, proof) {
    return this.request(
      `/api/v1/agents/${encodeURIComponent(address)}/finalize`,
      {
        method: "POST",
        body: JSON.stringify(proof)
      }
    );
  }
  async listAgents() {
    const data = await this.request("/api/v1/agents", {
      method: "GET"
    });
    return data.agents;
  }
  async request(path, init) {
    const res = await fetch(`${this.apiUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
        ...init.headers
      }
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      const message = typeof error.error === "string" ? error.error : typeof error.message === "string" ? error.message : "Humad agent API request failed";
      throw new Error(message);
    }
    return res.json();
  }
};

// src/index.ts
var DEFAULT_API_URL3 = "https://humanauth.vercel.app";
var HumanAuthClient = class {
  constructor(params) {
    this.apiKey = params.apiKey;
    this.apiUrl = params.apiUrl || DEFAULT_API_URL3;
  }
  async verify(params) {
    const res = await fetch(`${this.apiUrl}/api/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-humanauth-key": this.apiKey
      },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || "Verification failed");
    }
    return res.json();
  }
  async getRpContext(action) {
    const res = await fetch(`${this.apiUrl}/api/rp-context`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-humanauth-key": this.apiKey
      },
      body: JSON.stringify({ action })
    });
    if (!res.ok) {
      throw new Error("Failed to get RP context");
    }
    return res.json();
  }
};
async function verify(params) {
  const client = new HumanAuthClient({
    apiKey: params.apiKey,
    apiUrl: params.apiUrl
  });
  return client.verify(params);
}
async function getRpContext(params) {
  const client = new HumanAuthClient({
    apiKey: params.apiKey,
    apiUrl: params.apiUrl
  });
  return client.getRpContext(params.action);
}
export {
  HumadAgentClient,
  HumanAuthClient,
  buildEndSessionUrl,
  exchangeCodeForTokens,
  generatePkcePair,
  getRpContext,
  getUser,
  getUserInfo,
  handleCallback,
  handleSilentCallback,
  refreshAccessToken,
  signIn,
  signOut,
  silentRenew,
  startAutoRefresh,
  verify
};
