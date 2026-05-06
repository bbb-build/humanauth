import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { getSupabaseAdmin } from "@/lib/supabase";
import { generateApiKey, hashApiKey } from "@/lib/api-auth";

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
