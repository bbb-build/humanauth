import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/lib/crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { generateApiKey, hashApiKey } from "@/lib/api-auth";
import { getOwnerId, unauthorized } from "@/lib/auth-helpers";
import { provisionWorldApp } from "@/lib/dev-portal";

// アプリ一覧取得
export async function GET(req: NextRequest) {
  const ownerId = await getOwnerId(req);
  if (!ownerId) return unauthorized();

  const supabase = getSupabaseAdmin();
  const { data: apps } = await supabase
    .from("ha_apps")
    .select("id, name, rp_id, plan, created_at, mau_current_month, website_url, action_name")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  return NextResponse.json({ apps: apps || [] });
}

// 新規アプリ登録（Google Analytics方式: name + website_url だけで完了）
// 裏側でDeveloper Portal APIを呼び、顧客専用のWorld IDアプリを自動作成する
export async function POST(req: NextRequest) {
  const ownerId = await getOwnerId(req);
  if (!ownerId) return unauthorized();

  const body = await req.json();
  const { name, website_url } = body;

  if (!name || typeof name !== "string" || name.length > 100) {
    return NextResponse.json({ error: "App name is required (max 100 chars)" }, { status: 400 });
  }

  if (!website_url || typeof website_url !== "string") {
    return NextResponse.json({ error: "Website URL is required" }, { status: 400 });
  }

  let domain: string;
  let normalizedUrl: string;
  try {
    const url = new URL(website_url.startsWith("http") ? website_url : `https://${website_url}`);
    domain = url.hostname;
    normalizedUrl = url.origin;
  } catch {
    return NextResponse.json({ error: "Invalid website URL" }, { status: 400 });
  }

  // Developer Portal APIで顧客専用のWorld IDアプリを自動プロビジョニング
  let rpId: string;
  let signingKey: string;
  let devPortalAppId: string;

  try {
    const provision = await provisionWorldApp(name, normalizedUrl);
    rpId = provision.rpId;
    signingKey = provision.signingKey;
    devPortalAppId = provision.devPortalAppId;
  } catch (err) {
    console.error("Failed to provision World ID app:", err);
    return NextResponse.json(
      { error: "Failed to create World ID app. Please try again." },
      { status: 502 },
    );
  }

  const signingKeyEncrypted = await encrypt(signingKey);

  const supabase = getSupabaseAdmin();

  const { data: app, error } = await supabase
    .from("ha_apps")
    .insert({
      name,
      website_url: normalizedUrl,
      action_name: "verify",
      rp_id: rpId,
      dev_portal_app_id: devPortalAppId,
      signing_key_encrypted: signingKeyEncrypted,
      owner_id: ownerId,
      plan: "free",
      widget_enabled: true,
      allowed_domains: [domain],
    })
    .select("id, name, plan, created_at, website_url, action_name")
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://humanauth.vercel.app";

  return NextResponse.json({
    app,
    api_key: rawKey,
    embed_code: `<script src="${baseUrl}/widget/v1.js"></script>\n<div data-humanauth data-app-id="${app.id}"></div>`,
    note: "World ID registration is being confirmed on-chain. Verification will be ready in ~30 seconds.",
  });
}
