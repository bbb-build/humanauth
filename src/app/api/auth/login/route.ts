import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { signJwt } from "@/lib/jwt";

const WORLD_ID_V4_URL = "https://developer.world.org/api/v4/verify";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const rpId = process.env.WORLD_ID_RP_ID;
  if (!rpId) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  // IDKitレスポンス全体をV4 APIにフォワード
  const verifyRes = await fetch(`${WORLD_ID_V4_URL}/${rpId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!verifyRes.ok) {
    const errText = await verifyRes.text();
    if (!errText.includes("already")) {
      return NextResponse.json({ error: "World ID verification failed" }, { status: 401 });
    }
  }

  // nullifierを抽出（V4/V3両対応）
  const response = body.responses?.[0];
  const nullifierHash = response?.nullifier || response?.nullifier_hash || "";

  if (!nullifierHash) {
    return NextResponse.json({ error: "No nullifier in response" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from("ha_apps")
    .select("owner_id")
    .eq("owner_id", nullifierHash)
    .limit(1);

  const token = await signJwt({ sub: nullifierHash }, "30d");

  return NextResponse.json({
    token,
    nullifier_hash: nullifierHash,
    is_new_user: !existing?.length,
  });
}
