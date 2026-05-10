// HumanAuthハンドル（preferred_username）のバリデーションと予約語管理
// DB制約: ha_users.handle_format CHECK ^[a-zA-Z0-9_]{3,30}$ + UNIQUE
// 自動生成は `u_xxxxxxxx`（ha_generate_handle RPC）。ユーザーが任意に変更できる。

export const HANDLE_PATTERN = /^[a-zA-Z0-9_]{3,30}$/;

// 予約語: 大文字小文字を区別せず照合する。新規追加は最小限に留める
// 衝突を避けたい用途: 公式名・ドメイン的に重要なパス・なりすまし防止
const RESERVED_HANDLES = new Set<string>([
  "admin",
  "administrator",
  "root",
  "system",
  "support",
  "help",
  "billing",
  "security",
  "abuse",
  "moderator",
  "humanauth",
  "humanary",
  "world",
  "worldcoin",
  "worldid",
  "official",
  "api",
  "oauth",
  "dashboard",
  "account",
  "settings",
  "docs",
  "www",
  "anonymous",
  "null",
  "undefined",
  "deleted",
  "test",
]);

export type HandleValidation =
  | { ok: true; normalized: string }
  | { ok: false; error: string };

export function validateHandle(input: unknown): HandleValidation {
  if (typeof input !== "string") {
    return { ok: false, error: "Handle must be a string" };
  }
  const trimmed = input.trim();
  if (!HANDLE_PATTERN.test(trimmed)) {
    return {
      ok: false,
      error: "Handle must be 3–30 characters of letters, numbers, or underscore",
    };
  }
  if (RESERVED_HANDLES.has(trimmed.toLowerCase())) {
    return { ok: false, error: "This handle is reserved" };
  }
  // 自動生成パターン `u_xxxxxxxx` を手動取得しようとするのも禁止（衝突誘発防止）
  if (/^u_[a-f0-9]{8}$/i.test(trimmed)) {
    return { ok: false, error: "This handle pattern is reserved for auto-generation" };
  }
  return { ok: true, normalized: trimmed };
}
