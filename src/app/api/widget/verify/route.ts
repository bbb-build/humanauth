import { NextRequest, NextResponse } from "next/server";
import { authenticateWidget } from "@/lib/widget-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { rateLimit, getClientIp, VERIFY_MAX } from "@/lib/rate-limit";

const WORLD_ID_V4_URL = "https://developer.world.org/api/v4/verify";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`widget-verify:${ip}`, VERIFY_MAX);
  if (limited) return limited;

  const body = await req.json();
  const appId = body.app_id;

  const appCtx = await authenticateWidget(req, appId);
  if (appCtx instanceof NextResponse) return appCtx;

  const supabase = getSupabaseAdmin();

  let nullifierHash: string;
  let action: string;

  if (body.idkit_response) {
    // V4フロー: IDKitレスポンスをそのままV4 APIにフォワード
    const idkitResponse = body.idkit_response;
    action = idkitResponse.action || body.action || "humanauth-verify";

    const verifyRes = await fetch(`${WORLD_ID_V4_URL}/${appCtx.rpId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(idkitResponse),
    });

    if (!verifyRes.ok) {
      const errText = await verifyRes.text();
      const isReplay = errText.includes("already");
      if (!isReplay) {
        await logVerification(supabase, appCtx.appId, "", action, false);
        return NextResponse.json({ error: "Verification failed", detail: errText }, { status: 400 });
      }
    }

    const resp = idkitResponse.responses?.[0];
    nullifierHash = resp?.nullifier || resp?.nullifier_hash || "";
  } else {
    // レガシーフラットフィールド（V2互換）
    const { proof, merkle_root, nullifier_hash: nh, action: bodyAction } = body;
    action = bodyAction || "humanauth-verify";
    nullifierHash = nh || "";

    if (!proof || !nullifierHash || !merkle_root) {
      return NextResponse.json({ error: "Missing proof fields" }, { status: 400 });
    }

    const HEX_RE = /^0x[0-9a-fA-F]+$/;
    if (!HEX_RE.test(nullifierHash) || !HEX_RE.test(merkle_root)) {
      return NextResponse.json({ error: "Invalid hex format" }, { status: 400 });
    }

    // レガシーフィールドをV4形式に変換
    const v4Body = {
      protocol_version: "3.0",
      nonce: body.nonce || "0x0",
      action,
      responses: [
        {
          identifier: body.verification_level || "orb",
          proof,
          merkle_root,
          nullifier: nullifierHash,
          signal_hash: "0x00c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a4",
        },
      ],
    };

    const verifyRes = await fetch(`${WORLD_ID_V4_URL}/${appCtx.rpId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v4Body),
    });

    if (!verifyRes.ok) {
      const errText = await verifyRes.text();
      const isReplay = errText.includes("already");
      if (!isReplay) {
        await logVerification(supabase, appCtx.appId, nullifierHash, action, false);
        return NextResponse.json({ error: "Verification failed" }, { status: 400 });
      }
    }
  }

  if (!nullifierHash) {
    return NextResponse.json({ error: "No nullifier in response" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("ha_nullifiers")
    .select("id")
    .eq("app_id", appCtx.appId)
    .eq("nullifier_hash", nullifierHash)
    .single();

  if (!existing) {
    await supabase.from("ha_nullifiers").insert({
      app_id: appCtx.appId,
      nullifier_hash: nullifierHash,
      action,
      verification_level: body.verification_level || "orb",
    });
  }

  await logVerification(supabase, appCtx.appId, nullifierHash, action, true);

  await supabase.rpc("ha_increment_mau", {
    p_app_id: appCtx.appId,
    p_nullifier: nullifierHash,
  });

  return NextResponse.json({
    success: true,
    nullifier_hash: nullifierHash,
    is_new_user: !existing,
    action,
  });
}

async function logVerification(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  appId: string,
  nullifier: string,
  action: string,
  success: boolean,
) {
  await supabase.from("ha_verification_logs").insert({
    app_id: appId,
    nullifier_hash: nullifier,
    action,
    success,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
