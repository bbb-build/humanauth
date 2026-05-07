"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useIDKitRequest, IDKitRequestWidget, orbLegacy } from "@worldcoin/idkit";
import type { IDKitResult, RpContext } from "@worldcoin/idkit-core";
import { Shield, Loader2, CheckCircle, XCircle } from "lucide-react";

type Stage = "loading" | "ready" | "verifying" | "success" | "error";

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" style={{ background: "#0a0a0f" }}>
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#00d4aa" }} />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}

function VerifyContent() {
  const params = useSearchParams();
  const appId = params.get("app_id") || "";
  const action = params.get("action") || "humanauth-verify";
  const theme = params.get("theme") || "dark";

  const [stage, setStage] = useState<Stage>("loading");
  const [rpContext, setRpContext] = useState<RpContext | null>(null);
  const [worldAppId, setWorldAppId] = useState<string>("");
  const [appName, setAppName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!appId) {
      setStage("error");
      setErrorMsg("Missing app_id parameter");
      return;
    }

    fetch("/api/widget/rp-context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: appId, action }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to initialize");
        return r.json();
      })
      .then((data) => {
        setRpContext(data.rp_context);
        setWorldAppId(data.world_app_id);
        setAppName(data.app_name);
        setStage("ready");
      })
      .catch(() => {
        setStage("error");
        setErrorMsg("Failed to initialize verification. Please try again.");
      });
  }, [appId, action]);

  const handleSuccess = useCallback(
    async (result: IDKitResult) => {
      setStage("verifying");

      const response = result.responses?.[0] as unknown as
        | { proof: string; merkle_root: string; nullifier_hash: string; identifier: string }
        | undefined;

      if (!response) {
        setStage("error");
        setErrorMsg("Invalid verification response");
        return;
      }

      try {
        const res = await fetch("/api/widget/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            app_id: appId,
            proof: response.proof,
            merkle_root: response.merkle_root,
            nullifier_hash: response.nullifier_hash,
            action,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStage("success");
          postToOpener("humanauth:verified", {
            nullifier_hash: data.nullifier_hash,
            is_new_user: data.is_new_user,
            action: data.action,
            verified: true,
          });
          setTimeout(() => window.close(), 1500);
        } else {
          setStage("error");
          setErrorMsg(data.error || "Verification failed");
          postToOpener("humanauth:error", { error: data.error || "Verification failed" });
        }
      } catch {
        setStage("error");
        setErrorMsg("Network error during verification");
        postToOpener("humanauth:error", { error: "Network error" });
      }
    },
    [appId, action],
  );

  const idkit = useIDKitRequest({
    app_id: (worldAppId || "app_") as `app_${string}`,
    action,
    rp_context: rpContext || { rp_id: "", nonce: "", created_at: 0, expires_at: 0, signature: "" },
    allow_legacy_proofs: true,
    preset: orbLegacy(),
  });

  const isDark = theme === "dark";

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{
        background: isDark ? "#0a0a0f" : "#ffffff",
        color: isDark ? "#ffffff" : "#111111",
      }}
    >
      <div className="w-full max-w-sm text-center">
        <Shield className="mx-auto mb-4 h-10 w-10" style={{ color: "#00d4aa" }} />

        {appName && (
          <p className="mb-2 text-sm" style={{ color: isDark ? "#7a8392" : "#666666" }}>
            {appName}
          </p>
        )}

        <h1 className="mb-6 text-xl font-bold">Verify you&apos;re human</h1>

        {stage === "loading" && (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#00d4aa" }} />
            <span style={{ color: isDark ? "#a8b0bc" : "#666666" }}>Initializing...</span>
          </div>
        )}

        {stage === "ready" && (
          <>
            <button
              onClick={idkit.open}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold transition"
              style={{ background: "#00d4aa", color: "#000000" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#00e5ba")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4aa")}
            >
              <Shield className="h-5 w-5" />
              Verify with World ID
            </button>
            <p className="mt-4 text-xs" style={{ color: isDark ? "#7a8392" : "#999999" }}>
              Powered by{" "}
              <span style={{ color: isDark ? "#a8b0bc" : "#333333" }}>HumanAuth</span>
            </p>
          </>
        )}

        {stage === "verifying" && (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#00d4aa" }} />
            <span style={{ color: isDark ? "#a8b0bc" : "#666666" }}>Verifying...</span>
          </div>
        )}

        {stage === "success" && (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="h-12 w-12" style={{ color: "#10b981" }} />
            <span className="text-lg font-semibold" style={{ color: "#10b981" }}>Verified!</span>
            <p className="text-sm" style={{ color: isDark ? "#7a8392" : "#999999" }}>
              This window will close automatically.
            </p>
          </div>
        )}

        {stage === "error" && (
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-12 w-12" style={{ color: "#ef4444" }} />
            <span className="text-sm" style={{ color: "#ef4444" }}>{errorMsg}</span>
            <button
              onClick={() => window.close()}
              className="mt-4 rounded-lg px-4 py-2 text-sm transition"
              style={{
                border: `1px solid ${isDark ? "#2f323e" : "#dddddd"}`,
                color: isDark ? "#a8b0bc" : "#666666",
              }}
            >
              Close
            </button>
          </div>
        )}

        <IDKitRequestWidget
          open={idkit.isOpen}
          onOpenChange={(open) => { if (!open) idkit.reset(); }}
          app_id={(worldAppId || "app_") as `app_${string}`}
          action={action}
          rp_context={rpContext || { rp_id: "", nonce: "", created_at: 0, expires_at: 0, signature: "" }}
          allow_legacy_proofs={true}
          preset={orbLegacy()}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}

function postToOpener(type: string, data: Record<string, unknown>) {
  if (window.opener) {
    window.opener.postMessage({ type, ...data }, "*");
  }
}
