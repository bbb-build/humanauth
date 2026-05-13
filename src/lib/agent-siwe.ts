import { getAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { getAgentPrivateKey, touchLastUsed } from "@/lib/agents";

export interface SignSiweParams {
  domain: string;
  uri: string;
  statement?: string;
  nonce: string;
  chainId: number;
  issuedAt?: string;
}

export interface SignedSiweMessage {
  message: string;
  signature: `0x${string}`;
}

function assertNoLineBreaks(value: string, field: string): void {
  if (/[\r\n]/.test(value)) {
    throw new Error(`${field} must not contain line breaks`);
  }
}

function buildSiweMessage(address: string, params: SignSiweParams): string {
  assertNoLineBreaks(params.domain, "domain");
  assertNoLineBreaks(params.nonce, "nonce");
  if (params.statement) assertNoLineBreaks(params.statement, "statement");

  const issuedAt = params.issuedAt ?? new Date().toISOString();
  const lines = [
    `${params.domain} wants you to sign in with your Ethereum account:`,
    getAddress(address),
    "",
  ];

  if (params.statement) {
    lines.push(params.statement, "");
  }

  lines.push(
    `URI: ${params.uri}`,
    "Version: 1",
    `Chain ID: ${params.chainId}`,
    `Nonce: ${params.nonce}`,
    `Issued At: ${issuedAt}`,
  );

  return lines.join("\n");
}

export async function signSiweMessage(
  agentId: string,
  params: SignSiweParams,
): Promise<SignedSiweMessage> {
  const privateKey = await getAgentPrivateKey(agentId);
  const account = privateKeyToAccount(privateKey);
  const message = buildSiweMessage(account.address, params);
  const signature = await account.signMessage({ message });
  await touchLastUsed(agentId);
  return { message, signature };
}
