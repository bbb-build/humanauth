import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getOwnerId, unauthorized } from "@/lib/auth-helpers";
import { rateLimit } from "@/lib/rate-limit";
import { validateHandle } from "@/lib/handle";

// ハンドル（preferred_username）の変更。
// ・ユーザー任意の `@xxx` を最大1件保持。形式・予約語・ユニーク制約を全て満たすこと
// ・成功すると handle_is_custom = true に固定される（自動生成への巻き戻し不可）
// ・レート制限: 同一ユーザーから1時間あたり10回まで（誤入力許容＋スパム抑制）

export async function PATCH(req: NextRequest) {
  const nullifier = await getOwnerId(req);
  if (!nullifier) return unauthorized();

  const limited = await rateLimit(`users-me-handle:${nullifier}`, 10);
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validation = validateHandle(body.handle);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  const newHandle = validation.normalized;

  const supabase = getSupabaseAdmin();

  // 自分の現handleを取得。同一なら no-op で返す
  const { data: me } = await supabase
    .from("ha_users")
    .select("id, handle")
    .eq("nullifier_hash", nullifier)
    .single();

  if (!me) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (me.handle === newHandle) {
    return NextResponse.json({ user: me, unchanged: true });
  }

  // ユニーク制約チェック（大文字小文字を区別しない）
  // DBの handle 列はcitextではないので明示的に ilike で衝突確認
  const { data: collide } = await supabase
    .from("ha_users")
    .select("id")
    .ilike("handle", newHandle)
    .neq("id", me.id)
    .limit(1)
    .maybeSingle();

  if (collide) {
    return NextResponse.json({ error: "Handle is already taken" }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("ha_users")
    .update({ handle: newHandle, handle_is_custom: true })
    .eq("id", me.id)
    .select(
      "id, handle, handle_is_custom, display_name, avatar_url, email, email_verified, verification_level, created_at",
    )
    .single();

  if (error || !data) {
    // UNIQUE制約レース時のフォールバック
    if (error?.code === "23505") {
      return NextResponse.json({ error: "Handle is already taken" }, { status: 409 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ user: data });
}
