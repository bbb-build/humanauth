import type { Address } from "viem";
import { createPublicClient, getAddress, http } from "viem";
import { base } from "viem/chains";

import AgentBookAbi from "@/lib/abis/AgentBook.json";

export const AGENTBOOK_BASE_CONTRACT = "0xE1D1D3526A6FAa37eb36bD10B933C1b77f4561a4" as const;
export const AGENTBOOK_NETWORK = "base" as const;
export const AGENTBOOK_RELAY_URL = "https://x402-worldchain.vercel.app/register" as const;

type Uintish = string | number | bigint;

export interface RegisterPayload {
  agent: Address;
  root: Uintish;
  nonce: Uintish;
  nullifierHash: Uintish;
  proof: readonly Uintish[];
  contract?: Address;
  network?: typeof AGENTBOOK_NETWORK;
}

export class AgentBookRelayError extends Error {
  readonly status?: number;
  readonly detail?: unknown;

  constructor(message: string, opts: { status?: number; detail?: unknown } = {}) {
    super(message);
    this.name = "AgentBookRelayError";
    this.status = opts.status;
    this.detail = opts.detail;
  }
}

function stringifyUint(value: Uintish): string {
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new AgentBookRelayError("uint256 values must be non-negative safe integers or strings");
    }
    return value.toString();
  }
  if (!/^\d+$/.test(value)) {
    throw new AgentBookRelayError("uint256 values must be decimal strings");
  }
  return value;
}

function normalizePayload(payload: RegisterPayload) {
  if (payload.proof.length !== 8) {
    throw new AgentBookRelayError("proof must contain exactly 8 uint256 values");
  }

  return {
    agent: getAddress(payload.agent),
    root: stringifyUint(payload.root),
    nonce: stringifyUint(payload.nonce),
    nullifierHash: stringifyUint(payload.nullifierHash),
    proof: payload.proof.map(stringifyUint),
    contract: payload.contract ?? AGENTBOOK_BASE_CONTRACT,
    network: payload.network ?? AGENTBOOK_NETWORK,
  };
}

export function createAgentBookPublicClient() {
  return createPublicClient({
    chain: base,
    transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org"),
  });
}

export async function getNextNonce(agentAddress: Address): Promise<bigint> {
  const client = createAgentBookPublicClient();
  const address = AGENTBOOK_BASE_CONTRACT;
  const abi = AgentBookAbi;
  const args = [getAddress(agentAddress)] as const;

  try {
    return await client.readContract({ address, abi, functionName: "nonces", args });
  } catch (err) {
    try {
      return await client.readContract({ address, abi, functionName: "getNextNonce", args });
    } catch {
      throw err;
    }
  }
}

export async function submitToRelay(payload: RegisterPayload): Promise<{ txHash: string }> {
  const body = normalizePayload(payload);

  let response: Response;
  try {
    response = await fetch(AGENTBOOK_RELAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new AgentBookRelayError("AgentBook relay request failed", { detail: err });
  }

  let json: unknown;
  const text = await response.text();
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = text;
  }

  if (!response.ok) {
    throw new AgentBookRelayError("AgentBook relay rejected registration", {
      status: response.status,
      detail: json,
    });
  }

  const txHash = typeof json === "object" && json !== null ? (json as { txHash?: unknown }).txHash : undefined;
  if (typeof txHash !== "string" || !/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
    throw new AgentBookRelayError("AgentBook relay response missing txHash", { detail: json });
  }

  return { txHash };
}
