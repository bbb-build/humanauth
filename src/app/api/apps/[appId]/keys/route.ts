import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { generateApiKey, hashApiKey } from "@/lib/api-auth";
import { getOwnerId } from "@/lib/auth-helpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ appId: string }> }) {
  const { appId } = await params;
  const ownerId = await getOwnerId(req);
  if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();

  const { data: app } = await supabase
    .from("ha_apps")
    .select("id")
    .eq("id", appId)
    .eq("owner_id", ownerId)
    .single();
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: keys } = await supabase
    .from("ha_api_keys")
    .select("id, name, is_active, created_at, last_used_at")
    .eq("app_id", appId)
    .order("created_at", { ascending: false });

  return NextResponse.json({ keys: keys || [] });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ appId: string }> }) {
  const { appId } = await params;
  const ownerId = await getOwnerId(req);
  if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = getSupabaseAdmin();

  const { data: app } = await supabase
    .from("ha_apps")
    .select("id")
    .eq("id", appId)
    .eq("owner_id", ownerId)
    .single();
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rawKey = generateApiKey();
  const { data: key } = await supabase
    .from("ha_api_keys")
    .insert({
      app_id: appId,
      key_hash: hashApiKey(rawKey),
      name: body.name || "New Key",
      is_active: true,
    })
    .select("id, name, created_at")
    .single();

  return NextResponse.json({ key, api_key: rawKey });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ appId: string }> }) {
  const { appId } = await params;
  const ownerId = await getOwnerId(req);
  if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const keyId = body.key_id;
  if (!keyId) return NextResponse.json({ error: "key_id is required" }, { status: 400 });

  const supabase = getSupabaseAdmin();

  const { data: app } = await supabase
    .from("ha_apps")
    .select("id")
    .eq("id", appId)
    .eq("owner_id", ownerId)
    .single();
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error } = await supabase
    .from("ha_api_keys")
    .update({ is_active: false })
    .eq("id", keyId)
    .eq("app_id", appId);

  if (error) return NextResponse.json({ error: "Failed to revoke key" }, { status: 500 });

  return NextResponse.json({ revoked: true });
}
