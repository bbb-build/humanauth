"use client";

// humanauth-react.tsx
import { useState, useCallback, useEffect, useMemo, useRef } from "react";

// src/agents.ts
var DEFAULT_API_URL = "https://humanauth.vercel.app";
var HumadAgentClient = class {
  constructor(params) {
    this.accessToken = params.accessToken;
    this.apiUrl = (params.apiUrl || DEFAULT_API_URL).replace(/\/+$/, "");
  }
  async startAgentRegistration() {
    return this.request("/api/v1/agents", {
      method: "POST"
    });
  }
  async finalizeAgentRegistration(address, proof) {
    return this.request(
      `/api/v1/agents/${encodeURIComponent(address)}/finalize`,
      {
        method: "POST",
        body: JSON.stringify(proof)
      }
    );
  }
  async listAgents() {
    const data = await this.request("/api/v1/agents", {
      method: "GET"
    });
    return data.agents;
  }
  async request(path, init) {
    const res = await fetch(`${this.apiUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
        ...init.headers
      }
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      const message = typeof error.error === "string" ? error.error : typeof error.message === "string" ? error.message : "Humad agent API request failed";
      throw new Error(message);
    }
    return res.json();
  }
};

// humanauth-react.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_API_URL2 = "https://humanauth.vercel.app";
function HumanAuth({
  appId,
  apiKey,
  action = "humanauth-verify",
  apiUrl = DEFAULT_API_URL2,
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
    if (apiKey) {
      console.warn(
        "[HumanAuth] Passing apiKey to a client component exposes it in the browser. Use widget flow (appId only) or call verifyWithHumanAuth() server-side."
      );
    }
  }, [apiKey]);
  useEffect(() => {
    fetchRpContext();
    loadIdkit();
  }, [appId, apiKey, action, apiUrl]);
  async function fetchRpContext() {
    try {
      const useWidget = !apiKey;
      const endpoint = useWidget ? `${apiUrl}/api/widget/rp-context` : `${apiUrl}/api/rp-context`;
      const headers = { "Content-Type": "application/json" };
      if (!useWidget) headers["x-humanauth-key"] = apiKey;
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(useWidget ? { app_id: appId, action } : { action })
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
        const useWidget = !apiKey;
        const endpoint = useWidget ? `${apiUrl}/api/widget/verify` : `${apiUrl}/api/verify`;
        const headers = { "Content-Type": "application/json" };
        if (!useWidget) headers["x-humanauth-key"] = apiKey;
        let body;
        if (useWidget) {
          body = { app_id: appId, idkit_response: result };
        } else if (result.responses && Array.isArray(result.responses)) {
          const resp = result.responses[0];
          body = {
            proof: resp.proof,
            merkle_root: resp.merkle_root,
            nullifier_hash: resp.nullifier,
            action,
            verification_level: verificationLevel
          };
        } else {
          body = {
            proof: result.proof,
            merkle_root: result.merkle_root,
            nullifier_hash: result.nullifier_hash,
            action,
            verification_level: verificationLevel
          };
        }
        const verifyRes = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(body)
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
    [apiKey, appId, apiUrl, action, verificationLevel, onVerified, onError]
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
function AuthorizeAgent({
  accessToken,
  apiUrl,
  pendingProof,
  onAuthorized,
  onError,
  label,
  className
}) {
  const [start, setStart] = useState(null);
  const [finalizing, setFinalizing] = useState(false);
  const finalizedProofRef = useRef(null);
  const onAuthorizedRef = useRef(onAuthorized);
  const onErrorRef = useRef(onError);
  const client = useMemo(() => new HumadAgentClient({ accessToken, apiUrl }), [accessToken, apiUrl]);
  useEffect(() => {
    onAuthorizedRef.current = onAuthorized;
    onErrorRef.current = onError;
  }, [onAuthorized, onError]);
  useEffect(() => {
    let cancelled = false;
    setStart(null);
    setFinalizing(false);
    finalizedProofRef.current = null;
    client.startAgentRegistration().then((result) => {
      if (!cancelled) setStart(result);
    }).catch((err) => {
      if (!cancelled) onErrorRef.current?.(err instanceof Error ? err : new Error(String(err)));
    });
    return () => {
      cancelled = true;
    };
  }, [client]);
  useEffect(() => {
    if (!start || !pendingProof) return;
    const proofKey = JSON.stringify({
      address: start.agent_address,
      proof: pendingProof
    });
    if (finalizedProofRef.current === proofKey) return;
    finalizedProofRef.current = proofKey;
    setFinalizing(true);
    client.finalizeAgentRegistration(start.agent_address, pendingProof).then((result) => onAuthorizedRef.current(result)).catch((err) => onErrorRef.current?.(err instanceof Error ? err : new Error(String(err)))).finally(() => setFinalizing(false));
  }, [client, pendingProof, start]);
  if (!start) {
    return /* @__PURE__ */ jsx("div", { className, children: "Loading..." });
  }
  return /* @__PURE__ */ jsxs("div", { className, children: [
    label && /* @__PURE__ */ jsx("div", { children: label }),
    /* @__PURE__ */ jsx("img", { src: start.qr_data, alt: "Authorize agent with World App" }),
    /* @__PURE__ */ jsxs("div", { children: [
      "Agent: ",
      start.agent_address
    ] }),
    finalizing && /* @__PURE__ */ jsx("div", { children: "Finalizing..." })
  ] });
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
  const { apiKey, apiUrl = DEFAULT_API_URL2, ...body } = params;
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
  AuthorizeAgent,
  HumanAuth,
  verifyWithHumanAuth
};
