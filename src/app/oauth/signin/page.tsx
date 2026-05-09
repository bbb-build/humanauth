"use client";

import { Suspense, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useIDKitRequest, orbLegacy } from "@worldcoin/idkit";
import type { IDKitResult, RpContext } from "@worldcoin/idkit-core";
import { Shield, Loader2, CheckCircle, XCircle } from "lucide-react";
// @ts-expect-error — qrcode/lib/core/qrcode has no type declarations
import QRCodeUtil from "qrcode/lib/core/qrcode";

function QRCode({ data, size = 220 }: { data: string; size?: number }) {
  const elements = useMemo(() => {
    const qr = QRCodeUtil.create(data, { errorCorrectionLevel: "M" });
    const cells: Uint8Array = qr.modules.data;
    const len: number = qr.modules.size;
    const cellSize = size / (len + 2);
    const rects: { x: number; y: number; w: number }[] = [];

    for (let row = 0; row < len; row++) {
      for (let col = 0; col < len; col++) {
        if (cells[row * len + col]) {
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

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// return_to は /api/oauth/authorize 配下のみ許可（オープンリダイレクト防止）
function isSafeReturnTo(returnTo: string): boolean {
  return returnTo.startsWith("/api/oauth/authorize");
}

export default function SigninPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" style={{ background: "#0a0a0f" }}>
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#00d4aa" }} />
        </div>
      }
    >
      <SigninContent />
    </Suspense>
  );
}

function SigninContent() {
  const params = useSearchParams();
  const router = useRouter();
  const returnToRaw = params.get("return_to") || "";
  const returnTo = isSafeReturnTo(returnToRaw) ? returnToRaw : "";

  const [stage, setStage] = useState<Stage>("loading");
  const [rpContext, setRpContext] = useState<RpContext | null>(null);
  const [worldAppId, setWorldAppId] = useState<string>("");
  const [resolvedAction, setResolvedAction] = useState<string>("humanary-login-v1");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const autoOpenedRef = useRef(false);
  const isMobile = useMemo(() => isMobileDevice(), []);

  useEffect(() => {
    if (!returnTo) {
      setStage("error");
      setErrorMsg("Invalid or missing return_to parameter");
      return;
    }

    fetch("/api/oauth/login-rp-context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to initialize");
        return r.json();
      })
      .then((data) => {
        setRpContext(data.rp_context);
        setWorldAppId(data.world_app_id);
        if (data.action) setResolvedAction(data.action);
        setStage("connecting");
      })
      .catch(() => {
        setStage("error");
        setErrorMsg("Failed to initialize sign-in. Please try again.");
      });
  }, [returnTo]);

  const handleSuccess = useCallback(
    async (result: IDKitResult) => {
      setStage("verifying");

      if (!result.responses?.length) {
        setStage("error");
        setErrorMsg("Invalid verification response");
        return;
      }

      try {
        const res = await fetch("/api/oauth/world-id-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            protocol_version: result.protocol_version,
            nonce: result.nonce,
            responses: result.responses,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStage("success");
          // return_to (= /api/oauth/authorize?...) にフルリダイレクト
          // クッキー反映のためrouter.pushではなくlocation代入を使う
          setTimeout(() => {
            window.location.href = returnTo;
          }, 600);
        } else {
          setStage("error");
          setErrorMsg(data.error || "Sign-in failed");
        }
      } catch {
        setStage("error");
        setErrorMsg("Network error during sign-in");
      }
    },
    [returnTo],
  );

  const idkit = useIDKitRequest({
    app_id: (worldAppId || "app_") as `app_${string}`,
    action: resolvedAction,
    rp_context: rpContext || { rp_id: "", nonce: "", created_at: 0, expires_at: 0, signature: "" },
    allow_legacy_proofs: true,
    preset: orbLegacy(),
  });

  useEffect(() => {
    if (stage === "connecting" && rpContext && worldAppId && !autoOpenedRef.current) {
      autoOpenedRef.current = true;
      idkit.open();
    }
  }, [stage, rpContext, worldAppId, idkit]);

  useEffect(() => {
    if (idkit.connectorURI && stage === "connecting") {
      setStage("scan");
    }
  }, [idkit.connectorURI, stage]);

  useEffect(() => {
    if (idkit.isSuccess && idkit.result) {
      handleSuccess(idkit.result);
    }
  }, [idkit.isSuccess, idkit.result, handleSuccess]);

  useEffect(() => {
    if (idkit.isError && idkit.errorCode) {
      setStage("error");
      setErrorMsg(`Sign-in error: ${idkit.errorCode}`);
    }
  }, [idkit.isError, idkit.errorCode]);

  // routerは未使用警告を抑える
  void router;

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{ background: "#0a0a0f", color: "#ffffff" }}
    >
      <div className="w-full max-w-sm text-center">
        <Shield className="mx-auto mb-4 h-10 w-10" style={{ color: "#00d4aa" }} />

        <p className="mb-2 text-sm" style={{ color: "#7a8392" }}>
          Sign in with Humanary
        </p>
        <h1 className="mb-6 text-xl font-bold">Verify you are human</h1>

        {(stage === "loading" || stage === "connecting") && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#00d4aa" }} />
            <span className="text-sm" style={{ color: "#a8b0bc" }}>
              {stage === "loading" ? "Initializing..." : "Connecting to World ID..."}
            </span>
          </div>
        )}

        {stage === "scan" && idkit.connectorURI && (
          <div className="flex flex-col items-center gap-4">
            {isMobile ? (
              <>
                <p className="text-sm" style={{ color: "#a8b0bc" }}>
                  Tap to verify in World App
                </p>
                <a
                  href={idkit.connectorURI}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "14px 32px",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#ffffff",
                    backgroundColor: "#00d4aa",
                    borderRadius: "12px",
                    textDecoration: "none",
                  }}
                >
                  Open World App
                </a>
                <p className="text-xs" style={{ color: "#7a8392" }}>
                  You will be redirected back after verification
                </p>
              </>
            ) : (
              <>
                <p className="text-sm" style={{ color: "#a8b0bc" }}>
                  Scan with your World App
                </p>
                <QRCode data={idkit.connectorURI} size={220} />
                <p className="text-xs" style={{ color: "#7a8392" }}>
                  Open World App → Scan QR code
                </p>
              </>
            )}
          </div>
        )}

        {stage === "verifying" && (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#00d4aa" }} />
            <span style={{ color: "#a8b0bc" }}>Signing in...</span>
          </div>
        )}

        {stage === "success" && (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="h-12 w-12" style={{ color: "#10b981" }} />
            <span className="text-lg font-semibold" style={{ color: "#10b981" }}>
              Signed in
            </span>
            <p className="text-sm" style={{ color: "#7a8392" }}>
              Redirecting...
            </p>
          </div>
        )}

        {stage === "error" && (
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-12 w-12" style={{ color: "#ef4444" }} />
            <span className="text-sm" style={{ color: "#ef4444" }}>
              {errorMsg}
            </span>
            <button
              onClick={() => {
                setStage("connecting");
                autoOpenedRef.current = false;
                idkit.reset();
              }}
              className="mt-4 rounded-lg px-4 py-2 text-sm transition"
              style={{ border: "1px solid #2f323e", color: "#a8b0bc" }}
            >
              Try Again
            </button>
          </div>
        )}

        <p className="mt-6 text-xs" style={{ color: "#7a8392" }}>
          Powered by{" "}
          <span style={{ color: "#a8b0bc" }}>Humanary</span>
        </p>
      </div>
    </div>
  );
}
