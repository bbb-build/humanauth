"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  HumanAuthClient: () => HumanAuthClient,
  exchangeCodeForTokens: () => exchangeCodeForTokens,
  generatePkcePair: () => generatePkcePair,
  getRpContext: () => getRpContext,
  getUser: () => getUser,
  getUserInfo: () => getUserInfo,
  handleCallback: () => handleCallback,
  refreshAccessToken: () => refreshAccessToken,
  signIn: () => signIn,
  signOut: () => signOut,
  verify: () => verify
});
module.exports = __toCommonJS(src_exports);

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
async function signOut(params) {
  const apiUrl = params.apiUrl || DEFAULT_API_URL;
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

// src/index.ts
var DEFAULT_API_URL2 = "https://humanauth.vercel.app";
var HumanAuthClient = class {
  constructor(params) {
    this.apiKey = params.apiKey;
    this.apiUrl = params.apiUrl || DEFAULT_API_URL2;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HumanAuthClient,
  exchangeCodeForTokens,
  generatePkcePair,
  getRpContext,
  getUser,
  getUserInfo,
  handleCallback,
  refreshAccessToken,
  signIn,
  signOut,
  verify
});
