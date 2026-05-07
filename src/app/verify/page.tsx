"use client";

import { Suspense, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useIDKitRequest, orbLegacy } from "@worldcoin/idkit";
import type { IDKitResult, RpContext } from "@worldcoin/idkit-core";
import { Shield, Loader2, CheckCircle, XCircle } from "lucide-react";
// @ts-expect-error — qrcode/lib/core/qrcode has no type declarations
import QRCodeUtil from "qrcode/lib/core/qrcode";

function QRCode({ data, size = 220 }: { data: string; size?: number }) {
  const elements = useMemo(() => {
    const qr = QRCodeUtil.create(data, { errorCorrectionLevel: "M" });
    const modules: boolean[][] = qr.modules.data;
    const len = modules.length;
    const cellSize = size / (len + 2);
    const rects: { x: number; y: number; w: number }[] = [];

    for (let row = 0; row < len; row++) {
      for (let col = 0; col < len; col++) {
        if (modules[row][col]) {
          rects.push({ x: (col + 1) * cellSize, y: (row + 1) * cellSize, w: cellSize });
        }
      }
    }
    return rects;
  }, [data, size]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx={12} />
      {elements.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={c.w} height={c.w} fill="#000" />
      ))}
    </svg>
  );
}

type Stage = "loading" | "connecting" | "scan" | "verifying" | "success" | "error";

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
  const autoOpenedRef = useRef(false);

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
        setStage("connecting");
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

  // Auto-open IDKit flow once RP context is loaded
  useEffect(() => {
    if (stage === "connecting" && rpContext && worldAppId && !autoOpenedRef.current) {
      autoOpenedRef.current = true;
      idkit.open();
    }
  }, [stage, rpContext, worldAppId, idkit]);

  // connectorURI ready → show QR
  useEffect(() => {
    if (idkit.connectorURI && stage === "connecting") {
      setStage("scan");
    }
  }, [idkit.connectorURI, stage]);

  // Watch for verification success
  useEffect(() => {
    if (idkit.isSuccess && idkit.result) {
      handleSuccess(idkit.result);
    }
  }, [idkit.isSuccess, idkit.result, handleSuccess]);

  // Watch for error
  useEffect(() => {
    if (idkit.isError && idkit.errorCode) {
      setStage("error");
      setErrorMsg(`Verification error: ${idkit.errorCode}`);
      postToOpener("humanauth:error", { error: idkit.errorCode });
    }
  }, [idkit.isError, idkit.errorCode]);

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

        {(stage === "loading" || stage === "connecting") && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#00d4aa" }} />
            <span className="text-sm" style={{ color: isDark ? "#a8b0bc" : "#666666" }}>
              {stage === "loading" ? "Initializing..." : "Connecting to World ID..."}
            </span>
          </div>
        )}

        {stage === "scan" && idkit.connectorURI && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm" style={{ color: isDark ? "#a8b0bc" : "#666666" }}>
              Scan with your World App
            </p>
            <QRCode data={idkit.connectorURI} size={220} />
            <p className="text-xs" style={{ color: isDark ? "#7a8392" : "#999999" }}>
              Open World App → Scan QR code
            </p>
          </div>
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
              onClick={() => {
                setStage("connecting");
                autoOpenedRef.current = false;
                idkit.reset();
              }}
              className="mt-4 rounded-lg px-4 py-2 text-sm transition"
              style={{
                border: `1px solid ${isDark ? "#2f323e" : "#dddddd"}`,
                color: isDark ? "#a8b0bc" : "#666666",
              }}
            >
              Try Again
            </button>
          </div>
        )}

        <p className="mt-6 text-xs" style={{ color: isDark ? "#7a8392" : "#999999" }}>
          Powered by{" "}
          <span style={{ color: isDark ? "#a8b0bc" : "#333333" }}>HumanAuth</span>
        </p>
      </div>
    </div>
  );
}

function postToOpener(type: string, data: Record<string, unknown>) {
  if (window.opener) {
    window.opener.postMessage({ type, ...data }, "*");
  }
}
