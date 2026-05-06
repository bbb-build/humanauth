"use client";

// humanauth-react.tsx
import { useState, useCallback, useEffect } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_API_URL = "https://humanauth.vercel.app";
function HumanAuth({
  appId,
  apiKey,
  action = "humanauth-verify",
  apiUrl = DEFAULT_API_URL,
  verificationLevel = "orb",
  onVerified,
  onError,
  children,
  className
}) {
  const [loading, setLoading] = useState(false);
  const [rpContext, setRpContext] = useState(null);
  const [idkitModule, setIdkitModule] = useState(null);
  useEffect(() => {
    fetchRpContext();
    loadIdkit();
  }, [apiKey, action, apiUrl]);
  async function fetchRpContext() {
    try {
      const res = await fetch(`${apiUrl}/api/rp-context`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-humanauth-key": apiKey
        },
        body: JSON.stringify({ action })
      });
      if (!res.ok) throw new Error("Failed to get RP context");
      const data = await res.json();
      setRpContext(data.rp_context);
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  }
  async function loadIdkit() {
    try {
      const mod = await import("@worldcoin/idkit");
      setIdkitModule({
        IDKitRequestWidget: mod.IDKitRequestWidget,
        useIDKitRequest: mod.useIDKitRequest,
        orbLegacy: mod.orbLegacy
      });
    } catch {
    }
  }
  const handleSuccess = useCallback(
    async (result) => {
      setLoading(true);
      try {
        let proof;
        let merkle_root;
        let nullifier_hash;
        if (result.responses && Array.isArray(result.responses)) {
          const resp = result.responses[0];
          proof = resp.proof;
          merkle_root = resp.merkle_root;
          nullifier_hash = resp.nullifier;
        } else {
          proof = result.proof;
          merkle_root = result.merkle_root;
          nullifier_hash = result.nullifier_hash;
        }
        const verifyRes = await fetch(`${apiUrl}/api/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-humanauth-key": apiKey
          },
          body: JSON.stringify({
            proof,
            merkle_root,
            nullifier_hash,
            action,
            verification_level: verificationLevel
          })
        });
        if (!verifyRes.ok) {
          const err = await verifyRes.json().catch(() => ({ error: "Verification failed" }));
          throw new Error(err.error || "Verification failed");
        }
        const data = await verifyRes.json();
        onVerified(data);
      } catch (err) {
        onError?.(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    [apiKey, apiUrl, action, verificationLevel, onVerified, onError]
  );
  if (idkitModule && rpContext) {
    return /* @__PURE__ */ jsx(
      HumanAuthWithIDKit,
      {
        idkit: idkitModule,
        rpContext,
        appId,
        action,
        onSuccess: handleSuccess,
        loading,
        className,
        children
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => {
        if (!rpContext) {
          onError?.(new Error("RP context not loaded. Please install @worldcoin/idkit for the full flow, or wait for initialization."));
          return;
        }
        onError?.(new Error("Please install @worldcoin/idkit: npm install @worldcoin/idkit"));
      },
      disabled: loading || !rpContext,
      className: className || void 0,
      style: !className ? {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 24px",
        borderRadius: "12px",
        border: "none",
        background: "#22d3ee",
        color: "#000",
        fontWeight: 600,
        fontSize: "14px",
        cursor: loading ? "wait" : "pointer",
        opacity: loading || !rpContext ? 0.7 : 1
      } : void 0,
      children: loading ? "Verifying..." : !rpContext ? "Loading..." : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }),
        children || "Verify with World ID"
      ] })
    }
  );
}
function HumanAuthWithIDKit({
  idkit,
  rpContext,
  appId,
  action,
  onSuccess,
  loading,
  className,
  children
}) {
  const idkitState = idkit.useIDKitRequest({
    app_id: appId,
    action,
    rp_context: rpContext,
    allow_legacy_proofs: true,
    preset: idkit.orbLegacy()
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: idkitState.open,
        disabled: loading,
        className: className || void 0,
        style: !className ? {
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 24px",
          borderRadius: "12px",
          border: "none",
          background: "#22d3ee",
          color: "#000",
          fontWeight: 600,
          fontSize: "14px",
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.7 : 1
        } : void 0,
        children: loading ? "Verifying..." : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }),
          children || "Verify with World ID"
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      idkit.IDKitRequestWidget,
      {
        open: idkitState.isOpen,
        onOpenChange: (open) => {
          if (!open) idkitState.reset();
        },
        app_id: appId,
        action,
        rp_context: rpContext,
        allow_legacy_proofs: true,
        preset: idkit.orbLegacy(),
        onSuccess
      }
    )
  ] });
}
async function verifyWithHumanAuth(params) {
  const { apiKey, apiUrl = DEFAULT_API_URL, ...body } = params;
  const res = await fetch(`${apiUrl}/api/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-humanauth-key": apiKey
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Verification failed");
  }
  return res.json();
}
export {
  HumanAuth,
  verifyWithHumanAuth
};
