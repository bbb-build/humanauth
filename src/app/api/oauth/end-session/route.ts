import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getOAuthClient } from "@/lib/oauth";
import { getPublicKey, getIssuer } from "@/lib/oidc-keys";
import { revokeSsoSession } from "@/lib/sso-session";
import { corsPreflightResponse, withCors } from "@/lib/oauth-cors";

// OIDC RP-Initiated Logout 1.0
// https://openid.net/specs/openid-connect-rpinitiated-1_0.html
//
// GET (or POST form-urlencoded) /api/oauth/end-session
//   id_token_hint:            前回発行したid_token（RECOMMENDED）
//   client_id:                RPのclient_id（id_token_hintが無い時の補助）
//   post_logout_redirect_uri: ログアウト後の戻り先（クライアントに事前登録要）
//   state:                    リダイレクト時にそのまま付与
//   logout_hint, ui_locales:  受理して無視（将来拡張用）
//
// 動作:
//  1) id_token_hintがあれば検証し、aud/subを取得。client_idがあればaud一致を要求
//  2) post_logout_redirect_uriはクライアント登録URIと完全一致でのみ許可
//  3) SSOセッションを破棄（cookieも消える）
//  4) post_logout_redirect_uriが妥当ならstate付きでリダイレクト、それ以外はログアウト完了画面

export async function GET(req: NextRequest) {
  return handle(req, new URL(req.url).searchParams);
}

export async function POST(req: NextRequest) {
  const form = new URLSearchParams(await req.text());
  return handle(req, form);
}

async function handle(req: NextRequest, params: URLSearchParams): Promise<NextResponse> {
  const idTokenHint = params.get("id_token_hint");
  const clientIdParam = params.get("client_id");
  const postLogoutRedirectUri = params.get("post_logout_redirect_uri");
  const state = params.get("state") ?? "";

  // id_token_hint検証（あれば）。aud（client_id）/ subを抽出
  let hintAud: string | null = null;
  if (idTokenHint) {
    try {
      const pub = await getPublicKey();
      // expiredなid_tokenでもログアウト目的なので exp 検証はスキップ
      const { payload } = await jwtVerify(idTokenHint, pub, {
        issuer: getIssuer(),
        clockTolerance: 60 * 60 * 24 * 365, // 1年: ログアウト時はexp切れも許容
      });
      hintAud = typeof payload.aud === "string" ? payload.aud : null;
    } catch {
      // 不正なid_token_hint → 受理せず、リダイレクトもしない
      return errorPage(
        "invalid_request",
        "id_token_hint could not be verified",
      );
    }
  }

  // 採用するclient_id: id_token_hintのaudが正本。両方ある場合は一致必須
  const effectiveClientId = hintAud || clientIdParam;
  if (hintAud && clientIdParam && hintAud !== clientIdParam) {
    return errorPage(
      "invalid_request",
      "client_id does not match id_token_hint aud",
    );
  }

  // post_logout_redirect_uri検証
  let safeRedirectUri: string | null = null;
  if (postLogoutRedirectUri) {
    if (!effectiveClientId) {
      return errorPage(
        "invalid_request",
        "post_logout_redirect_uri requires client_id or id_token_hint",
      );
    }
    const client = await getOAuthClient(effectiveClientId);
    if (!client) {
      return errorPage("invalid_client", "Unknown client_id");
    }
    const registered: string[] = client.post_logout_redirect_uris || [];
    if (!registered.includes(postLogoutRedirectUri)) {
      return errorPage(
        "invalid_request",
        "post_logout_redirect_uri is not registered for this client",
      );
    }
    safeRedirectUri = postLogoutRedirectUri;
  }

  // SSOセッション破棄（ID provider側のログアウト）
  // 注: 個別RPのアクセストークン失効はRP側がrevokeを呼ぶか、自然失効に任せる
  await revokeSsoSession();

  if (safeRedirectUri) {
    const back = new URL(safeRedirectUri);
    if (state) back.searchParams.set("state", state);
    return NextResponse.redirect(back);
  }

  // post_logout_redirect_uriが無い／登録外 → 簡易ログアウト完了画面
  return new NextResponse(
    `<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>Signed out</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0a0a0a;color:#fafafa}main{text-align:center;padding:2rem}h1{font-size:1.5rem;margin:0 0 .5rem}p{opacity:.7;margin:0}</style></head><body><main><h1>Signed out</h1><p>You have been signed out of Humad.</p></main></body></html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    },
  );
}

function errorPage(code: string, description: string): NextResponse {
  return NextResponse.json(
    { error: code, error_description: description },
    { status: 400 },
  );
}

export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req);
}
