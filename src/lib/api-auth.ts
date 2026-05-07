import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "./supabase";

export interface AppContext {
  appId: string;
  appName: string;
  signingKeyEncrypted: string;
  rpId: string;
  ownerId: string;
  plan: string;
  mauCurrentMonth: number;
}

export async function authenticateApiKey(req: NextRequest): Promise<AppContext | NextResponse> {
  const apiKey = req.headers.get("x-humanauth-key") || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data: key } = await supabase
    .from("ha_api_keys")
    .select("id, app_id, ha_apps(id, name, signing_key_encrypted, rp_id, owner_id, plan, mau_current_month)")
    .eq("key_hash", hashApiKey(apiKey))
    .eq("is_active", true)
    .single();

  if (!key?.ha_apps) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  await supabase
    .from("ha_api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", key.id);

  const app = key.ha_apps as unknown as {
    id: string;
    name: string;
    signing_key_encrypted: string;
    rp_id: string;
    owner_id: string;
    plan: string;
    mau_current_month: number;
  };

  return {
    appId: app.id,
    appName: app.name,
    signingKeyEncrypted: app.signing_key_encrypted,
    rpId: app.rp_id,
    ownerId: app.owner_id,
    plan: app.plan || "free",
    mauCurrentMonth: app.mau_current_month || 0,
  };
}

export function hashApiKey(key: string): string {
  const crypto = require("node:crypto");
  return crypto.createHash("sha256").update(key).digest("hex");
}

export function generateApiKey(): string {
  const crypto = require("node:crypto");
  return `ha_${crypto.randomBytes(32).toString("hex")}`;
}
