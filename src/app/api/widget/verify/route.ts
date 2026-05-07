import { NextRequest, NextResponse } from "next/server";
import { authenticateWidget } from "@/lib/widget-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { rateLimit, getClientIp, VERIFY_MAX } from "@/lib/rate-limit";

interface WidgetVerifyRequest {
  app_id: string;
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  action: string;
  verification_level?: string;
}

const HEX_RE = /^0x[0-9a-fA-F]+$/;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`widget-verify:${ip}`, VERIFY_MAX);
  if (limited) return limited;

  const body = (await req.json()) as WidgetVerifyRequest;

  const appCtx = await authenticateWidget(req, body.app_id);
  if (appCtx instanceof NextResponse) return appCtx;

  if (!body.proof || !body.nullifier_hash || !body.merkle_root) {
    return NextResponse.json({ error: "Missing proof fields" }, { status: 400 });
  }

  if (!HEX_RE.test(body.nullifier_hash) || !HEX_RE.test(body.merkle_root)) {
    return NextResponse.json({ error: "Invalid hex format" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const verifyRes = await fetch(
    `https://developer.worldcoin.org/api/v2/verify/${appCtx.rpId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nullifier_hash: body.nullifier_hash,
        merkle_root: body.merkle_root,
        proof: body.proof,
        action: body.action,
      }),
    },
  );

  const isReplay = !verifyRes.ok && (await verifyRes.text()).includes("already");

  if (!verifyRes.ok && !isReplay) {
    await logVerification(supabase, appCtx.appId, body.nullifier_hash, body.action, false);
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("ha_nullifiers")
    .select("id")
    .eq("app_id", appCtx.appId)
    .eq("nullifier_hash", body.nullifier_hash)
    .single();

  if (!existing) {
    await supabase.from("ha_nullifiers").insert({
      app_id: appCtx.appId,
      nullifier_hash: body.nullifier_hash,
      action: body.action,
      verification_level: body.verification_level || "orb",
    });
  }

  await logVerification(supabase, appCtx.appId, body.nullifier_hash, body.action, true);

  await supabase.rpc("ha_increment_mau", {
    p_app_id: appCtx.appId,
    p_nullifier: body.nullifier_hash,
  });

  return NextResponse.json({
    success: true,
    nullifier_hash: body.nullifier_hash,
    is_new_user: !existing,
    action: body.action,
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
