import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getOwnerId, unauthorized } from "@/lib/auth-helpers";
import { logger, errCtx } from "@/lib/logger";

// confidential client の client_secret をローテーション。
// 旧 secret は即座に失効する（grace period なし）。RP側のデプロイと同期して実行する想定。
//
// POST /api/oauth-clients/:clientId/rotate-secret
//   → { client_id, client_secret, note }
//
// public client では 400 を返す（そもそも secret を持たないため）。

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

function generateClientSecret(): string {
  return randomBytes(32).toString("base64url");
}

function hashSecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  const ownerNullifier = await getOwnerId(req);
  if (!ownerNullifier) return unauthorized();

  const ownerHaUserId = await getOwnerHaUserId(ownerNullifier);
  if (!ownerHaUserId) return NextResponse.json({ error: "Owner not found" }, { status: 404 });

  const { clientId } = await ctx.params;
  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from("ha_oauth_clients")
    .select("client_id, client_type")
    .eq("client_id", clientId)
    .eq("owner_user_id", ownerHaUserId)
    .single();

  if (!existing) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  if (existing.client_type !== "confidential") {
    return NextResponse.json(
      { error: "Public clients do not have a client_secret" },
      { status: 400 },
    );
  }

  const newSecret = generateClientSecret();
  const { error } = await supabase
    .from("ha_oauth_clients")
    .update({ client_secret_hash: hashSecret(newSecret) })
    .eq("client_id", clientId);

  if (error) {
    logger.error("oauth-client-rotate-secret-failed", { clientId, ...errCtx(error) });
    return NextResponse.json({ error: "Failed to rotate secret" }, { status: 500 });
  }

  logger.info("oauth-client-secret-rotated", { clientId });

  return NextResponse.json({
    client_id: clientId,
    client_secret: newSecret,
    note: "Save the new client_secret now — it will not be shown again. The previous secret is now invalid.",
  });
}
