import { webcrypto } from "node:crypto";

// AES-GCM による対称暗号化レイヤ。
//
// 鍵世代 (key version) 設計:
//   - 暗号文は "v<N>:<base64(iv|ciphertext)>" 形式。先頭の "v1:" 等で世代を識別する
//   - 復号時は prefix から世代を読み、該当する鍵で復号
//   - 暗号化時は ENCRYPTION_ACTIVE_KEY_VERSION で指定された「アクティブ世代」を使う
//
// 環境変数:
//   ENCRYPTION_KEYS                — 全世代を列挙: "v1:hex,v2:hex" (カンマ区切り) もしくは
//                                    JSON: {"v1":"hex","v2":"hex"}
//   ENCRYPTION_ACTIVE_KEY_VERSION  — 書き込み時に使う世代名 (例: "v2")。省略時は最大世代
//   ENCRYPTION_KEY                 — 後方互換: ENCRYPTION_KEYS 未指定時、これを v1 として扱う
//
// 後方互換 API:
//   encrypt(plaintext) — 旧 API。アクティブ鍵で暗号化するが、出力は version prefix 付き
//   decrypt(encoded)   — 旧 API。version prefix があれば適切な鍵で、無ければ v1 で復号
//
// 鍵ローテ運用:
//   1. ENCRYPTION_KEYS に v2 を追加（v1 は残す）→ デプロイ → v1 平文と v2 暗号文を読める状態
//   2. ENCRYPTION_ACTIVE_KEY_VERSION=v2 でデプロイ → 新規書き込みは v2 で行われる
//   3. 全レコードが v2 になったら ENCRYPTION_KEYS から v1 を削除可能
//
//   詳細は docs/security/encryption.md を参照。

const ALGORITHM = "AES-GCM";
const IV_LENGTH = 12;
const VERSION_PATTERN = /^v(\d+):/;

interface KeyEntry {
  version: string;
  keyPromise: Promise<CryptoKey>;
}

let cachedKeys: Map<string, KeyEntry> | null = null;
let cachedActiveVersion: string | null = null;

function importKey(hex: string): Promise<CryptoKey> {
  const raw = Buffer.from(hex, "hex");
  if (raw.length !== 16 && raw.length !== 24 && raw.length !== 32) {
    throw new Error(`Invalid AES key length (${raw.length} bytes). Expected 16/24/32 bytes hex.`);
  }
  return webcrypto.subtle.importKey("raw", raw, ALGORITHM, false, ["encrypt", "decrypt"]);
}

function parseKeyEnv(): { keys: Map<string, KeyEntry>; activeVersion: string } {
  const keys = new Map<string, KeyEntry>();
  const rawList = process.env.ENCRYPTION_KEYS;
  const singleKey = process.env.ENCRYPTION_KEY;

  if (rawList) {
    const trimmed = rawList.trim();
    if (trimmed.startsWith("{")) {
      const parsed = JSON.parse(trimmed) as Record<string, string>;
      for (const [version, hex] of Object.entries(parsed)) {
        if (!/^v\d+$/.test(version)) {
          throw new Error(`Invalid key version in ENCRYPTION_KEYS: ${version} (expected v<number>)`);
        }
        keys.set(version, { version, keyPromise: importKey(hex) });
      }
    } else {
      for (const pair of trimmed.split(",")) {
        const [version, hex] = pair.split(":").map((s) => s.trim());
        if (!version || !hex) continue;
        if (!/^v\d+$/.test(version)) {
          throw new Error(`Invalid key version in ENCRYPTION_KEYS: ${version} (expected v<number>)`);
        }
        keys.set(version, { version, keyPromise: importKey(hex) });
      }
    }
  } else if (singleKey) {
    keys.set("v1", { version: "v1", keyPromise: importKey(singleKey) });
  } else {
    throw new Error("ENCRYPTION_KEYS or ENCRYPTION_KEY is not set");
  }

  if (keys.size === 0) {
    throw new Error("ENCRYPTION_KEYS parsed to zero entries");
  }

  const explicitActive = process.env.ENCRYPTION_ACTIVE_KEY_VERSION;
  let activeVersion: string;
  if (explicitActive) {
    if (!keys.has(explicitActive)) {
      throw new Error(`ENCRYPTION_ACTIVE_KEY_VERSION=${explicitActive} not present in ENCRYPTION_KEYS`);
    }
    activeVersion = explicitActive;
  } else {
    // 最大世代を自動選択
    activeVersion = [...keys.keys()].sort((a, b) => {
      return Number(a.slice(1)) - Number(b.slice(1));
    }).at(-1)!;
  }

  return { keys, activeVersion };
}

function ensureLoaded(): { keys: Map<string, KeyEntry>; activeVersion: string } {
  if (!cachedKeys || !cachedActiveVersion) {
    const { keys, activeVersion } = parseKeyEnv();
    cachedKeys = keys;
    cachedActiveVersion = activeVersion;
  }
  return { keys: cachedKeys, activeVersion: cachedActiveVersion };
}

async function getKeyForVersion(version: string): Promise<CryptoKey> {
  const { keys } = ensureLoaded();
  const entry = keys.get(version);
  if (!entry) {
    throw new Error(`Encryption key version not available: ${version}`);
  }
  return entry.keyPromise;
}

// テスト・運用ツール用。env を切り替えた後に呼ぶことでキャッシュを破棄する
export function _resetEncryptionCacheForTesting(): void {
  cachedKeys = null;
  cachedActiveVersion = null;
}

// 文字列が暗号化済みフォーマット (v<N>:...) を満たすかの軽量判定。
// lazy migration で「平文か暗号文か」を分岐する用途。
export function looksEncrypted(value: string): boolean {
  return VERSION_PATTERN.test(value);
}

export function getActiveKeyVersion(): string {
  return ensureLoaded().activeVersion;
}

// アクティブ世代で暗号化。出力は "v<N>:base64..." 形式。
export async function encryptWithActiveKey(plaintext: string): Promise<string> {
  const { activeVersion } = ensureLoaded();
  const key = await getKeyForVersion(activeVersion);
  const iv = webcrypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await webcrypto.subtle.encrypt({ name: ALGORITHM, iv }, key, encoded);
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return `${activeVersion}:${Buffer.from(combined).toString("base64")}`;
}

// version prefix 付き暗号文を復号。prefix が無い場合は v1 として復号を試みる（後方互換）。
export async function decryptVersioned(encoded: string): Promise<string> {
  const match = encoded.match(VERSION_PATTERN);
  let version: string;
  let payload: string;
  if (match) {
    version = match[0].slice(0, -1); // "v1:" → "v1"
    payload = encoded.slice(match[0].length);
  } else {
    // 旧フォーマット (prefix無し base64) は v1 で復号
    version = "v1";
    payload = encoded;
  }
  const key = await getKeyForVersion(version);
  const combined = Buffer.from(payload, "base64");
  const iv = combined.subarray(0, IV_LENGTH);
  const ciphertext = combined.subarray(IV_LENGTH);
  const plaintext = await webcrypto.subtle.decrypt({ name: ALGORITHM, iv }, key, ciphertext);
  return new TextDecoder().decode(plaintext);
}

// 後方互換 API: 旧 encrypt/decrypt を呼び続けるコードのために残す。
// 内部実装はキー世代対応版に差し替え済み。
export async function encrypt(plaintext: string): Promise<string> {
  return encryptWithActiveKey(plaintext);
}

export async function decrypt(encoded: string): Promise<string> {
  return decryptVersioned(encoded);
}
