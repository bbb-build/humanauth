import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getOwnerId, unauthorized } from "@/lib/auth-helpers";
import { rateLimit } from "@/lib/rate-limit";
import { deleteUserCompletely } from "@/lib/user-delete";
import { revokeSsoSession } from "@/lib/sso-session";
import { logger, errCtx } from "@/lib/logger";

// 認証中ユーザー（JWT.sub = nullifier_hash）の自プロフィール取得・更新。
// ハンドル変更だけは別ルート /api/users/me/handle に分離（バリデーションが重いため）。

const SELECT_COLS =
  "id, handle, handle_is_custom, display_name, avatar_url, email, email_verified, verification_level, created_at";

export async function GET(req: NextRequest) {
  const nullifier = await getOwnerId(req);
  if (!nullifier) return unauthorized();

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ha_users")
    .select(SELECT_COLS)
    .eq("nullifier_hash", nullifier)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ user: data });
}

// display_name と avatar_url の部分更新。両方任意。null許容（クリア）。
export async function PATCH(req: NextRequest) {
  const nullifier = await getOwnerId(req);
  if (!nullifier) return unauthorized();

  const limited = await rateLimit(`users-me:${nullifier}`, 30);
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const updates: Record<string, string | null> = {};

  if ("display_name" in body) {
    const v = body.display_name;
    if (v === null || v === "") {
      updates.display_name = null;
    } else if (typeof v === "string" && v.length <= 80) {
      updates.display_name = v;
    } else {
      return NextResponse.json(
        { error: "display_name must be a string up to 80 characters or null" },
        { status: 400 },
      );
    }
  }

  if ("avatar_url" in body) {
    const v = body.avatar_url;
    if (v === null || v === "") {
      updates.avatar_url = null;
    } else if (typeof v === "string" && /^https:\/\//.test(v) && v.length <= 500) {
      updates.avatar_url = v;
    } else {
      return NextResponse.json(
        { error: "avatar_url must be an https URL up to 500 characters or null" },
        { status: 400 },
      );
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No updatable fields provided" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ha_users")
    .update(updates)
    .eq("nullifier_hash", nullifier)
    .select(SELECT_COLS)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ user: data });
}

// アカウント完全削除。
// 誤爆防止のため、リクエストボディに `{ "confirmation": "DELETE" }` を必須とする。
// 削除パスは src/lib/user-delete.ts の deleteUserCompletely() に集約 (単一の正本)。
// 成功後は SSO セッションも破棄する (cookie 残しても紐先 user_id が消えているため検証で落ちるが、明示的に消す)。
export async function DELETE(req: NextRequest) {
  const nullifier = await getOwnerId(req);
  if (!nullifier) return unauthorized();

  // 削除は連打される類ではないので、ハンドル変更と同じく per-nullifier で控えめに絞る
  const limited = await rateLimit(`users-me-delete:${nullifier}`, 5);
  if (limited) return limited;

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    // body 無しは下の confirmation チェックで弾く
  }

  if (body.confirmation !== "DELETE") {
    return NextResponse.json(
      { error: 'Confirmation required: body must include {"confirmation":"DELETE"}' },
      { status: 400 },
    );
  }

  // nullifier → user_id 解決
  const supabase = getSupabaseAdmin();
  const { data: userRow, error: lookupErr } = await supabase
    .from("ha_users")
    .select("id")
    .eq("nullifier_hash", nullifier)
    .maybeSingle();
  if (lookupErr) {
    logger.error("users-me-delete-lookup-failed", { ...errCtx(lookupErr) });
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
  if (!userRow) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const result = await deleteUserCompletely(userRow.id as string);
  if (!result.deleted) {
    if (result.reason === "not_found") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  // SSO cookie 破棄 (best-effort)。失敗しても削除自体は成功扱い
  try {
    await revokeSsoSession();
  } catch (e) {
    logger.warn("users-me-delete-sso-revoke-failed", { ...errCtx(e) });
  }

  return NextResponse.json({
    deleted: true,
    counts: result.counts,
  });
}
