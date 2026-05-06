import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let ownerId: string;
  try {
    const payload = await verifyJwt(token);
    ownerId = payload.sub as string;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  const { data: apps } = await supabase
    .from("ha_apps")
    .select("id, name, plan, mau_current_month, created_at")
    .eq("owner_id", ownerId);

  if (!apps?.length) {
    return NextResponse.json({ total_apps: 0, total_mau: 0, total_verifications: 0, apps: [] });
  }

  const appIds = apps.map((a) => a.id);

  // 今月の合計認証数
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
