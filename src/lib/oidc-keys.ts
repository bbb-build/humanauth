import { importPKCS8, importSPKI, exportJWK, type JWK } from "jose";

// jose v6では公開型としてのSigningKeyが廃止。実体はCryptoKey or Node KeyObject
type SigningKey = CryptoKey | Awaited<ReturnType<typeof importPKCS8>>;

// RS256キーペア管理（鍵ローテーション対応）
//
// 環境変数:
//   OIDC_PRIVATE_KEY_PEM:      現行(current)のRSA秘密鍵（PKCS#8）— id_token署名に使用
//   OIDC_PUBLIC_KEY_PEM:       現行のRSA公開鍵（SPKI）         — JWKSで公開
//   OIDC_KEY_ID:               現行のkid                       — JWT headerに付与
//   OIDC_PREV_PUBLIC_KEY_PEM:  1つ前のRSA公開鍵（オプション）  — ローテ移行期間中のみ設定
//   OIDC_PREV_KEY_ID:          1つ前のkid（オプション）
//   OIDC_ISSUER:               発行者URL（例: https://humanauth.vercel.app）
//
// ローテーション手順:
//   1. `tsx scripts/rotate-oidc-keys.ts` で新キーペア生成
//   2. 旧 OIDC_PUBLIC_KEY_PEM / OIDC_KEY_ID を OIDC_PREV_PUBLIC_KEY_PEM / OIDC_PREV_KEY_ID に退避
//   3. OIDC_PRIVATE_KEY_PEM / OIDC_PUBLIC_KEY_PEM / OIDC_KEY_ID を新キーで上書き
//   4. デプロイ → JWKSは [new, prev] の2鍵を公開、新規署名は new で実施
//   5. 旧kidのid_tokenが全失効するまで待機（id_token TTL = 1h）
//   6. OIDC_PREV_PUBLIC_KEY_PEM / OIDC_PREV_KEY_ID を削除して再デプロイ

let cachedPrivate: SigningKey | null = null;
let cachedCurrentPublic: SigningKey | null = null;
let cachedPreviousPublic: SigningKey | null | "absent" = null;
let cachedJwks: JWK[] | null = null;

export type { SigningKey };

function normalizePem(pem: string): string {
  // 環境変数で改行が \n で渡される場合に対応
  return pem.replace(/\\n/g, "\n");
}

// === 現行鍵 ===

export async function getPrivateKey(): Promise<SigningKey> {
  if (cachedPrivate) return cachedPrivate;
  const pem = process.env.OIDC_PRIVATE_KEY_PEM;
  if (!pem) throw new Error("OIDC_PRIVATE_KEY_PEM is not set");
  cachedPrivate = (await importPKCS8(normalizePem(pem), "RS256")) as SigningKey;
  return cachedPrivate;
}

export async function getCurrentPublicKey(): Promise<SigningKey> {
  if (cachedCurrentPublic) return cachedCurrentPublic;
  const pem = process.env.OIDC_PUBLIC_KEY_PEM;
  if (!pem) throw new Error("OIDC_PUBLIC_KEY_PEM is not set");
  cachedCurrentPublic = (await importSPKI(normalizePem(pem), "RS256")) as SigningKey;
  return cachedCurrentPublic;
}

export function getCurrentKeyId(): string {
  return process.env.OIDC_KEY_ID || "humanauth-default-2026";
}

// === 旧鍵（移行期間中のみ存在） ===

export async function getPreviousPublicKey(): Promise<SigningKey | null> {
  if (cachedPreviousPublic === "absent") return null;
  if (cachedPreviousPublic) return cachedPreviousPublic;
  const pem = process.env.OIDC_PREV_PUBLIC_KEY_PEM;
  if (!pem) {
    cachedPreviousPublic = "absent";
    return null;
  }
  cachedPreviousPublic = (await importSPKI(normalizePem(pem), "RS256")) as SigningKey;
  return cachedPreviousPublic;
}

export function getPreviousKeyId(): string | null {
  return process.env.OIDC_PREV_KEY_ID || null;
}

// === kid解決 ===

/**
 * JWT header の kid から対応する公開鍵を返す。
 * 一致するkidが無ければ null。
 * kid未指定の場合は現行鍵を返す（後方互換）。
 */
export async function getPublicKeyByKid(kid: string | undefined): Promise<SigningKey | null> {
  if (!kid) return getCurrentPublicKey();

  if (kid === getCurrentKeyId()) return getCurrentPublicKey();

  const prevKid = getPreviousKeyId();
  if (prevKid && kid === prevKid) {
    return getPreviousPublicKey();
  }
  return null;
}

// === 共通 ===

export function getIssuer(): string {
  const iss = process.env.OIDC_ISSUER;
  if (!iss) throw new Error("OIDC_ISSUER is not set");
  return iss.replace(/\/+$/, "");
}

/**
 * JWKS endpoint で公開する全公開鍵。
 * 順序: [current, previous?]。
 */
export async function getAllPublicJwks(): Promise<JWK[]> {
  if (cachedJwks) return cachedJwks;

  const list: JWK[] = [];

  const cur = await getCurrentPublicKey();
  const curJwk = await exportJWK(cur);
  list.push({
    ...curJwk,
    use: "sig",
    alg: "RS256",
    kid: getCurrentKeyId(),
  });

  const prev = await getPreviousPublicKey();
  const prevKid = getPreviousKeyId();
  if (prev && prevKid) {
    const prevJwk = await exportJWK(prev);
    list.push({
      ...prevJwk,
      use: "sig",
      alg: "RS256",
      kid: prevKid,
    });
  }

  cachedJwks = list;
  return cachedJwks;
}

// === Backwards-compat ===
// 新規コードは getCurrentPublicKey / getCurrentKeyId / getAllPublicJwks を使うこと。

/** @deprecated use getCurrentPublicKey() */
export const getPublicKey = getCurrentPublicKey;

/** @deprecated use getCurrentKeyId() */
export const getKeyId = getCurrentKeyId;

/** @deprecated use getAllPublicJwks() — 単一鍵では rotation を表現できない */
export async function getPublicJwk(): Promise<JWK> {
  const list = await getAllPublicJwks();
  return list[0];
}
