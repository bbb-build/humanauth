import { NextResponse } from "next/server";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const VERIFY_MAX = 30;

// Per-OAuth-client rate limits（per-IP/per-userとは別バケット）
// 暴走RPがHumadのバックエンドを飽和させるのを防ぐためのガード。
// 値はRP1個あたりの "正常運用なら絶対に超えない" 上限。超えたら429を返す。
//
//   token   : authorization_code + refresh_tokenの合算。SPAが複数タブで
//             silent refreshを回しても 5 req/sec で十分余裕がある
//   userinfo: SPAがページ遷移ごとに叩く想定で広めに。10 req/sec
const CLIENT_TOKEN_MAX = 300;
const CLIENT_USERINFO_MAX = 600;

// In-memory fallback（単一インスタンスのみ有効）
const memoryStore = new Map<string, { count: number; resetAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryStore) {
    if (entry.resetAt <= now) memoryStore.delete(key);
  }
}, 60_000);

function memoryRateLimit(identifier: string, limit: number): NextResponse | null {
  const now = Date.now();
  const entry = memoryStore.get(identifier);

  if (!entry || entry.resetAt <= now) {
    memoryStore.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  entry.count++;
  if (entry.count > limit) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  return null;
}

// Upstash Redis経由の分散レート制限（env設定時のみ有効）
async function upstashRateLimit(identifier: string, limit: number): Promise<NextResponse | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const windowKey = `rl:${identifier}:${Math.floor(Date.now() / 60000)}`;

  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify([
        ["INCR", windowKey],
        ["EXPIRE", windowKey, "120"],
      ]),
    });

    if (!res.ok) return null;
    const results = await res.json();
    const count = results[0]?.result || 0;

    if (count > limit) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429, headers: { "Retry-After": "60" } },
      );
    }
  } catch {
    return null;
  }

  return null;
}

// Upstash設定時は分散レート制限、未設定時はin-memoryフォールバック
export async function rateLimit(
  identifier: string,
  limit = MAX_REQUESTS,
): Promise<NextResponse | null> {
  if (process.env.UPSTASH_REDIS_REST_URL) {
    return upstashRateLimit(identifier, limit);
  }
  return memoryRateLimit(identifier, limit);
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

// OAuth client_id 単位のレート制限。
// per-IP / per-user とは独立した名前空間（`client:` prefix）でバケットを切る。
// 用途別に op を分けることで、たとえば token と userinfo の枯渇が干渉しない。
//
// なぜ per-client が必要か:
//   - RP サーバーは複数IPを持ちうる（autoscale, multi-region）ため per-IP では守れない
//   - RP のバグで /token を無限ループで叩かれた場合、per-user では client_id 跨ぎでしか守れない
//   - OAuth実装の標準的なガード（Auth0/Okta/Googleも同様の per-client quota を持つ）
export async function rateLimitClient(
  clientId: string,
  op: "token" | "userinfo",
  limit?: number,
): Promise<NextResponse | null> {
  const effectiveLimit =
    limit ?? (op === "token" ? CLIENT_TOKEN_MAX : CLIENT_USERINFO_MAX);
  return rateLimit(`client:${op}:${clientId}`, effectiveLimit);
}

export { VERIFY_MAX, CLIENT_TOKEN_MAX, CLIENT_USERINFO_MAX };
