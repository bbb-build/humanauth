import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "./supabase";

// OAuth/OIDC endpoint向けCORSヘルパー
//
// 設計:
//   - SPA型のRP（Next.js client / Vite / Vue等）が humanauth.vercel.app の
//     /api/oauth/token 等を直接 fetch するためにCORSが必要。
//   - 許可originは「登録済みOAuthクライアントのredirect_uriのorigin集合」から
//     動的に取り出す。新規RP登録時にコード変更不要にするため。
//   - credentialed CORSは使わない（Bearerトークン認証 = cookie不要）。
//     これにより credentials=true + Allow-Origin=* の制約問題を避ける。
//   - discovery / jwks は完全公開なので Allow-Origin: * 固定。

type OriginCache = {
  origins: Set<string>;
  ts: number;
};

const CACHE_TTL_MS = 60_000; // 1分。新規クライアント登録から最大1分で反映
let cache: OriginCache | null = null;

async function loadAllowedOrigins(): Promise<Set<string>> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache.origins;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ha_oauth_clients")
    .select("redirect_uris,post_logout_redirect_uris");

  const origins = new Set<string>();
  if (!error && data) {
    for (const row of data as Array<{
      redirect_uris: string[] | null;
      post_logout_redirect_uris: string[] | null;
    }>) {
      const uris = [
        ...(row.redirect_uris ?? []),
        ...(row.post_logout_redirect_uris ?? []),
      ];
      for (const uri of uris) {
        try {
          // localhost相当のloopback IPv4/IPv6も含めてoriginをそのまま採用
          origins.add(new URL(uri).origin);
        } catch {
          // 不正なURIはスキップ
        }
      }
    }
  }

  cache = { origins, ts: Date.now() };
  return origins;
}

// 新規クライアント登録/編集時にキャッシュを破棄したい場合のexport
export function invalidateOriginCache(): void {
  cache = null;
}

export async function isOriginAllowed(origin: string | null): Promise<boolean> {
  if (!origin) return false;
  const origins = await loadAllowedOrigins();
  return origins.has(origin);
}

/**
 * OAuth endpoint用のCORSヘッダー。
 * Originが登録RPのorigin allowlistに含まれる場合のみヘッダーを返す。
 * 含まれない場合は空オブジェクト（CORSなしで応答 = ブラウザがブロックする）。
 */
export async function corsHeaders(req: NextRequest): Promise<Record<string, string>> {
  const origin = req.headers.get("origin");
  if (!origin) return {};
  if (!(await isOriginAllowed(origin))) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  };
}

/**
 * discovery / jwks 等の完全公開エンドポイント用CORS。
 */
export function publicCorsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Max-Age": "3600",
  };
}

/**
 * 既存のNextResponseにCORSヘッダーを後付けする。
 */
export async function withCors(res: NextResponse, req: NextRequest): Promise<NextResponse> {
  const headers = await corsHeaders(req);
  for (const [k, v] of Object.entries(headers)) res.headers.set(k, v);
  return res;
}

export function withPublicCors(res: NextResponse): NextResponse {
  const headers = publicCorsHeaders();
  for (const [k, v] of Object.entries(headers)) res.headers.set(k, v);
  return res;
}

/**
 * OAuth endpoint用のpreflight (OPTIONS) レスポンス。
 */
export async function corsPreflightResponse(req: NextRequest): Promise<NextResponse> {
  const headers = await corsHeaders(req);
  return new NextResponse(null, { status: 204, headers });
}

export function publicCorsPreflightResponse(): NextResponse {
  return new NextResponse(null, { status: 204, headers: publicCorsHeaders() });
}
