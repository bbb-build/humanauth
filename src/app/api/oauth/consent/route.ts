import { NextRequest, NextResponse } from "next/server";
import { getSsoUserId } from "@/lib/sso-session";
import { recordConsent, parseScopes } from "@/lib/oauth";

// /oauth/consent 画面から呼ばれる: ユーザーが同意 → 同意記録 → return_toへ戻る
// POST /api/oauth/consent
//   { client_id, scope, return_to }

export async function POST(req: NextRequest) {
  const userId = await getSsoUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = (await req.json()) as { client_id?: string; scope?: string; return_to?: string };
  const { client_id, scope, return_to } = body;
  if (!client_id || !scope || !return_to) {
    return NextResponse.json({ error: "client_id, scope, return_to are required" }, { status: 400 });
  }

  const scopes = parseScopes(scope);
  if (scopes.length === 0) {
    return NextResponse.json({ error: "Invalid scope" }, { status: 400 });
  }

  // return_toは内部パスのみ許可（オープンリダイレクト防止）
  if (!return_to.startsWith("/api/oauth/authorize")) {
    return NextResponse.json({ error: "Invalid return_to" }, { status: 400 });
  }

  await recordConsent(userId, client_id, scopes);

  return NextResponse.json({ success: true, return_to });
}
