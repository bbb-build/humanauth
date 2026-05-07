import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { rateLimit, getClientIp, VERIFY_MAX } from "@/lib/rate-limit";
import { PLANS, type PlanId } from "@/lib/constants";

const WORLD_ID_V4_URL = "https://developer.world.org/api/v4/verify";
const HEX_RE = /^0x[0-9a-fA-F]+$/;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = await rateLimit(`verify:${ip}`, VERIFY_MAX);
  if (limited) return limited;

  const appCtx = await authenticateApiKey(req);
  if (appCtx instanceof NextResponse) return appCtx;

  const planLimits = PLANS[(appCtx.plan || "free") as PlanId];
  if (planLimits && appCtx.mauCurrentMonth >= planLimits.mauLimit) {
    return NextResponse.json({ error: "MAU limit exceeded. Upgrade your plan." }, { status: 429 });
  }

  const body = await req.json();
  const supabase = getSupabaseAdmin();

  let nullifierHash: string;
  let action: string;

  if (body.idkit_response) {
    // V4フロー: IDKitレスポンスをそのままフォワード
    const idkitResponse = body.idkit_response;
    action = idkitResponse.action || body.action || "humanauth-verify";

    const verifyRes = await fetch(`${WORLD_ID_V4_URL}/${appCtx.rpId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(idkitResponse),
    });

    if (!verifyRes.ok) {
      const errText = await verifyRes.text();
      await logVerification(supabase, appCtx.appId, "", action, false);
      return NextResponse.json({ error: "Verification failed", detail: errText }, { status: 400 });
    }

    const resp = idkitResponse.responses?.[0];
    nullifierHash = resp?.nullifier || resp?.nullifier_hash || "";
  } else {
    // レガシーフラットフィールド
    action = body.action || "humanauth-verify";
    nullifierHash = body.nullifier_hash || "";

    if (!body.proof || !nullifierHash || !body.merkle_root) {
      return NextResponse.json({ error: "Missing proof, merkle_root, or nullifier_hash" }, { status: 400 });
    }

    if (!HEX_RE.test(nullifierHash) || !HEX_RE.test(body.merkle_root)) {
      return NextResponse.json({ error: "Invalid hex format" }, { status: 400 });
    }

    const v4Body = {
      protocol_version: "3.0",
      nonce: body.nonce || "0x0",
      action,
      responses: [
        {
          identifier: body.verification_level || "orb",
          proof: body.proof,
          merkle_root: body.merkle_root,
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
      await logVerification(supabase, appCtx.appId, nullifierHash, action, false);
      return NextResponse.json({ error: "Verification failed", detail: errText }, { status: 400 });
    }
  }

  if (!nullifierHash) {
    return NextResponse.json({ error: "No nullifier in response" }, { status: 400 });
  }

  // 原子的にINSERT（重複時はDO NOTHING）でTOCTOUレースを回避
  // ha_nullifiers に UNIQUE(app_id, nullifier_hash) が必要
  const { data: inserted } = await supabase
    .from("ha_nullifiers")
    .upsert(
      {
        app_id: appCtx.appId,
        nullifier_hash: nullifierHash,
        action,
        verification_level: body.verification_level || "orb",
      },
      { onConflict: "app_id,nullifier_hash", ignoreDuplicates: true },
    )
    .select("id");

  const isNew = (inserted?.length ?? 0) > 0;

  await logVerification(supabase, appCtx.appId, nullifierHash, action, true);

  await supabase.rpc("ha_increment_mau", {
    p_app_id: appCtx.appId,
    p_nullifier: nullifierHash,
  });

  return NextResponse.json({
    success: true,
    nullifier_hash: nullifierHash,
    is_new_user: isNew,
    action,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
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
