/**
 * OIDC RS256 鍵ローテーションヘルパー
 *
 * 使い方:
 *   tsx scripts/rotate-oidc-keys.ts
 *
 * 出力:
 *   - 新しいRSA-2048キーペア（PKCS#8秘密鍵 / SPKI公開鍵）
 *   - 新しいkid（humad-YYYYMMDD-xxxxxx）
 *   - Vercel CLI / dashboard に貼り付ける手順
 *
 * このスクリプトは鍵を **stdout に出力するだけ** で、環境変数の書き換えは
 * 行わない（remoteのenvを安全に上書きするにはBBBの手動操作が必要）。
 *
 * ローテーション手順（src/lib/oidc-keys.ts のヘッダコメントと一致させること）:
 *   1. このスクリプトを実行 → 新キー一式が表示される
 *   2. Vercel dashboard で OIDC_PREV_PUBLIC_KEY_PEM = (現行の OIDC_PUBLIC_KEY_PEM 値)
 *   3. Vercel dashboard で OIDC_PREV_KEY_ID         = (現行の OIDC_KEY_ID 値)
 *   4. Vercel dashboard で OIDC_PRIVATE_KEY_PEM     = (新キーの秘密鍵)
 *   5. Vercel dashboard で OIDC_PUBLIC_KEY_PEM      = (新キーの公開鍵)
 *   6. Vercel dashboard で OIDC_KEY_ID              = (新キーのkid)
 *   7. Vercel をredeploy → JWKSは [new, prev] の2鍵を公開
 *   8. id_token TTL (= 1時間) 待機（旧kidの全idTokenが期限切れになる）
 *   9. Vercel dashboard で OIDC_PREV_PUBLIC_KEY_PEM / OIDC_PREV_KEY_ID を削除 → redeploy
 */

import { generateKeyPair, exportPKCS8, exportSPKI } from "jose";
import { randomBytes } from "node:crypto";

function newKid(): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const rand = randomBytes(3).toString("hex"); // 6文字
  return `humad-${yyyy}${mm}${dd}-${rand}`;
}

async function main() {
  const kid = newKid();
  const { privateKey, publicKey } = await generateKeyPair("RS256", {
    modulusLength: 2048,
    extractable: true,
  });
  const privPem = await exportPKCS8(privateKey);
  const pubPem = await exportSPKI(publicKey);

  const banner =
    "=========================================================================";
  console.log("");
  console.log(banner);
  console.log("  Humad OIDC Key Rotation — New keypair generated");
  console.log(banner);
  console.log("");
  console.log(`  New kid: ${kid}`);
  console.log("");
  console.log(banner);
  console.log("");
  console.log("--- OIDC_PRIVATE_KEY_PEM (PKCS#8) ---");
  console.log(privPem.trim());
  console.log("");
  console.log("--- OIDC_PUBLIC_KEY_PEM (SPKI) ---");
  console.log(pubPem.trim());
  console.log("");
  console.log(`--- OIDC_KEY_ID ---`);
  console.log(kid);
  console.log("");
  console.log(banner);
  console.log("");
  console.log("Next steps (operate via Vercel dashboard or vercel CLI):");
  console.log("");
  console.log("  1. Read CURRENT values of OIDC_PUBLIC_KEY_PEM and OIDC_KEY_ID");
  console.log("  2. Set:");
  console.log("       OIDC_PREV_PUBLIC_KEY_PEM = <current OIDC_PUBLIC_KEY_PEM value>");
  console.log("       OIDC_PREV_KEY_ID         = <current OIDC_KEY_ID value>");
  console.log("  3. Overwrite with NEW values above:");
  console.log("       OIDC_PRIVATE_KEY_PEM     = <new private key>");
  console.log("       OIDC_PUBLIC_KEY_PEM      = <new public key>");
  console.log("       OIDC_KEY_ID              = <new kid>");
  console.log("  4. Redeploy. JWKS will now expose BOTH keys.");
  console.log("  5. Wait at least 1 hour (id_token TTL) for old tokens to expire.");
  console.log("  6. Remove OIDC_PREV_PUBLIC_KEY_PEM and OIDC_PREV_KEY_ID. Redeploy.");
  console.log("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
