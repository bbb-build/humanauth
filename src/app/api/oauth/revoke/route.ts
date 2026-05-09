import { NextRequest, NextResponse } from "next/server";
import { hashToken } from "@/lib/oauth";
import { getSupabaseAdmin } from "@/lib/supabase";

// RFC 7009 Token Revocation
// POST /api/oauth/revoke
//   token=xxx & token_type_hint=access_token|refresh_token
// 仕様: トークンが存在しなくても200を返す（攻撃者に情報を渡さない）

export async function POST(req: NextRequest) {
  const ct = req.headers.get("content-type") || "";
  let token = "";
  if (ct.includes("application/x-www-form-urlencoded")) {
    const form = new URLSearchParams(await req.text());
    token = form.get("token") || "";
  } else if (ct.includes("application/json")) {
    const body = (await req.json()) as { token?: string };
    token = body.token || "";
  }

  if (!token) return NextResponse.json({}, { status: 200 });

  const supabase = getSupabaseAdmin();
  await supabase
    .from("ha_oauth_tokens")
    .update({ revoked_at: new Date().toISOString() })
    .eq("token_hash", hashToken(token))
    .is("revoked_at", null);

  return NextResponse.json({}, { status: 200 });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
