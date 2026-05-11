import { NextRequest, NextResponse } from "next/server";
import {
  consumeAuthCode,
  getOAuthClient,
  isRedirectUriAllowed,
  issueTokenPair,
  rotateRefreshToken,
  verifyPkce,
  ACCESS_TOKEN_TTL_SEC,
  type Scope,
} from "@/lib/oauth";
import { signIdToken } from "@/lib/oidc-id-token";
import { hashToken } from "@/lib/oauth";
import { withCors, corsPreflightResponse } from "@/lib/oauth-cors";
import { logger, errCtx } from "@/lib/logger";
import { recordAccess, newRequestId } from "@/lib/access-log";
import { recordSecurityEvent, type SecurityEventType } from "@/lib/security-event";

// OAuth Token Endpoint
// POST /api/oauth/token
//   grant_type=authorization_code → code/redirect_uri/client_id/code_verifier(+ client_secret)
//   grant_type=refresh_token       → refresh_token/client_id(+ client_secret)
// Content-Type: application/x-www-form-urlencoded

export async function POST(req: NextRequest) {
  const requestId = newRequestId();
  const form = await readForm(req);
  const grantType = form.get("grant_type");

  // クライアント認証（Authorization: Basic か client_id/client_secret form）
  const auth = await authenticateClient(req, form);
  if (!auth.ok) {
    logger.warn("token-client-auth-failed", { reason: auth.reason, grantType });
    await recordSecurityEvent(req, {
      eventType: auth.eventType,
      clientId: auth.clientIdAttempted,
      requestId,
      errorDetail: { reason: auth.reason, grantType },
    });
    return withCors(tokenError("invalid_client", auth.reason, 401), req);
  }

  let res: NextResponse;
  try {
    if (grantType === "authorization_code") {
      res = await handleAuthorizationCode(req, form, auth.clientId, auth.client, requestId);
    } else if (grantType === "refresh_token") {
      res = await handleRefreshToken(req, form, auth.clientId, requestId);
    } else {
      res = tokenError("unsupported_grant_type", `grant_type=${grantType} is not supported`);
    }
  } catch (e) {
    // ハンドラ内で発生した予期せぬ例外（Supabase疎通失敗、JWT署名失敗など）
    logger.error("token-handler-failed", { clientId: auth.clientId, grantType, ...errCtx(e) });
    res = tokenError("server_error", "Internal error", 500);
  }
  return withCors(res, req);
}

async function handleAuthorizationCode(
  req: NextRequest,
  form: URLSearchParams,
  clientId: string,
  client: OAuthClientRow,
  requestId: string,
) {
  const code = form.get("code");
  const redirectUri = form.get("redirect_uri");
  const codeVerifier = form.get("code_verifier");

  if (!code || !redirectUri || !codeVerifier) {
    return tokenError("invalid_request", "code, redirect_uri, code_verifier are required");
  }

  const consumed = await consumeAuthCode(code);
  if (!consumed) {
    await recordSecurityEvent(req, {
      eventType: "invalid_grant",
      clientId,
      requestId,
      errorDetail: { reason: "code_invalid_expired_or_reused" },
    });
    return tokenError("invalid_grant", "Code is invalid, expired, or already used");
  }

  if (consumed.clientId !== clientId) {
    await recordSecurityEvent(req, {
      eventType: "invalid_grant",
      clientId,
      requestId,
      errorDetail: { reason: "code_client_mismatch", expected: consumed.clientId },
    });
    return tokenError("invalid_grant", "Code does not belong to this client");
  }
  if (consumed.redirectUri !== redirectUri) {
    await recordSecurityEvent(req, {
      eventType: "invalid_grant",
      clientId,
      requestId,
      errorDetail: { reason: "redirect_uri_mismatch" },
    });
    return tokenError("invalid_grant", "redirect_uri mismatch");
  }
  if (!isRedirectUriAllowed(redirectUri, client.redirect_uris || [])) {
    await recordSecurityEvent(req, {
      eventType: "invalid_grant",
      clientId,
      requestId,
      errorDetail: { reason: "redirect_uri_no_longer_registered" },
    });
    return tokenError("invalid_grant", "redirect_uri is no longer registered");
  }
  if (!verifyPkce(codeVerifier, consumed.pkceCodeChallenge, consumed.pkceMethod)) {
    await recordSecurityEvent(req, {
      eventType: "invalid_grant",
      clientId,
      requestId,
      errorDetail: { reason: "pkce_verification_failed" },
    });
    return tokenError("invalid_grant", "PKCE verification failed");
  }

  const { accessToken, refreshToken } = await issueTokenPair({
    clientId,
    userId: consumed.userId,
    scopes: consumed.scopes,
  });

  const idToken = consumed.scopes.includes("openid")
    ? await signIdToken({
        userId: consumed.userId,
        clientId,
        scopes: consumed.scopes,
        nonce: consumed.nonce,
      })
    : null;

  await recordAccess(req, {
    userId: consumed.userId,
    clientId,
    endpoint: "token_issue",
    scopes: consumed.scopes,
    requestId,
  });

  return NextResponse.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL_SEC,
    refresh_token: refreshToken,
    scope: consumed.scopes.join(" "),
    id_token: idToken ?? undefined,
  });
}

async function handleRefreshToken(
  req: NextRequest,
  form: URLSearchParams,
  clientId: string,
  requestId: string,
) {
  const refresh = form.get("refresh_token");
  if (!refresh) return tokenError("invalid_request", "refresh_token is required");

  const rotated = await rotateRefreshToken(refresh);
  if (!rotated) {
    await recordSecurityEvent(req, {
      eventType: "invalid_grant",
      clientId,
      requestId,
      errorDetail: { reason: "refresh_token_invalid_or_expired" },
    });
    return tokenError("invalid_grant", "refresh_token is invalid or expired");
  }

  // refreshはclientに紐付くので、リクエストclientと一致確認したいが、
  // hash前提のため getOAuthClient と異なる方法で client_id整合性を担保する必要あり。
  // rotateRefreshToken内で抽出済のclient_idを返さないので、ここで再取得する。
  const supabaseCheck = await fetchTokenClient(rotated.refreshToken);
  if (!supabaseCheck || supabaseCheck.client_id !== clientId) {
    await recordSecurityEvent(req, {
      eventType: "invalid_grant",
      clientId,
      requestId,
      errorDetail: { reason: "refresh_token_client_mismatch" },
    });
    return tokenError("invalid_grant", "refresh_token client mismatch");
  }

  const idToken = rotated.scopes.includes("openid")
    ? await signIdToken({
        userId: supabaseCheck.user_id,
        clientId,
        scopes: rotated.scopes as Scope[],
      })
    : null;

  await recordAccess(req, {
    userId: supabaseCheck.user_id,
    clientId,
    endpoint: "token_refresh",
    scopes: rotated.scopes,
    requestId,
  });

  return NextResponse.json({
    access_token: rotated.accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL_SEC,
    refresh_token: rotated.refreshToken,
    scope: rotated.scopes.join(" "),
    id_token: idToken ?? undefined,
  });
}

// 新規発行されたばかりのrefresh tokenから client_id/user_id を取得
async function fetchTokenClient(refreshToken: string) {
  const { getSupabaseAdmin } = await import("@/lib/supabase");
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("ha_oauth_tokens")
    .select("client_id, user_id")
    .eq("token_hash", hashToken(refreshToken))
    .eq("token_type", "refresh")
    .single();
  return data;
}

type OAuthClientRow = {
  client_id: string;
  client_secret_hash: string | null;
  client_type: "public" | "confidential";
  redirect_uris: string[];
  allowed_scopes: string[];
};

async function authenticateClient(
  req: NextRequest,
  form: URLSearchParams,
): Promise<
  | { ok: true; clientId: string; client: OAuthClientRow }
  | { ok: false; reason: string; eventType: SecurityEventType; clientIdAttempted: string | null }
> {
  let clientId = form.get("client_id");
  let clientSecret = form.get("client_secret");

  // Basic認証フォールバック
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
      const idx = decoded.indexOf(":");
      if (idx > 0) {
        clientId = decodeURIComponent(decoded.slice(0, idx));
        clientSecret = decodeURIComponent(decoded.slice(idx + 1));
      }
    } catch {
      return {
        ok: false,
        reason: "Invalid Basic authorization header",
        eventType: "invalid_client",
        clientIdAttempted: null,
      };
    }
  }

  if (!clientId) {
    return {
      ok: false,
      reason: "client_id is required",
      eventType: "invalid_client",
      clientIdAttempted: null,
    };
  }

  const client = (await getOAuthClient(clientId)) as OAuthClientRow | null;
  if (!client) {
    return {
      ok: false,
      reason: "Unknown client_id",
      eventType: "unknown_client",
      clientIdAttempted: clientId,
    };
  }

  if (client.client_type === "confidential") {
    if (!clientSecret) {
      return {
        ok: false,
        reason: "client_secret required for confidential client",
        eventType: "invalid_client",
        clientIdAttempted: clientId,
      };
    }
    if (!client.client_secret_hash) {
      return {
        ok: false,
        reason: "Client secret not configured",
        eventType: "invalid_client",
        clientIdAttempted: clientId,
      };
    }
    // SHA-256比較（client_secretは32バイト以上の高エントロピーランダムなのでbcryptは過剰）
    const sha = hashToken(clientSecret);
    if (sha !== client.client_secret_hash) {
      return {
        ok: false,
        reason: "Invalid client_secret",
        eventType: "invalid_client",
        clientIdAttempted: clientId,
      };
    }
  }

  return { ok: true, clientId, client };
}

async function readForm(req: NextRequest): Promise<URLSearchParams> {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    return new URLSearchParams(text);
  }
  if (ct.includes("application/json")) {
    const json = (await req.json()) as Record<string, string>;
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(json)) sp.set(k, v);
    return sp;
  }
  return new URLSearchParams();
}

function tokenError(code: string, description: string, status = 400) {
  return NextResponse.json({ error: code, error_description: description }, { status });
}

export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req);
}
