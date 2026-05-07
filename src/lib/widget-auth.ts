import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "./supabase";

export interface WidgetAppContext {
  appId: string;
  appName: string;
  signingKeyEncrypted: string;
  rpId: string;
  ownerId: string;
  plan: string;
  mauCurrentMonth: number;
}

export async function authenticateWidget(
  req: NextRequest,
  appId: string,
): Promise<WidgetAppContext | NextResponse> {
  if (!appId) {
    return NextResponse.json({ error: "Missing app_id" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: app } = await supabase
    .from("ha_apps")
    .select("id, name, signing_key_encrypted, rp_id, owner_id, widget_enabled, allowed_domains, plan, mau_current_month")
    .eq("id", appId)
    .single();

  if (!app) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  if (!app.widget_enabled) {
    return NextResponse.json({ error: "Widget not enabled for this app" }, { status: 403 });
  }

  const origin = req.headers.get("origin") || req.headers.get("referer");
  const domains: string[] = app.allowed_domains || [];

  if (domains.length > 0) {
    if (!origin) {
      return NextResponse.json({ error: "Origin header required for domain-restricted apps" }, { status: 403 });
    }
    const originHost = extractHost(origin);
    const allowed = domains.some((d: string) => originHost === d || originHost.endsWith(`.${d}`));
    if (!allowed) {
      return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
    }
  }

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

function extractHost(urlOrOrigin: string): string {
  try {
    return new URL(urlOrOrigin).hostname;
  } catch {
    return urlOrOrigin;
  }
}
