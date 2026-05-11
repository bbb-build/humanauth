import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getOwnerId, unauthorized } from "@/lib/auth-helpers";
import { SUPPORTED_SCOPES } from "@/lib/oauth";
import { logger, errCtx } from "@/lib/logger";

// OAuth Client管理API。既存ダッシュボードJWT認証を流用。
// JWT.sub = ダッシュボードログイン時のnullifier_hash（action=humanauth-dashboard-login）

// nullifier_hash → ha_users.id を取得（無ければ作成）
async function resolveDashboardOwnerHaUser(nullifierHash: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from("ha_users")
    .select("id")
    .eq("nullifier_hash", nullifierHash)
    .single();

  if (existing) return existing.id as string;

  // ダッシュボードログイン用のnullifierでha_usersを作る（owner専用の開発者アカウント）
  const { data: handleData } = await supabase.rpc("ha_generate_handle", {
    p_nullifier: nullifierHash,
  });
  if (!handleData) return null;

  const { data: created } = await supabase
    .from("ha_users")
    .insert({
      nullifier_hash: nullifierHash,
      handle: handleData as unknown as string,
      verification_level: "orb",
    })
    .select("id")
    .single();

  return (created?.id as string) || null;
}

function generateClientId(): string {
  // ha_oauth_xxxxxxxx 形式（既存ha_apps系の命名と並走）
  return `ha_oauth_${randomBytes(8).toString("hex")}`;
}

function generateClientSecret(): string {
  return randomBytes(32).toString("base64url");
}

function hashSecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

export async function GET(req: NextRequest) {
  const ownerNullifier = await getOwnerId(req);
  if (!ownerNullifier) return unauthorized();

  const ownerHaUserId = await resolveDashboardOwnerHaUser(ownerNullifier);
  if (!ownerHaUserId) return NextResponse.json({ error: "Failed to resolve owner" }, { status: 500 });

  const supabase = getSupabaseAdmin();
  const { data: clients } = await supabase
    .from("ha_oauth_clients")
    .select("client_id, client_type, name, homepage_url, redirect_uris, allowed_scopes, created_at")
    .eq("owner_user_id", ownerHaUserId)
    .order("created_at", { ascending: false });

  return NextResponse.json({ clients: clients || [] });
}

export async function POST(req: NextRequest) {
  const ownerNullifier = await getOwnerId(req);
  if (!ownerNullifier) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const { name, homepage_url, redirect_uris, client_type, allowed_scopes } = body as {
    name?: string;
    homepage_url?: string;
    redirect_uris?: string[];
    client_type?: "public" | "confidential";
    allowed_scopes?: string[];
  };

  if (!name || typeof name !== "string" || name.length > 100) {
    return NextResponse.json({ error: "name is required (max 100 chars)" }, { status: 400 });
  }
  if (!Array.isArray(redirect_uris) || redirect_uris.length === 0) {
    return NextResponse.json({ error: "At least one redirect_uri is required" }, { status: 400 });
  }
  // redirect_uri検証: https必須（localhostは例外）
  for (const uri of redirect_uris) {
    if (typeof uri !== "string") {
      return NextResponse.json({ error: "redirect_uri must be string" }, { status: 400 });
    }
    try {
      const u = new URL(uri);
      const isLocal = u.hostname === "localhost" || u.hostname === "127.0.0.1";
      if (u.protocol !== "https:" && !isLocal) {
        return NextResponse.json(
          { error: `redirect_uri must use https (or localhost): ${uri}` },
          { status: 400 },
        );
      }
    } catch {
      return NextResponse.json({ error: `Invalid redirect_uri: ${uri}` }, { status: 400 });
    }
  }
  const ctype: "public" | "confidential" = client_type === "confidential" ? "confidential" : "public";
  const scopes = Array.isArray(allowed_scopes) && allowed_scopes.length > 0
    ? allowed_scopes.filter((s) => (SUPPORTED_SCOPES as readonly string[]).includes(s))
    : ["openid", "profile", "verified_human"];

  const ownerHaUserId = await resolveDashboardOwnerHaUser(ownerNullifier);
  if (!ownerHaUserId) return NextResponse.json({ error: "Failed to resolve owner" }, { status: 500 });

  const clientId = generateClientId();
  const clientSecret = ctype === "confidential" ? generateClientSecret() : null;

  const supabase = getSupabaseAdmin();
  const { data: client, error } = await supabase
    .from("ha_oauth_clients")
    .insert({
      client_id: clientId,
      client_secret_hash: clientSecret ? hashSecret(clientSecret) : null,
      client_type: ctype,
      name,
      homepage_url: homepage_url || null,
      redirect_uris,
      allowed_scopes: scopes,
      owner_user_id: ownerHaUserId,
    })
    .select("client_id, client_type, name, homepage_url, redirect_uris, allowed_scopes, created_at")
    .single();

  if (error) {
    logger.error("oauth-client-create-failed", { ownerHaUserId, ...errCtx(error) });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  logger.info("oauth-client-created", {
    clientId,
    clientType: ctype,
    ownerHaUserId,
    redirectUriCount: redirect_uris.length,
    scopes,
  });

  return NextResponse.json({
    client,
    // confidentialのみclient_secretを一度だけ返す
    client_secret: clientSecret,
    note: clientSecret
      ? "Save the client_secret now — it will not be shown again."
      : "Public client (PKCE only). No client_secret needed.",
  });
}
