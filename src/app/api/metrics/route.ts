import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getOwnerId, unauthorized } from "@/lib/auth-helpers";
import { logger, errCtx } from "@/lib/logger";

// Owner 視点のクライアント別利用統計。
// ダッシュボードJWT必須（/api/dashboard/stats と同じ getOwnerId 経路）。
// owner が所有する ha_oauth_clients に限定して集計する。

const PERIOD_DAYS: Record<string, number | null> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  all: null,
};

interface ClientMetrics {
  client_id: string;
  name: string;
  tokens_issued: number;
  tokens_refreshed: number;
  active_tokens: number;
  unique_users: number;
  userinfo_calls: number;
  consents_active: number;
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

export async function GET(req: NextRequest) {
  const ownerNullifier = await getOwnerId(req);
  if (!ownerNullifier) return unauthorized();

  const ownerHaUserId = await getOwnerHaUserId(ownerNullifier);
  if (!ownerHaUserId) return NextResponse.json({ error: "Owner not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const periodParam = searchParams.get("period") || "30d";
  if (!(periodParam in PERIOD_DAYS)) {
    return NextResponse.json(
      { error: `Invalid period. Use one of: ${Object.keys(PERIOD_DAYS).join(", ")}` },
      { status: 400 },
    );
  }
  const days = PERIOD_DAYS[periodParam];
  const filterClientId = searchParams.get("clientId");

  const since = days === null ? null : new Date(Date.now() - days * 86_400_000);
  const sinceIso = since?.toISOString() ?? null;
  const nowIso = new Date().toISOString();

  const supabase = getSupabaseAdmin();

  // 1) owner のクライアント一覧
  let clientsQuery = supabase
    .from("ha_oauth_clients")
    .select("client_id, name")
    .eq("owner_user_id", ownerHaUserId);
  if (filterClientId) clientsQuery = clientsQuery.eq("client_id", filterClientId);

  const { data: clientRows, error: clientsErr } = await clientsQuery;
  if (clientsErr) {
    logger.error("metrics-clients-fetch-failed", { ownerHaUserId, ...errCtx(clientsErr) });
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }

  const clients = clientRows ?? [];
  if (clients.length === 0) {
    return NextResponse.json({
      period: periodParam,
      since: sinceIso,
      now: nowIso,
      clients: [],
      totals: emptyTotals(),
    });
  }

  const clientIds = clients.map((c) => c.client_id as string);

  // 2) 期間内に発行された access token（ha_oauth_tokens）
  let issuedQuery = supabase
    .from("ha_oauth_tokens")
    .select("client_id, user_id, created_at")
    .eq("token_type", "access")
    .in("client_id", clientIds);
  if (sinceIso) issuedQuery = issuedQuery.gte("created_at", sinceIso);
  const { data: issuedRows, error: issuedErr } = await issuedQuery;
  if (issuedErr) {
    logger.error("metrics-issued-fetch-failed", { ownerHaUserId, ...errCtx(issuedErr) });
    return NextResponse.json({ error: "Failed to fetch issued tokens" }, { status: 500 });
  }

  // 3) 現時点で有効な access token 数（期間に依らない瞬間値）
  const { data: activeRows, error: activeErr } = await supabase
    .from("ha_oauth_tokens")
    .select("client_id")
    .eq("token_type", "access")
    .in("client_id", clientIds)
    .is("revoked_at", null)
    .gt("expires_at", nowIso);
  if (activeErr) {
    logger.error("metrics-active-fetch-failed", { ownerHaUserId, ...errCtx(activeErr) });
    return NextResponse.json({ error: "Failed to fetch active tokens" }, { status: 500 });
  }

  // 4) 期間内のアクセスログ（refresh / userinfo の回数集計用）
  let logsQuery = supabase
    .from("ha_access_logs")
    .select("client_id, endpoint")
    .in("client_id", clientIds)
    .in("endpoint", ["token_refresh", "userinfo"]);
  if (sinceIso) logsQuery = logsQuery.gte("created_at", sinceIso);
  const { data: logRows, error: logsErr } = await logsQuery;
  if (logsErr) {
    logger.error("metrics-logs-fetch-failed", { ownerHaUserId, ...errCtx(logsErr) });
    return NextResponse.json({ error: "Failed to fetch access logs" }, { status: 500 });
  }

  // 5) 現在有効な consent 数（期間に依らない瞬間値）
  const { data: consentRows, error: consentErr } = await supabase
    .from("ha_oauth_consents")
    .select("client_id")
    .in("client_id", clientIds)
    .is("revoked_at", null);
  if (consentErr) {
    logger.error("metrics-consents-fetch-failed", { ownerHaUserId, ...errCtx(consentErr) });
    return NextResponse.json({ error: "Failed to fetch consents" }, { status: 500 });
  }

  // 集計
  const issuedByClient = new Map<string, number>();
  const usersByClient = new Map<string, Set<string>>();
  for (const row of issuedRows ?? []) {
    const cid = row.client_id as string;
    issuedByClient.set(cid, (issuedByClient.get(cid) ?? 0) + 1);
    if (!usersByClient.has(cid)) usersByClient.set(cid, new Set());
    usersByClient.get(cid)!.add(row.user_id as string);
  }

  const activeByClient = new Map<string, number>();
  for (const row of activeRows ?? []) {
    const cid = row.client_id as string;
    activeByClient.set(cid, (activeByClient.get(cid) ?? 0) + 1);
  }

  const refreshByClient = new Map<string, number>();
  const userinfoByClient = new Map<string, number>();
  for (const row of logRows ?? []) {
    const cid = row.client_id as string;
    if (row.endpoint === "token_refresh") {
      refreshByClient.set(cid, (refreshByClient.get(cid) ?? 0) + 1);
    } else if (row.endpoint === "userinfo") {
      userinfoByClient.set(cid, (userinfoByClient.get(cid) ?? 0) + 1);
    }
  }

  const consentsByClient = new Map<string, number>();
  for (const row of consentRows ?? []) {
    const cid = row.client_id as string;
    consentsByClient.set(cid, (consentsByClient.get(cid) ?? 0) + 1);
  }

  const perClient: ClientMetrics[] = clients.map((c) => {
    const cid = c.client_id as string;
    return {
      client_id: cid,
      name: (c.name as string) ?? "",
      tokens_issued: issuedByClient.get(cid) ?? 0,
      tokens_refreshed: refreshByClient.get(cid) ?? 0,
      active_tokens: activeByClient.get(cid) ?? 0,
      unique_users: usersByClient.get(cid)?.size ?? 0,
      userinfo_calls: userinfoByClient.get(cid) ?? 0,
      consents_active: consentsByClient.get(cid) ?? 0,
    };
  });

  // totals: ユニークユーザは「owner 全クライアント横断」での重複排除
  const allUsers = new Set<string>();
  for (const set of usersByClient.values()) for (const u of set) allUsers.add(u);

  const totals = perClient.reduce(
    (acc, m) => {
      acc.tokens_issued += m.tokens_issued;
      acc.tokens_refreshed += m.tokens_refreshed;
      acc.active_tokens += m.active_tokens;
      acc.userinfo_calls += m.userinfo_calls;
      acc.consents_active += m.consents_active;
      return acc;
    },
    { ...emptyTotals(), unique_users: allUsers.size },
  );

  return NextResponse.json({
    period: periodParam,
    since: sinceIso,
    now: nowIso,
    clients: perClient,
    totals,
  });
}

function emptyTotals() {
  return {
    tokens_issued: 0,
    tokens_refreshed: 0,
    active_tokens: 0,
    unique_users: 0,
    userinfo_calls: 0,
    consents_active: 0,
  };
}
