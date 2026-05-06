import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { encrypt } from "@/lib/crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { generateApiKey, hashApiKey } from "@/lib/api-auth";

// アプリ一覧取得
export async function GET(req: NextRequest) {
  const ownerId = await getOwnerId(req);
  if (!ownerId) return unauthorized();

  const supabase = getSupabaseAdmin();
  const { data: apps } = await supabase
    .from("ha_apps")
    .select("id, name, rp_id, plan, created_at, mau_current_month")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  return NextResponse.json({ apps: apps || [] });
}

// 新規アプリ登録
export async function POST(req: NextRequest) {
  const ownerId = await getOwnerId(req);
  if (!ownerId) return unauthorized();

  const body = await req.json();
  const { name, rp_id, signing_key } = body;

  if (!name || !rp_id || !signing_key) {
    return NextResponse.json(
      { error: "name, rp_id, and signing_key are required" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdmin();

  const signingKeyEncrypted = await encrypt(signing_key);

  const { data: app, error } = await supabase
    .from("ha_apps")
    .insert({
      name,
      rp_id,
      signing_key_encrypted: signingKeyEncrypted,
      owner_id: ownerId,
      plan: "free",
    })
    .select("id, name, rp_id, plan, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 初期APIキーを自動生成
  const rawKey = generateApiKey();
  await supabase.from("ha_api_keys").insert({
    app_id: app.id,
    key_hash: hashApiKey(rawKey),
    name: "Default",
    is_active: true,
  });

  return NextResponse.json({
    app,
    api_key: rawKey, // 初回のみ平文で返す
  });
}

async function getOwnerId(req: NextRequest): Promise<string | null> {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    const payload = await verifyJwt(token);
    return (payload.sub as string) || null;
  } catch {
    return null;
  }
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
