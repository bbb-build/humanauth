import { beforeEach, describe, expect, it, vi } from "vitest";
import { verifyMessage } from "viem";

import { _resetEncryptionCacheForTesting } from "@/lib/crypto";
import { generateAgent } from "@/lib/agents";
import { signSiweMessage } from "@/lib/agent-siwe";
import { agentRows, resetSupabaseMock } from "./supabase-mock";

vi.mock("@/lib/supabase", async () => {
  const mock = await import("./supabase-mock");
  return { getSupabaseAdmin: mock.getSupabaseAdminMock };
});

describe("agent-siwe", () => {
  beforeEach(() => {
    process.env.ENCRYPTION_KEYS = JSON.stringify({
      v1: "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    });
    process.env.ENCRYPTION_ACTIVE_KEY_VERSION = "v1";
    _resetEncryptionCacheForTesting();
    resetSupabaseMock();
  });

  it("signSiweMessage builds an EIP-4361 message and produces a verifiable signature", async () => {
    const { agentId, address } = await generateAgent("user-a", ["agent:sign"]);

    const { message, signature } = await signSiweMessage(agentId, {
      domain: "example.com",
      uri: "https://example.com/login",
      statement: "Sign in as a HumanAuth delegated agent.",
      nonce: "n-123456",
      chainId: 1,
      issuedAt: "2026-05-14T00:00:00.000Z",
    });

    expect(message).toBe(
      [
        "example.com wants you to sign in with your Ethereum account:",
        address,
        "",
        "Sign in as a HumanAuth delegated agent.",
        "",
        "URI: https://example.com/login",
        "Version: 1",
        "Chain ID: 1",
        "Nonce: n-123456",
        "Issued At: 2026-05-14T00:00:00.000Z",
      ].join("\n"),
    );
    await expect(verifyMessage({ address, message, signature })).resolves.toBe(true);
    expect(agentRows[0].last_used_at).toEqual(expect.any(String));
  });
});
