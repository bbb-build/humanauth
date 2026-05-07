import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getOwnerId } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const ownerId = await getOwnerId(req);
  if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();

  const { data: apps } = await supabase
    .from("ha_apps")
    .select("id, name, rp_id, plan, mau_current_month, created_at")
    .eq("owner_id", ownerId);

  if (!apps?.length) {
    return NextResponse.json({ total_apps: 0, total_mau: 0, total_verifications: 0, apps: [] });
  }

  const appIds = apps.map((a) => a.id);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: totalVerifications } = await supabase
    .from("ha_verification_logs")
    .select("id", { count: "exact", head: true })
    .in("app_id", appIds)
    .gte("created_at", startOfMonth.toISOString());

  return NextResponse.json({
    total_apps: apps.length,
    total_mau: apps.reduce((sum, a) => sum + (a.mau_current_month || 0), 0),
    total_verifications: totalVerifications || 0,
    apps,
  });
}
