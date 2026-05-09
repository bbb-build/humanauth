import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { HUMANARY_LOGIN_ACTION } from "@/lib/oauth";
import { createSsoSession, setSsoCookie } from "@/lib/sso-session";

// /oauth/signin 画面から呼ばれる: World ID固定action(humanary-login-v1)で認証
// → ha_users に upsert → SSOセッション作成 → cookieセット
//
// HumanauryのRP IDで認証する。これがHumanary独自のIDレイヤーの根幹。
// 環境変数:
//   HUMANARY_LOGIN_RP_ID: World Developer Portal上のHumanary専用RP ID
//   HUMANARY_LOGIN_WORLD_APP_ID: World Developer Portal上のHumanary専用app_id

const WORLD_ID_V4_URL = "https://developer.world.org/api/v4/verify";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = await rateLimit(`oauth-login:${ip}`, 10);
  if (limited) return limited;

  const rpId = process.env.HUMANARY_LOGIN_RP_ID;
  if (!rpId) return NextResponse.json({ error: "Server misconfigured: HUMANARY_LOGIN_RP_ID" }, { status: 500 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // V4 IDKitレスポンス必須
  if (!body.responses || !Array.isArray(body.responses) || body.responses.length === 0) {
    return NextResponse.json({ error: "Missing responses array" }, { status: 400 });
  }

  // actionは固定。クライアントが別actionを投げても無視（World ID側で検証されるが念押し）
  const v4Payload = {
    protocol_version: body.protocol_version,
    nonce: body.nonce,
    action: HUMANARY_LOGIN_ACTION,
    responses: body.responses,
  };

  const verifyRes = await fetch(`${WORLD_ID_V4_URL}/${rpId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(v4Payload),
  });

  if (!verifyRes.ok) {
    const detail = await verifyRes.text();
    return NextResponse.json({ error: "World ID verification failed", detail }, { status: 401 });
  }

  const response = (body.responses as Array<Record<string, unknown>>)[0];
  const nullifierHash = (response?.nullifier as string) || (response?.nullifier_hash as string) || "";
  const verificationLevel = (response?.identifier as string) === "device" ? "device" : "orb";

  if (!nullifierHash) {
    return NextResponse.json({ error: "No nullifier in response" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // ha_users upsert
  const { data: existing } = await supabase
    .from("ha_users")
    .select("id")
    .eq("nullifier_hash", nullifierHash)
    .single();

  let userId: string;
  let isNewUser = false;

  if (existing) {
    userId = existing.id as string;
  } else {
    isNewUser = true;
    // ハンドル自動生成
    const { data: handleData, error: handleErr } = await supabase.rpc("ha_generate_handle", {
      p_nullifier: nullifierHash,
    });
    if (handleErr || !handleData) {
      return NextResponse.json({ error: "Failed to generate handle" }, { status: 500 });
    }
    const { data: created, error: createErr } = await supabase
      .from("ha_users")
      .insert({
        nullifier_hash: nullifierHash,
        handle: handleData as unknown as string,
        verification_level: verificationLevel,
      })
      .select("id")
      .single();
    if (createErr || !created) {
      return NextResponse.json({ error: "Failed to create user", detail: createErr?.message }, { status: 500 });
    }
    userId = created.id as string;
  }

  // SSOセッション作成 + cookie
  const ua = req.headers.get("user-agent") || undefined;
  const sessionId = await createSsoSession({ userId, ipAddress: ip, userAgent: ua });
  await setSsoCookie(sessionId);

  return NextResponse.json({
    success: true,
    user_id: userId,
    is_new_user: isNewUser,
  });
}
