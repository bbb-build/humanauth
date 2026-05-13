import { beforeEach, describe, expect, it, vi } from "vitest";

const readContractMock = vi.hoisted(() => vi.fn());

vi.mock("viem", async (importOriginal) => {
  const actual = await importOriginal<typeof import("viem")>();
  return {
    ...actual,
    createPublicClient: vi.fn(() => ({ readContract: readContractMock })),
    http: vi.fn((url?: string) => ({ url })),
  };
});

describe("agentbook-relay", () => {
  beforeEach(() => {
    vi.resetModules();
    readContractMock.mockReset();
    vi.unstubAllGlobals();
  });

  it("getNextNonce reads AgentBook nonce from Base RPC", async () => {
    readContractMock.mockResolvedValueOnce(42n);
    const { getNextNonce } = await import("@/lib/agentbook-relay");

    await expect(getNextNonce("0x0000000000000000000000000000000000000001")).resolves.toBe(42n);
    expect(readContractMock).toHaveBeenCalledWith(
      expect.objectContaining({
        address: "0xE1D1D3526A6FAa37eb36bD10B933C1b77f4561a4",
        functionName: "nonces",
        args: ["0x0000000000000000000000000000000000000001"],
      }),
    );
  });

  it("submitToRelay posts normalized registration payload", async () => {
    const txHash = `0x${"1".repeat(64)}`;
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ txHash }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { AGENTBOOK_BASE_CONTRACT, submitToRelay } = await import("@/lib/agentbook-relay");

    await expect(
      submitToRelay({
        agent: "0x0000000000000000000000000000000000000001",
        root: 1n,
        nonce: 2n,
        nullifierHash: "3",
        proof: ["0", "1", "2", "3", "4", "5", "6", "7"],
      }),
    ).resolves.toEqual({ txHash });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://x402-worldchain.vercel.app/register",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: "0x0000000000000000000000000000000000000001",
          root: "1",
          nonce: "2",
          nullifierHash: "3",
          proof: ["0", "1", "2", "3", "4", "5", "6", "7"],
          contract: AGENTBOOK_BASE_CONTRACT,
          network: "base",
        }),
      }),
    );
  });

  it("submitToRelay throws structured errors for relay failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "bad proof" }), { status: 400 })),
    );
    const { AgentBookRelayError, submitToRelay } = await import("@/lib/agentbook-relay");

    await expect(
      submitToRelay({
        agent: "0x0000000000000000000000000000000000000001",
        root: "1",
        nonce: "2",
        nullifierHash: "3",
        proof: ["0", "1", "2", "3", "4", "5", "6", "7"],
      }),
    ).rejects.toMatchObject({
      name: "AgentBookRelayError",
      status: 400,
      detail: { error: "bad proof" },
    } satisfies Partial<InstanceType<typeof AgentBookRelayError>>);
  });
});
