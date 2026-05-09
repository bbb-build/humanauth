import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getOwnerId, unauthorized } from "@/lib/auth-helpers";

interface RouteContext {
  params: Promise<{ clientId: string }>;
}

async function getOwnerHaUserId(nullifierHash: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("ha_users")
    .select("id")
    .eq("nullifier_hash", nullifierHash)
    .single();
  return (data?.id as string) || null;
}

export async function GET(req: NextRequest, ctx: RouteContext) {
  const ownerNullifier = await getOwnerId(req);
  if (!ownerNullifier) return unauthorized();

  const ownerHaUserId = await getOwnerHaUserId(ownerNullifier);
  if (!ownerHaUserId) return NextResponse.json({ error: "Owner not found" }, { status: 404 });

  const { clientId } = await ctx.params;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ha_oauth_clients")
    .select("client_id, client_type, name, homepage_url, redirect_uris, allowed_scopes, created_at")
    .eq("client_id", clientId)
    .eq("owner_user_id", ownerHaUserId)
    .single();

  if (error || !data) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  return NextResponse.json({ client: data });
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const ownerNullifier = await getOwnerId(req);
  if (!ownerNullifier) return unauthorized();

  const ownerHaUserId = await getOwnerHaUserId(ownerNullifier);
  if (!ownerHaUserId) return NextResponse.json({ error: "Owner not found" }, { status: 404 });

  const { clientId } = await ctx.params;
  const supabase = getSupabaseAdmin();

  // 所有者チェック付きで削除
  const { data: existing } = await supabase
    .from("ha_oauth_clients")
    .select("client_id")
    .eq("client_id", clientId)
    .eq("owner_user_id", ownerHaUserId)
    .single();

  if (!existing) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  await supabase.from("ha_oauth_clients").delete().eq("client_id", clientId);

  return NextResponse.json({ success: true });
}
