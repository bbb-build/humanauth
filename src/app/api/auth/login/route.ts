import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { signJwt } from "@/lib/jwt";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const WORLD_ID_V4_URL = "https://developer.world.org/api/v4/verify";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = await rateLimit(`login:${ip}`, 10);
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rpId = process.env.WORLD_ID_RP_ID;
  if (!rpId) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  if (!body.responses || !Array.isArray(body.responses) || body.responses.length === 0) {
    return NextResponse.json({ error: "Missing responses array" }, { status: 400 });
  }

  const v4Payload = {
    protocol_version: body.protocol_version,
    nonce: body.nonce,
    action: body.action,
    responses: body.responses,
  };

  const verifyRes = await fetch(`${WORLD_ID_V4_URL}/${rpId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(v4Payload),
  });

  if (!verifyRes.ok) {
    return NextResponse.json({ error: "World ID verification failed" }, { status: 401 });
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

  const token = await signJwt({ sub: nullifierHash }, "7d");

  return NextResponse.json({
    token,
    nullifier_hash: nullifierHash,
    is_new_user: !existing?.length,
  });
}
