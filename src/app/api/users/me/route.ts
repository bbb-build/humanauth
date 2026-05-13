import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getOwnerId, unauthorized } from "@/lib/auth-helpers";
import { rateLimit } from "@/lib/rate-limit";
import { getUserEmail, setUserEmail } from "@/lib/email-store";
import { validateEmail } from "@/lib/email-validator";

// 認証中ユーザー（JWT.sub = nullifier_hash）の自プロフィール取得・更新。
// ハンドル変更だけは別ルート /api/users/me/handle に分離（バリデーションが重いため）。
//
// email は ha_users.email に暗号化保存されているため、SELECT には含めず
// レスポンス組立時に email-store 経由で復号して merge する。

const SELECT_COLS =
  "id, handle, handle_is_custom, display_name, avatar_url, email_verified, verification_level, created_at";

async function attachEmail<T extends { id: string; email_verified?: boolean | null }>(
  user: T,
): Promise<T & { email: string | null; email_verified: boolean }> {
  const { email, emailVerified } = await getUserEmail(user.id);
  return { ...user, email, email_verified: emailVerified };
}

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
  const user = await attachEmail(data as { id: string; email_verified?: boolean | null });
  return NextResponse.json({ user });
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

  // email は ha_users.email を直接 update できない (暗号化境界が email-store.ts)。
  // 一旦受け取りだけ済ませ、本体 update の後で setUserEmail を呼ぶ。
  // null/"" でクリア、文字列なら validateEmail → setUserEmail。
  let emailUpdate: { value: string | null } | undefined;
  if ("email" in body) {
    const v = body.email;
    if (v === null || v === "") {
      emailUpdate = { value: null };
    } else {
      const result = validateEmail(v);
      if (!result.ok || !result.normalized) {
        return NextResponse.json(
          { error: result.message ?? "Invalid email" },
          { status: 400 },
        );
      }
      emailUpdate = { value: result.normalized };
    }
  }

  if (Object.keys(updates).length === 0 && !emailUpdate) {
    return NextResponse.json(
      { error: "No updatable fields provided" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdmin();

  // 自レコードの取得 (id が必要 / email 更新が無くても整合のため毎回 select)
  let row: { id: string; email_verified?: boolean | null } | null = null;

  if (Object.keys(updates).length > 0) {
    const { data, error } = await supabase
      .from("ha_users")
      .update(updates)
      .eq("nullifier_hash", nullifier)
      .select(SELECT_COLS)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
    row = data as { id: string; email_verified?: boolean | null };
  } else {
    const { data, error } = await supabase
      .from("ha_users")
      .select(SELECT_COLS)
      .eq("nullifier_hash", nullifier)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    row = data as { id: string; email_verified?: boolean | null };
  }

  // email は自己申告のため email_verified は常に false にリセットする。
  // 検証メールフロー等が後続 PR で入った時点で true に上書きされる想定。
  if (emailUpdate) {
    const ok = await setUserEmail(row.id, emailUpdate.value, { verified: false });
    if (!ok) {
      return NextResponse.json({ error: "Failed to update email" }, { status: 500 });
    }
    // setUserEmail 後に最新値を再 select (email_verified=false 反映後)
    const { data: refetched, error: refetchErr } = await supabase
      .from("ha_users")
      .select(SELECT_COLS)
      .eq("id", row.id)
      .single();
    if (refetchErr || !refetched) {
      return NextResponse.json({ error: "Refetch failed after email update" }, { status: 500 });
    }
    row = refetched as { id: string; email_verified?: boolean | null };
  }

  const user = await attachEmail(row);
  return NextResponse.json({ user });
}
