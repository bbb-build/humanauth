import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

interface VerifyRequest {
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  action: string;
  verification_level?: string;
}

export async function POST(req: NextRequest) {
  const appCtx = await authenticateApiKey(req);
  if (appCtx instanceof NextResponse) return appCtx;

  const body = (await req.json()) as VerifyRequest;

  if (!body.proof || !body.nullifier_hash) {
    return NextResponse.json({ error: "Missing proof or nullifier_hash" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // World ID Cloud APIで検証
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

  // nullifierの保存/重複チェック
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

  // MAUカウント更新
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
