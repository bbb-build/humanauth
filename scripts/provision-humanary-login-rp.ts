/**
 * Humanary専用RP（"Login with Humanary"用）をWorld Dev Portalに登録する。
 *
 * 出力:
 *   - HUMANARY_LOGIN_WORLD_APP_ID
 *   - HUMANARY_LOGIN_RP_ID
 *   - HUMANARY_LOGIN_SIGNING_KEY (※configure_world_id時のみ取得可。今回は使わない。固定actionの追加にcredentialとして使うだけ)
 *
 * 既に登録済みなら冪等に動作させたいが、MCPには「既存app検索」APIが見当たらないため、
 * このスクリプトは「未登録の状態から1回だけ実行」する想定。再実行時は新しいappが生成されてしまうので注意。
 */

// .env.local を手動でロード（dotenvに依存しないため）
import { readFileSync } from "node:fs";
try {
  const envText = readFileSync("/opt/humanauth/.env.local", "utf-8");
  for (const line of envText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  // ignore
}

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
    throw new Error(`Dev Portal API error: ${res.status} ${res.statusText} - ${await res.text()}`);
  }

  const json: McpResponse = await res.json();
  if (json.error) {
    throw new Error(`Dev Portal MCP error: ${json.error.message}`);
  }

  const text = json.result?.content?.[0]?.text;
  if (!text) throw new Error("Empty response from Dev Portal");

  return JSON.parse(text);
}

async function main() {
  const APP_NAME = "Humanary Login";
  const INTEGRATION_URL = "https://humanauth.vercel.app";
  const ACTION = "humanary-login-v1";
  const ACTION_DESC = "Sign in with Humanary (universal identity layer for World ID)";

  console.log("[1/3] create_app:", APP_NAME);
  const createResult = (await callMcp("create_app", {
    name: APP_NAME,
    app_mode: "external",
    integration_url: INTEGRATION_URL,
    build: "production",
    verification: "cloud",
  })) as { app: { id: string } };

  const appId = createResult.app?.id;
  if (!appId) {
    throw new Error(`No app.id in create_app: ${JSON.stringify(createResult)}`);
  }
  console.log("    → app_id:", appId);

  console.log("[2/3] configure_world_id");
  const configResult = (await callMcp("configure_world_id", {
    app_id: appId,
  })) as Record<string, unknown>;

  const signingKeyObj = configResult.signing_key as Record<string, unknown> | undefined;
  const signingKey =
    (signingKeyObj && typeof signingKeyObj.private_key === "string" && signingKeyObj.private_key) ||
    (typeof configResult.private_key === "string" && configResult.private_key) ||
    null;
  const rpId = (typeof configResult.rp_id === "string" && configResult.rp_id) || null;

  if (!rpId) throw new Error(`No rp_id from configure_world_id: ${JSON.stringify(configResult)}`);
  console.log("    → rp_id:", rpId);
  if (signingKey) {
    console.log("    → signing_key: (取得済み — 環境変数HUMANARY_LOGIN_SIGNING_KEYに保存)");
  }

  console.log("[3/3] create_world_id_action:", ACTION);
  await callMcp("create_world_id_action", {
    app_id: appId,
    action: ACTION,
    description: ACTION_DESC,
    environment: "production",
  });
  console.log("    → action登録完了");

  console.log("\n=== 結果 ===");
  console.log(`HUMANARY_LOGIN_WORLD_APP_ID=${appId}`);
  console.log(`HUMANARY_LOGIN_RP_ID=${rpId}`);
  if (signingKey) console.log(`HUMANARY_LOGIN_SIGNING_KEY=${signingKey}`);
  console.log("\n上記をVercel環境変数に投入してください。");
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
