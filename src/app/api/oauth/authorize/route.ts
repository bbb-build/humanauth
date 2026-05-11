import { NextRequest, NextResponse } from "next/server";
import {
  getOAuthClient,
  parseScopes,
  filterScopes,
  isRedirectUriAllowed,
  issueAuthCode,
  getConsent,
  consentCoversRequest,
} from "@/lib/oauth";
import { getSsoUserId } from "@/lib/sso-session";
import { logger, errCtx } from "@/lib/logger";

// OAuth Authorization Endpoint
// GET /api/oauth/authorize?response_type=code&client_id=xxx&redirect_uri=yyy
//   &scope=openid+profile&state=zzz&code_challenge=aaa&code_challenge_method=S256&nonce=bbb
//
// 仕様（OAuth 2.1 + OIDC）:
//  - response_type=code のみサポート
//  - PKCE (S256) 必須
//  - redirect_uri はクライアント登録済みURIと完全一致が必須
//  - SSOセッション無し → /oauth/signin にリダイレクト（authorize URLを?return_toで保持）
//  - SSO有り && consent済み → 即code発行 → redirect_uri にリダイレクト
//  - SSO有り && consent未済み → /oauth/consent にリダイレクト

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = url.searchParams;

  const responseType = params.get("response_type");
  const clientId = params.get("client_id");
  const redirectUri = params.get("redirect_uri");
  const scopeRaw = params.get("scope");
  const state = params.get("state") ?? "";
  const codeChallenge = params.get("code_challenge");
  const codeChallengeMethod = params.get("code_challenge_method") || "S256";
  const nonce = params.get("nonce");
  const prompt = params.get("prompt"); // "none" / "consent" / "login" などをサポート
  const userConsent = params.get("user_consent"); // consent画面からの拒否シグナル

  // クライアント検証（redirect_uri検証前のエラーは画面で返す。redirect_uri検証後はクエリで返す）
  if (!clientId) return errorPage("invalid_request", "client_id is required");
  const client = await getOAuthClient(clientId);
  if (!client) return errorPage("invalid_client", "Unknown client_id");

  if (!redirectUri) return errorPage("invalid_request", "redirect_uri is required");
  if (!isRedirectUriAllowed(redirectUri, client.redirect_uris || [])) {
    return errorPage("invalid_request", "redirect_uri is not registered for this client");
  }

  // ユーザーがconsent画面で拒否 → access_deniedで戻す
  if (userConsent === "deny") {
    return redirectError(redirectUri, state, "access_denied", "User denied the request");
  }

  // ここから先のエラーはredirect_uriへリダイレクトで返す（OAuth仕様）
  if (responseType !== "code") {
    return redirectError(redirectUri, state, "unsupported_response_type", "Only response_type=code is supported");
  }
  if (!codeChallenge || codeChallengeMethod !== "S256") {
    return redirectError(redirectUri, state, "invalid_request", "PKCE with S256 is required");
  }

  const requestedScopes = parseScopes(scopeRaw);
  if (requestedScopes.length === 0 || !requestedScopes.includes("openid")) {
    return redirectError(redirectUri, state, "invalid_scope", "openid scope is required");
  }
  const scopes = filterScopes(requestedScopes, client.allowed_scopes || []);
  if (scopes.length === 0) {
    return redirectError(redirectUri, state, "invalid_scope", "No allowed scopes requested");
  }

  // SSOセッション取得
  const userId = await getSsoUserId();

  if (!userId) {
    if (prompt === "none") {
      return redirectError(redirectUri, state, "login_required", "User is not signed in");
    }
    // 未ログイン → サインイン画面へ。authorizeのURLをreturn_toに保存
    const signinUrl = new URL("/oauth/signin", req.url);
    signinUrl.searchParams.set("return_to", url.pathname + url.search);
    return NextResponse.redirect(signinUrl);
  }

  // 同意済みかチェック
  const granted = await getConsent(userId, clientId);
  const needConsent = prompt === "consent" || !consentCoversRequest(granted, scopes);

  if (needConsent) {
    if (prompt === "none") {
      return redirectError(redirectUri, state, "consent_required", "User consent is required");
    }
    const consentUrl = new URL("/oauth/consent", req.url);
    consentUrl.searchParams.set("return_to", url.pathname + url.search);
    consentUrl.searchParams.set("client_id", clientId);
    consentUrl.searchParams.set("scope", scopes.join(" "));
    return NextResponse.redirect(consentUrl);
  }

  // ここまで来たらコード発行
  try {
    const code = await issueAuthCode({
      clientId,
      userId,
      scopes,
      redirectUri,
      pkceCodeChallenge: codeChallenge,
      pkceMethod: codeChallengeMethod,
      nonce,
    });

    const back = new URL(redirectUri);
    back.searchParams.set("code", code);
    if (state) back.searchParams.set("state", state);
    return NextResponse.redirect(back);
  } catch (e) {
    logger.error("authorize-issue-code-failed", { clientId, userId, ...errCtx(e) });
    return redirectError(redirectUri, state, "server_error", e instanceof Error ? e.message : "Internal error");
  }
}

function errorPage(code: string, description: string) {
  return NextResponse.json({ error: code, error_description: description }, { status: 400 });
}

function redirectError(redirectUri: string, state: string, code: string, description: string) {
  const back = new URL(redirectUri);
  back.searchParams.set("error", code);
  back.searchParams.set("error_description", description);
  if (state) back.searchParams.set("state", state);
  return NextResponse.redirect(back);
}
