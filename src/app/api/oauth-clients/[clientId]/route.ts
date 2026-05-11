import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getOwnerId, unauthorized } from "@/lib/auth-helpers";
import { SUPPORTED_SCOPES } from "@/lib/oauth";
import { logger, errCtx } from "@/lib/logger";

interface RouteContext {
  params: Promise<{ clientId: string }>;
}

async function getOwnerHaUserId(nullifierHash: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("ha_users")
    .select("id")
    .eq("nullifier_hash", nullifierHash)
    .single();
  return (data?.id as string) || null;
}

export async function GET(req: NextRequest, ctx: RouteContext) {
  const ownerNullifier = await getOwnerId(req);
  if (!ownerNullifier) return unauthorized();

  const ownerHaUserId = await getOwnerHaUserId(ownerNullifier);
  if (!ownerHaUserId) return NextResponse.json({ error: "Owner not found" }, { status: 404 });

  const { clientId } = await ctx.params;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ha_oauth_clients")
    .select("client_id, client_type, name, homepage_url, redirect_uris, allowed_scopes, created_at")
    .eq("client_id", clientId)
    .eq("owner_user_id", ownerHaUserId)
    .single();

  if (error || !data) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  return NextResponse.json({ client: data });
}

// 編集可能フィールド: name / homepage_url / redirect_uris / allowed_scopes
// client_id / client_type / client_secret は不変（既存RPに影響するため）
// client_secret のローテーションは別エンドポイント（B-7予定）
export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const ownerNullifier = await getOwnerId(req);
  if (!ownerNullifier) return unauthorized();

  const ownerHaUserId = await getOwnerHaUserId(ownerNullifier);
  if (!ownerHaUserId) return NextResponse.json({ error: "Owner not found" }, { status: 404 });

  const { clientId } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const { name, homepage_url, redirect_uris, allowed_scopes } = body as {
    name?: string;
    homepage_url?: string | null;
    redirect_uris?: string[];
    allowed_scopes?: string[];
  };

  // 部分更新。各フィールドが渡されたものだけ検証する
  const update: Record<string, unknown> = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.length === 0 || name.length > 100) {
      return NextResponse.json({ error: "name must be 1-100 chars" }, { status: 400 });
    }
    update.name = name;
  }

  if (homepage_url !== undefined) {
    if (homepage_url !== null && (typeof homepage_url !== "string" || homepage_url.length > 500)) {
      return NextResponse.json({ error: "homepage_url must be string (max 500 chars) or null" }, { status: 400 });
    }
    update.homepage_url = homepage_url || null;
  }

  if (redirect_uris !== undefined) {
    if (!Array.isArray(redirect_uris) || redirect_uris.length === 0) {
      return NextResponse.json({ error: "At least one redirect_uri is required" }, { status: 400 });
    }
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
    update.redirect_uris = redirect_uris;
  }

  if (allowed_scopes !== undefined) {
    if (!Array.isArray(allowed_scopes) || allowed_scopes.length === 0) {
      return NextResponse.json({ error: "At least one scope is required" }, { status: 400 });
    }
    const filtered = allowed_scopes.filter((s) => (SUPPORTED_SCOPES as readonly string[]).includes(s));
    if (filtered.length === 0) {
      return NextResponse.json({ error: "No valid scopes provided" }, { status: 400 });
    }
    if (!filtered.includes("openid")) {
      return NextResponse.json({ error: "openid scope is required" }, { status: 400 });
    }
    update.allowed_scopes = filtered;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No editable fields provided" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // 所有者チェック付きで更新
  const { data: existing } = await supabase
    .from("ha_oauth_clients")
    .select("client_id")
    .eq("client_id", clientId)
    .eq("owner_user_id", ownerHaUserId)
    .single();
  if (!existing) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const { data: updated, error } = await supabase
    .from("ha_oauth_clients")
    .update(update)
    .eq("client_id", clientId)
    .select("client_id, client_type, name, homepage_url, redirect_uris, allowed_scopes, created_at")
    .single();

  if (error || !updated) {
    logger.error("oauth-client-update-failed", { clientId, ...errCtx(error) });
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }

  return NextResponse.json({ client: updated });
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const ownerNullifier = await getOwnerId(req);
  if (!ownerNullifier) return unauthorized();

  const ownerHaUserId = await getOwnerHaUserId(ownerNullifier);
  if (!ownerHaUserId) return NextResponse.json({ error: "Owner not found" }, { status: 404 });

  const { clientId } = await ctx.params;
  const supabase = getSupabaseAdmin();

  // 所有者チェック付きで削除
  const { data: existing } = await supabase
    .from("ha_oauth_clients")
    .select("client_id")
    .eq("client_id", clientId)
    .eq("owner_user_id", ownerHaUserId)
    .single();

  if (!existing) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  await supabase.from("ha_oauth_clients").delete().eq("client_id", clientId);

  return NextResponse.json({ success: true });
}
