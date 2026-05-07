import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest, { params }: { params: Promise<{ appId: string }> }) {
  const { appId } = await params;
  const ownerId = await getOwnerId(req);
  if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("ha_apps")
    .select("widget_enabled, allowed_domains")
    .eq("id", appId)
    .eq("owner_id", ownerId)
    .single();

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ appId: string }> }) {
  const { appId } = await params;
  const ownerId = await getOwnerId(req);
  if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = getSupabaseAdmin();

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (typeof body.widget_enabled === "boolean") {
    update.widget_enabled = body.widget_enabled;
  }

  if (Array.isArray(body.allowed_domains)) {
    update.allowed_domains = body.allowed_domains
      .map((d: string) => d.trim().toLowerCase())
      .filter(Boolean);
  }

  const { data, error } = await supabase
    .from("ha_apps")
    .update(update)
    .eq("id", appId)
    .eq("owner_id", ownerId)
    .select("widget_enabled, allowed_domains")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json(data);
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
