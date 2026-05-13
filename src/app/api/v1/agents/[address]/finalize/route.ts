import { NextRequest, NextResponse } from "next/server";
import { getAddress, type Address } from "viem";

import { authenticateBearerAccessToken } from "@/lib/api-auth";
import { getAgentForRegistration, markAgentbookRegistered } from "@/lib/agents";
import { AGENTBOOK_BASE_CONTRACT, AGENTBOOK_NETWORK, getNextNonce, submitToRelay } from "@/lib/agentbook-relay";
import { errCtx, logger } from "@/lib/logger";

interface RouteContext {
  params: Promise<{ address: string }> | { address: string };
}

function isUintString(value: unknown): value is string {
  return typeof value === "string" && /^\d+$/.test(value);
}

function parseProof(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length !== 8) return null;
  return value.every(isUintString) ? value : null;
}

async function getParams(ctx: RouteContext): Promise<{ address: string }> {
  return await ctx.params;
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  const auth = await authenticateBearerAccessToken(req);
  if (auth instanceof NextResponse) return auth;

  let agentAddress: Address;
  try {
    const params = await getParams(ctx);
    agentAddress = getAddress(params.address);
  } catch {
    return NextResponse.json({ error: "invalid_agent_address" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const proof = parseProof(body.proof);
  if (!isUintString(body.root) || !isUintString(body.nullifierHash) || !proof) {
    return NextResponse.json(
      { error: "invalid_request", detail: "root, nullifierHash, and proof[8] decimal strings are required" },
      { status: 400 },
    );
  }

  try {
    const agent = await getAgentForRegistration(auth.userId, agentAddress);
    if (!agent) {
      return NextResponse.json({ error: "agent_not_found" }, { status: 404 });
    }
    if (agent.revoked_at) {
      return NextResponse.json({ error: "agent_revoked" }, { status: 409 });
    }
    if (agent.agentbook_tx_hash) {
      return NextResponse.json({ error: "agent_already_registered" }, { status: 409 });
    }

    const nonce = await getNextNonce(agentAddress);
    const { txHash } = await submitToRelay({
      agent: agentAddress,
      root: body.root,
      nonce,
      nullifierHash: body.nullifierHash,
      proof,
      contract: AGENTBOOK_BASE_CONTRACT,
      network: AGENTBOOK_NETWORK,
    });
    const registeredAt = await markAgentbookRegistered(agent.id, txHash);

    return NextResponse.json({ tx_hash: txHash, registered_at: registeredAt });
  } catch (err) {
    logger.error("agents-finalize-failed", { userId: auth.userId, address: agentAddress, ...errCtx(err) });
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
