import { importPKCS8, importSPKI, exportJWK, type JWK } from "jose";

// jose v6では公開型としてのSigningKeyが廃止。実体はCryptoKey or Node KeyObject
type SigningKey = CryptoKey | Awaited<ReturnType<typeof importPKCS8>>;

// RS256キーペア管理
// 環境変数:
//   OIDC_PRIVATE_KEY_PEM: PKCS#8形式のRSA秘密鍵
//   OIDC_PUBLIC_KEY_PEM:  SPKI形式のRSA公開鍵
//   OIDC_KEY_ID:          kid（JWKSで公開する鍵ID。鍵ローテーション時の識別用）
//   OIDC_ISSUER:          発行者URL（例: https://humanauth.vercel.app）

let cachedPrivate: SigningKey | null = null;
let cachedPublic: SigningKey | null = null;
let cachedJwk: JWK | null = null;

export type { SigningKey };

function normalizePem(pem: string): string {
  // 環境変数で改行が \n で渡される場合に対応
  return pem.replace(/\\n/g, "\n");
}

export async function getPrivateKey(): Promise<SigningKey> {
  if (cachedPrivate) return cachedPrivate;
  const pem = process.env.OIDC_PRIVATE_KEY_PEM;
  if (!pem) throw new Error("OIDC_PRIVATE_KEY_PEM is not set");
  cachedPrivate = (await importPKCS8(normalizePem(pem), "RS256")) as SigningKey;
  return cachedPrivate;
}

export async function getPublicKey(): Promise<SigningKey> {
  if (cachedPublic) return cachedPublic;
  const pem = process.env.OIDC_PUBLIC_KEY_PEM;
  if (!pem) throw new Error("OIDC_PUBLIC_KEY_PEM is not set");
  cachedPublic = (await importSPKI(normalizePem(pem), "RS256")) as SigningKey;
  return cachedPublic;
}

export function getKeyId(): string {
  return process.env.OIDC_KEY_ID || "humanauth-default-2026";
}

export function getIssuer(): string {
  const iss = process.env.OIDC_ISSUER;
  if (!iss) throw new Error("OIDC_ISSUER is not set");
  return iss.replace(/\/+$/, "");
}

export async function getPublicJwk(): Promise<JWK> {
  if (cachedJwk) return cachedJwk;
  const pub = await getPublicKey();
  const jwk = await exportJWK(pub);
  cachedJwk = {
    ...jwk,
    use: "sig",
    alg: "RS256",
    kid: getKeyId(),
  };
  return cachedJwk;
}
