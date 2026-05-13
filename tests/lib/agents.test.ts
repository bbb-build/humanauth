import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAddress } from "viem";

import { looksEncrypted, _resetEncryptionCacheForTesting } from "@/lib/crypto";
import { generateAgent, listAgentsByUser, revokeAgent } from "@/lib/agents";
import { agentRows, resetSupabaseMock } from "./supabase-mock";

vi.mock("@/lib/supabase", async () => {
  const mock = await import("./supabase-mock");
  return { getSupabaseAdmin: mock.getSupabaseAdminMock };
});

describe("agents", () => {
  beforeEach(() => {
    process.env.ENCRYPTION_KEYS = JSON.stringify({
      v1: "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    });
    process.env.ENCRYPTION_ACTIVE_KEY_VERSION = "v1";
    _resetEncryptionCacheForTesting();
    resetSupabaseMock();
  });

  it("generateAgent inserts an encrypted custodial agent row", async () => {
    const result = await generateAgent("user-a", ["openid", "agent:sign", "openid"]);
    const row = agentRows[0];

    expect(result).toEqual({ address: row.address, agentId: row.id });
    expect(getAddress(result.address)).toBe(result.address);
    expect(row.user_id).toBe("user-a");
    expect(row.scopes).toEqual(["agent:sign", "openid"]);
    expect(looksEncrypted(row.encrypted_private_key)).toBe(true);
    expect(row.encrypted_private_key).not.toMatch(/^0x[0-9a-fA-F]{64}$/);
  });

  it("revokeAgent sets revoked_at", async () => {
    const { agentId } = await generateAgent("user-a", []);

    await revokeAgent(agentId);

    expect(agentRows[0].revoked_at).toEqual(expect.any(String));
  });

  it("listAgentsByUser returns only the user's agents", async () => {
    const first = await generateAgent("user-a", ["profile"]);
    await generateAgent("user-b", ["profile"]);

    const summaries = await listAgentsByUser("user-a");

    expect(summaries).toEqual([
      {
        id: first.agentId,
        address: first.address,
        scopes: ["profile"],
        agentbookTxHash: null,
        agentbookRegisteredAt: null,
        createdAt: expect.any(String),
        revokedAt: null,
        lastUsedAt: null,
        isRevoked: false,
      },
    ]);
  });
});
