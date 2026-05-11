"use client";

import { useState } from "react";
import { Shield, Check, Loader2 } from "lucide-react";
import type { Locale, ScopeDisplay, ScopeSensitivity } from "@/lib/scopes";

interface Props {
  clientName: string;
  clientId: string;
  scope: string;
  scopes: ScopeDisplay[];
  returnTo: string;
  userHandle: string;
  userDisplayName: string;
  locale: Locale;
}

// 機微度ごとの色分け (low: 緑系 / medium: 黄系 / high: 赤系)
const SENSITIVITY_COLOR: Record<ScopeSensitivity, string> = {
  low: "#00d4aa",
  medium: "#f5b400",
  high: "#ef4444",
};

const I18N = {
  ja: {
    authorize: (name: string) => `${name} を承認`,
    signedInAs: "サインイン中:",
    wantsTo: (name: string) => `${name} は以下の操作を求めています:`,
    required: "必須",
    allow: "許可する",
    deny: "拒否する",
    revokeNote: "アクセス権はいつでも Humad の設定から取り消せます。",
    errorRecord: "同意の記録に失敗しました",
    errorNetwork: "ネットワークエラー",
  },
  en: {
    authorize: (name: string) => `Authorize ${name}`,
    signedInAs: "Signed in as",
    wantsTo: (name: string) => `${name} wants to:`,
    required: "Required",
    allow: "Allow",
    deny: "Deny",
    revokeNote: "You can revoke access anytime from your Humad settings.",
    errorRecord: "Failed to record consent",
    errorNetwork: "Network error",
  },
} as const;

export default function ConsentClient(props: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = I18N[props.locale];

  const onApprove = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/oauth/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: props.clientId,
          scope: props.scope,
          return_to: props.returnTo,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t.errorRecord);
        setSubmitting(false);
        return;
      }
      window.location.href = data.return_to;
    } catch {
      setError(t.errorNetwork);
      setSubmitting(false);
    }
  };

  const onDeny = () => {
    // OAuth仕様: ユーザー拒否はaccess_deniedで戻す
    // authorize endpointまでクエリで access_denied を伝えるため、
    // 元のauthorize URLに &user_consent=deny を付けてredirect
    const url = new URL(props.returnTo, window.location.origin);
    url.searchParams.set("user_consent", "deny");
    window.location.href = url.pathname + url.search;
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{ background: "#0a0a0f", color: "#ffffff" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{ background: "#12141a", border: "1px solid #2f323e" }}
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Shield className="mb-3 h-10 w-10" style={{ color: "#00d4aa" }} />
          <h1 className="mb-1 text-xl font-bold">{t.authorize(props.clientName)}</h1>
          <p className="text-sm" style={{ color: "#a8b0bc" }}>
            {t.signedInAs}{" "}
            <span style={{ color: "#ffffff" }}>
              {props.userDisplayName || `@${props.userHandle}`}
            </span>
          </p>
        </div>

        <p className="mb-3 text-sm" style={{ color: "#a8b0bc" }}>
          {t.wantsTo(props.clientName)}
        </p>
        <ul className="mb-6 space-y-3">
          {props.scopes.map((s) => (
            <li key={s.scope} className="flex items-start gap-3">
              <Check
                className="mt-0.5 h-4 w-4 flex-shrink-0"
                style={{ color: SENSITIVITY_COLOR[s.sensitivity] }}
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{s.label}</span>
                  {s.mandatory && (
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                      style={{ background: "#2f323e", color: "#a8b0bc" }}
                    >
                      {t.required}
                    </span>
                  )}
                </div>
                {s.description && (
                  <span className="text-xs" style={{ color: "#7a8392" }}>
                    {s.description}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>

        {error && (
          <p className="mb-4 text-sm" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={onApprove}
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition disabled:opacity-50"
            style={{ background: "#00d4aa", color: "#0a0a0f" }}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t.allow}
          </button>
          <button
            onClick={onDeny}
            disabled={submitting}
            className="rounded-lg px-4 py-3 text-sm transition disabled:opacity-50"
            style={{ border: "1px solid #2f323e", color: "#a8b0bc" }}
          >
            {t.deny}
          </button>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: "#7a8392" }}>
          {t.revokeNote}
        </p>
      </div>
    </div>
  );
}
