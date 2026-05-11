// OIDC scope レジストリ — Humad で利用可能な全 scope の単一の正本
//
// 新 scope を足すときはこのファイルに 1 エントリ追加するだけで:
//   - SUPPORTED_SCOPES (well-known/openid-configuration や oauth-clients CRUD)
//   - parseScopes フィルタ
//   - /oauth/consent UI 表示
// が同期する。
//
// 命名規約:
//   - OIDC 標準 scope はそのまま (openid / profile / email)
//   - Humad 独自 scope: <resource>:<action>
//       例) humad.apps_used:read, humad.verified_actions:read
//   - 外部 OAuth ブローカー scope: external.<provider>.<resource>:<action>
//       例) external.google.gmail:read

export type ScopeCategory =
  | "identity" // ユーザー同定 (openid)
  | "verification" // 人間性検証 (verified_human)
  | "contact" // 連絡先 (email)
  | "activity" // Humad 内行動履歴 (apps_used, verified_actions)
  | "wallet" // ウォレット連携 (Phase C)
  | "external"; // 外部 OAuth ブローカー (Phase C-2)

export type ScopeSensitivity = "low" | "medium" | "high";

export interface ScopeDef {
  name: string;
  category: ScopeCategory;
  sensitivity: ScopeSensitivity;
  // openid のみ true。consent UI でチェックを外せない
  mandatory?: boolean;
  // 将来のチェックボックス化で初期 OFF にする scope (高機微・補助系)
  defaultOff?: boolean;
  // consent UI 短文ラベル
  labelJa: string;
  labelEn: string;
  // consent UI 補足説明 (任意。labelより詳しく)
  descriptionJa?: string;
  descriptionEn?: string;
}

// `as const satisfies` でリテラル型推論を保ちつつ Record<string, ScopeDef> の制約を適用
// → keyof typeof SCOPE_REGISTRY で union 型を導出できる
export const SCOPE_REGISTRY = {
  openid: {
    name: "openid",
    category: "identity",
    sensitivity: "low",
    mandatory: true,
    labelJa: "Humad アカウントでサインイン",
    labelEn: "Sign you in with Humad",
  },
  profile: {
    name: "profile",
    category: "identity",
    sensitivity: "low",
    labelJa: "ハンドルと表示名の閲覧",
    labelEn: "View your handle and display name",
  },
  verified_human: {
    name: "verified_human",
    category: "verification",
    sensitivity: "low",
    labelJa: "あなたが認証済みの人間であることの確認",
    labelEn: "Confirm you are a verified human (no personal data)",
    descriptionJa: "個人を特定できる情報は渡されません",
    descriptionEn: "No personal data is shared",
  },
  email: {
    name: "email",
    category: "contact",
    sensitivity: "medium",
    labelJa: "メールアドレスの閲覧",
    labelEn: "View your email address (only if you have one set)",
    descriptionJa: "メールアドレスを登録している場合のみ渡されます",
    descriptionEn: "Only shared if you have one set",
  },
} as const satisfies Record<string, ScopeDef>;

export type Scope = keyof typeof SCOPE_REGISTRY;
export const SUPPORTED_SCOPES: readonly Scope[] = Object.keys(SCOPE_REGISTRY) as Scope[];

// 任意 string キーで lookup するための広い型エイリアス (registry 本体はリテラル型を保持)
const REGISTRY_LOOKUP: Record<string, ScopeDef | undefined> = SCOPE_REGISTRY;

export function getScopeDef(name: string): ScopeDef | undefined {
  return REGISTRY_LOOKUP[name];
}

export type Locale = "ja" | "en";

export interface ScopeDisplay {
  scope: string;
  label: string;
  description?: string;
  category: ScopeCategory;
  sensitivity: ScopeSensitivity;
  mandatory: boolean;
}

// locale に応じた表示テキストを返す。未知の scope はそのまま name を表示
export function getScopeDisplay(name: string, locale: Locale): ScopeDisplay {
  const def = REGISTRY_LOOKUP[name];
  if (!def) {
    return {
      scope: name,
      label: name,
      category: "identity",
      sensitivity: "low",
      mandatory: false,
    };
  }
  if (locale === "ja") {
    return {
      scope: name,
      label: def.labelJa,
      description: def.descriptionJa,
      category: def.category,
      sensitivity: def.sensitivity,
      mandatory: def.mandatory ?? false,
    };
  }
  return {
    scope: name,
    label: def.labelEn,
    description: def.descriptionEn,
    category: def.category,
    sensitivity: def.sensitivity,
    mandatory: def.mandatory ?? false,
  };
}

// Accept-Language ヘッダから locale を判定 (ja / ja-* なら ja、それ以外は en)
export function detectLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return "en";
  const primary = acceptLanguage.split(",")[0]?.trim().toLowerCase() ?? "";
  if (primary === "ja" || primary.startsWith("ja-")) return "ja";
  return "en";
}
