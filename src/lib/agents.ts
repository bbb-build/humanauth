import { getAddress } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

import { decryptVersioned, encryptWithActiveKey } from "@/lib/crypto";
import { getSupabaseAdmin } from "@/lib/supabase";

export interface AgentSummary {
  id: string;
  address: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt: string | null;
  isRevoked: boolean;
}

interface AgentInsertRow {
  id: string;
}

interface AgentPrivateKeyRow {
  encrypted_private_key: string;
  revoked_at: string | null;
}

interface AgentSummaryRow {
  id: string;
  address: string;
  scopes: string[] | null;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

function normalizeScopes(scopes: string[]): string[] {
  return [...new Set(scopes.map((scope) => scope.trim()).filter(Boolean))].sort();
}

function requireSupabaseSuccess(error: { message: string } | null, action: string): void {
  if (error) {
    throw new Error(`${action} failed: ${error.message}`);
  }
}

export async function generateAgent(
  userId: string,
  scopes: string[],
): Promise<{ address: string; agentId: string }> {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  const address = getAddress(account.address);
  const encryptedPrivateKey = await encryptWithActiveKey(privateKey);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("ha_agents")
    .insert({
      user_id: userId,
      address,
      encrypted_private_key: encryptedPrivateKey,
      scopes: normalizeScopes(scopes),
    })
    .select("id")
    .single<AgentInsertRow>();

  requireSupabaseSuccess(error, "generateAgent insert");
  if (!data?.id) {
    throw new Error("generateAgent insert failed: missing agent id");
  }

  return { address, agentId: data.id };
}

/**
 * Internal agent signing boundary. Do not expose this from API routes or UI code.
 */
export async function getAgentPrivateKey(agentId: string): Promise<`0x${string}`> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ha_agents")
    .select("encrypted_private_key, revoked_at")
    .eq("id", agentId)
    .maybeSingle<AgentPrivateKeyRow>();

  requireSupabaseSuccess(error, "getAgentPrivateKey select");
  if (!data) {
    throw new Error("Agent not found");
  }
  if (data.revoked_at) {
    throw new Error("Agent has been revoked");
  }

  const privateKey = await decryptVersioned(data.encrypted_private_key);
  if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
    throw new Error("Stored agent private key is invalid");
  }
  return privateKey as `0x${string}`;
}

export async function listAgentsByUser(userId: string): Promise<AgentSummary[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ha_agents")
    .select("id, address, scopes, created_at, last_used_at, revoked_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  requireSupabaseSuccess(error, "listAgentsByUser select");

  const rows = (data ?? []) as AgentSummaryRow[];
  return rows.map((row) => ({
    id: row.id,
    address: row.address,
    scopes: row.scopes ?? [],
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
    isRevoked: row.revoked_at !== null,
  }));
}

export async function revokeAgent(agentId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("ha_agents")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", agentId)
    .is("revoked_at", null);

  requireSupabaseSuccess(error, "revokeAgent update");
}

export async function touchLastUsed(agentId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("ha_agents")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", agentId)
    .is("revoked_at", null);

  requireSupabaseSuccess(error, "touchLastUsed update");
}
