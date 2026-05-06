import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest, { params }: { params: Promise<{ appId: string }> }) {
  const { appId } = await params;
  const ownerId = await getOwnerId(req);
  if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data: app } = await supabase
    .from("ha_apps")
    .select("id, name, rp_id, plan, mau_current_month, created_at")
    .eq("id", appId)
    .eq("owner_id", ownerId)
    .single();

  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // 直近の認証ログ
  const { data: logs } = await supabase
    .from("ha_verification_logs")
    .select("id, nullifier_hash, action, success, created_at")
    .eq("app_id", appId)
    .order("created_at", { ascending: false })
    .limit(50);

  // ユニークユーザー数
  const { count } = await supabase
    .from("ha_nullifiers")
    .select("id", { count: "exact", head: true })
    .eq("app_id", appId);

  return NextResponse.json({
    app,
    unique_users: count || 0,
    recent_logs: logs || [],
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
