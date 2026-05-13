import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authMock = vi.hoisted(() => vi.fn());
const createAgentMock = vi.hoisted(() => vi.fn());
const listAgentsByUserMock = vi.hoisted(() => vi.fn());
const getNextNonceMock = vi.hoisted(() => vi.fn());
const startVerificationMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api-auth", () => ({
  authenticateBearerAccessToken: authMock,
}));

vi.mock("@/lib/agents", () => ({
  createAgent: createAgentMock,
  listAgentsByUser: listAgentsByUserMock,
}));

vi.mock("@/lib/agentbook-relay", () => ({
  getNextNonce: getNextNonceMock,
}));

vi.mock("@/lib/agentbook-verification", () => ({
  startAgentRegistrationVerification: startVerificationMock,
}));

describe("/api/v1/agents", () => {
  beforeEach(() => {
    authMock.mockReset();
    createAgentMock.mockReset();
    listAgentsByUserMock.mockReset();
    getNextNonceMock.mockReset();
    startVerificationMock.mockReset();
  });

  it("POST rejects missing or invalid bearer access tokens", async () => {
    const { POST } = await import("@/app/api/v1/agents/route");
    authMock.mockResolvedValueOnce(NextResponse.json({ error: "invalid_token" }, { status: 401 }));

    const res = await POST(new NextRequest("https://example.test/api/v1/agents", { method: "POST" }));

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: "invalid_token" });
  });

  it("POST creates an agent and returns World ID verification bootstrap data", async () => {
    const { POST } = await import("@/app/api/v1/agents/route");
    authMock.mockResolvedValueOnce({ userId: "user-1", clientId: "client-1", scopes: ["openid"] });
    createAgentMock.mockResolvedValueOnce({ address: "0x0000000000000000000000000000000000000001", agentId: "agent-1" });
    getNextNonceMock.mockResolvedValueOnce(7n);
    startVerificationMock.mockResolvedValueOnce({
      verification_url: "https://worldcoin.org/verify?test=1",
      qr_data: "https://worldcoin.org/verify?test=1",
      action: "agent-registration",
      signal: "0xabc",
      world_app_id: "app_test",
      rp_context: { rp_id: "rp_test", nonce: "n", created_at: 1, expires_at: 2, signature: "sig" },
    });

    const res = await POST(new NextRequest("https://example.test/api/v1/agents", { method: "POST" }));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({
      agent_address: "0x0000000000000000000000000000000000000001",
      nonce: "7",
      verification_url: "https://worldcoin.org/verify?test=1",
      qr_data: "https://worldcoin.org/verify?test=1",
    });
    expect(createAgentMock).toHaveBeenCalledWith("user-1");
    expect(getNextNonceMock).toHaveBeenCalledWith("0x0000000000000000000000000000000000000001");
  });

  it("GET returns the authenticated user's agents without encrypted private keys", async () => {
    const { GET } = await import("@/app/api/v1/agents/route");
    authMock.mockResolvedValueOnce({ userId: "user-1", clientId: "client-1", scopes: ["openid"] });
    listAgentsByUserMock.mockResolvedValueOnce([
      {
        id: "agent-1",
        address: "0x0000000000000000000000000000000000000001",
        agentbookTxHash: null,
        agentbookRegisteredAt: null,
        scopes: ["agent:sign"],
        createdAt: "2026-05-14T00:00:00.000Z",
        revokedAt: null,
        lastUsedAt: null,
        isRevoked: false,
      },
    ]);

    const res = await GET(new NextRequest("https://example.test/api/v1/agents"));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      agents: [
        {
          address: "0x0000000000000000000000000000000000000001",
          agentbook_tx_hash: null,
          agentbook_registered_at: null,
          scopes: ["agent:sign"],
          created_at: "2026-05-14T00:00:00.000Z",
          revoked_at: null,
          last_used_at: null,
        },
      ],
    });
  });
});
