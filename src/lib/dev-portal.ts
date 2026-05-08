const MCP_URL = "https://developer.world.org/api/mcp";

interface McpResponse {
  jsonrpc: string;
  id: number;
  result?: { content: Array<{ type: string; text: string }> };
  error?: { code: number; message: string };
}

async function callMcp(tool: string, args: Record<string, unknown>): Promise<unknown> {
  const token = process.env.WORLD_DEV_PORTAL_TOKEN;
  if (!token) throw new Error("WORLD_DEV_PORTAL_TOKEN is not set");

  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: tool, arguments: args },
      id: Date.now(),
    }),
  });

  if (!res.ok) {
    throw new Error(`Dev Portal API error: ${res.status} ${res.statusText}`);
  }

  const json: McpResponse = await res.json();
  if (json.error) {
    throw new Error(`Dev Portal MCP error: ${json.error.message}`);
  }

  const text = json.result?.content?.[0]?.text;
  if (!text) throw new Error("Empty response from Dev Portal");

  return JSON.parse(text);
}

export interface ProvisionResult {
  devPortalAppId: string;
  rpId: string;
  signingKey: string;
}

/**
 * 顧客のWorld IDアプリを自動プロビジョニング
 * 1. create_app → app_id
 * 2. configure_world_id → rp_id + signing_key
 * 3. create_world_id_action → action登録
 */
export async function provisionWorldApp(
  name: string,
  websiteUrl: string,
): Promise<ProvisionResult> {
  // 1. アプリ作成
  const createResult = (await callMcp("create_app", {
    name,
    app_mode: "external",
    integration_url: websiteUrl,
    build: "production",
    verification: "cloud",
  })) as { app: { id: string } };

  const appId = createResult.app?.id;
  if (!appId) {
    throw new Error(`Failed to extract app_id from create_app: ${JSON.stringify(createResult)}`);
  }

  // 2. World ID RP登録 + Signing Key生成
  const configResult = (await callMcp("configure_world_id", {
    app_id: appId,
  })) as Record<string, unknown>;

  // signing keyは一度だけ返される
  const signingKey = extractSigningKey(configResult);
  const rpId = extractRpId(configResult);

  if (!signingKey) {
    throw new Error(`Failed to extract signing_key from configure_world_id response: ${JSON.stringify(configResult)}`);
  }
  if (!rpId) {
    throw new Error(`Failed to extract rp_id from configure_world_id response: ${JSON.stringify(configResult)}`);
  }

  // 3. アクション登録
  await callMcp("create_world_id_action", {
    app_id: appId,
    action: "verify",
    description: `User verification for ${name}`,
    environment: "production",
  });

  return { devPortalAppId: appId, rpId, signingKey };
}

function extractSigningKey(result: Record<string, unknown>): string | null {
  // configure_world_id returns: { signing_key: { private_key: "0x..." } }
  const signingKeyObj = result.signing_key as Record<string, unknown> | undefined;
  if (signingKeyObj && typeof signingKeyObj.private_key === "string") {
    return signingKeyObj.private_key;
  }

  // フォールバック
  if (typeof result.private_key === "string") return result.private_key;
  if (typeof result.signer_private_key === "string") return result.signer_private_key;

  return null;
}

function extractRpId(result: Record<string, unknown>): string | null {
  // configure_world_id returns: { rp_id: "rp_xxx", ... }
  if (typeof result.rp_id === "string") return result.rp_id;
  return null;
}
