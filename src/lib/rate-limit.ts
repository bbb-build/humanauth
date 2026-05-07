import { NextResponse } from "next/server";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const VERIFY_MAX = 30;

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

export { VERIFY_MAX };
