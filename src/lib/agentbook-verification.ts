import { signRequest } from "@worldcoin/idkit/signing";
import { encodePacked, getAddress, keccak256, type Address } from "viem";

export const AGENT_REGISTRATION_ACTION = "agent-registration" as const;

export interface AgentRegistrationVerification {
  action: typeof AGENT_REGISTRATION_ACTION;
  signal: `0x${string}`;
  verification_url: string;
  qr_data: string;
  world_app_id: string;
  rp_context: {
    rp_id: string;
    nonce: string;
    created_at: number;
    expires_at: number;
    signature: string;
  };
}

export function buildAgentRegistrationSignal(agentAddress: Address, nonce: bigint): `0x${string}` {
  return keccak256(encodePacked(["address", "uint256"], [getAddress(agentAddress), nonce]));
}

export async function startAgentRegistrationVerification(params: {
  agentAddress: Address;
  nonce: bigint;
}): Promise<AgentRegistrationVerification> {
  const rpId = process.env.HUMANARY_LOGIN_RP_ID;
  const worldAppId = process.env.HUMANARY_LOGIN_WORLD_APP_ID;
  const signingKey = process.env.HUMANARY_LOGIN_SIGNING_KEY;

  if (!rpId || !worldAppId || !signingKey) {
    throw new Error("Server misconfigured: HUMANARY_LOGIN_* env vars missing");
  }

  const signal = buildAgentRegistrationSignal(params.agentAddress, params.nonce);
  const { sig, nonce, createdAt, expiresAt } = signRequest({
    signingKeyHex: signingKey,
    action: AGENT_REGISTRATION_ACTION,
  });

  const query = new URLSearchParams({
    app_id: worldAppId,
    action: AGENT_REGISTRATION_ACTION,
    signal,
    nonce,
  });
  const verificationUrl = `https://worldcoin.org/verify?${query.toString()}`;

  return {
    action: AGENT_REGISTRATION_ACTION,
    signal,
    verification_url: verificationUrl,
    qr_data: verificationUrl,
    world_app_id: worldAppId,
    rp_context: {
      rp_id: rpId,
      nonce,
      created_at: createdAt,
      expires_at: expiresAt,
      signature: sig,
    },
  };
}
