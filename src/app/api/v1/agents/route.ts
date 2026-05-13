import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "viem";

import { authenticateBearerAccessToken } from "@/lib/api-auth";
import { createAgent, listAgentsByUser } from "@/lib/agents";
import { getNextNonce } from "@/lib/agentbook-relay";
import { startAgentRegistrationVerification } from "@/lib/agentbook-verification";
import { errCtx, logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const auth = await authenticateBearerAccessToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const agents = await listAgentsByUser(auth.userId);
    return NextResponse.json({
      agents: agents.map((agent) => ({
        address: agent.address,
        agentbook_tx_hash: agent.agentbookTxHash,
        agentbook_registered_at: agent.agentbookRegisteredAt,
        scopes: agent.scopes,
        created_at: agent.createdAt,
        revoked_at: agent.revokedAt,
        last_used_at: agent.lastUsedAt,
      })),
    });
  } catch (err) {
    logger.error("agents-list-failed", { userId: auth.userId, ...errCtx(err) });
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateBearerAccessToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { address } = await createAgent(auth.userId);
    const agentAddress = getAddress(address);
    const nonce = await getNextNonce(agentAddress);
    const verification = await startAgentRegistrationVerification({ agentAddress, nonce });

    return NextResponse.json({
      agent_address: agentAddress,
      nonce: nonce.toString(),
      verification_url: verification.verification_url,
      qr_data: verification.qr_data,
      action: verification.action,
      signal: verification.signal,
      world_app_id: verification.world_app_id,
      rp_context: verification.rp_context,
    });
  } catch (err) {
    logger.error("agents-create-failed", { userId: auth.userId, ...errCtx(err) });
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
