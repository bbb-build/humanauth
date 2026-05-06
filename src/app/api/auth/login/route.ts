import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { signJwt } from "@/lib/jwt";

interface V3Response {
  identifier: string;
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
}

interface V4Response {
  identifier: string;
  proof: string[];
  nullifier: string;
  issuer_schema_id: number;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const appId = process.env.NEXT_PUBLIC_WORLD_APP_ID;
  if (!appId) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  let nullifierHash: string;

  if (body.protocol_version === "4.0") {
    // V4 — responses配列からnullifierを取得
    // V4のCloud API verifyはまだ未提供のため、nullifierのみ使用
    const response = body.responses?.[0] as V4Response | undefined;
    if (!response?.nullifier) {
      return NextResponse.json({ error: "Invalid v4 result" }, { status: 400 });
    }
    nullifierHash = response.nullifier;
  } else {
    // V3 legacy — Cloud APIで検証
    const response = body.responses?.[0] as V3Response | undefined;
    if (!response) {
      return NextResponse.json({ error: "Missing response data" }, { status: 400 });
    }

    const verifyRes = await fetch(
      `https://developer.worldcoin.org/api/v2/verify/${appId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nullifier_hash: response.nullifier_hash,
          merkle_root: response.merkle_root,
          proof: response.proof,
          action: "humanauth-dashboard-login",
        }),
      },
    );

    if (!verifyRes.ok) {
      const text = await verifyRes.text();
      if (!text.includes("already")) {
        return NextResponse.json({ error: "World ID verification failed" }, { status: 401 });
      }
    }

    nullifierHash = response.nullifier_hash;
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
