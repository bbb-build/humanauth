"use client";

import { useState } from "react";
import { Shield, Check, Loader2 } from "lucide-react";

interface Props {
  clientName: string;
  clientId: string;
  scope: string;
  scopes: Array<{ scope: string; description: string }>;
  returnTo: string;
  userHandle: string;
  userDisplayName: string;
}

export default function ConsentClient(props: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError(data.error || "Failed to record consent");
        setSubmitting(false);
        return;
      }
      window.location.href = data.return_to;
    } catch {
      setError("Network error");
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
          <h1 className="mb-1 text-xl font-bold">Authorize {props.clientName}</h1>
          <p className="text-sm" style={{ color: "#a8b0bc" }}>
            Signed in as{" "}
            <span style={{ color: "#ffffff" }}>
              {props.userDisplayName || `@${props.userHandle}`}
            </span>
          </p>
        </div>

        <p className="mb-3 text-sm" style={{ color: "#a8b0bc" }}>
          {props.clientName} wants to:
        </p>
        <ul className="mb-6 space-y-3">
          {props.scopes.map((s) => (
            <li key={s.scope} className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#00d4aa" }} />
              <span className="text-sm">{s.description}</span>
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
            Allow
          </button>
          <button
            onClick={onDeny}
            disabled={submitting}
            className="rounded-lg px-4 py-3 text-sm transition disabled:opacity-50"
            style={{ border: "1px solid #2f323e", color: "#a8b0bc" }}
          >
            Deny
          </button>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: "#7a8392" }}>
          You can revoke access anytime from your Humad settings.
        </p>
      </div>
    </div>
  );
}
