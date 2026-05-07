"use strict";
"use client";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// humanauth-react.tsx
var humanauth_react_exports = {};
__export(humanauth_react_exports, {
  HumanAuth: () => HumanAuth,
  verifyWithHumanAuth: () => verifyWithHumanAuth
});
module.exports = __toCommonJS(humanauth_react_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
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
  const [loading, setLoading] = (0, import_react.useState)(false);
  const [rpContext, setRpContext] = (0, import_react.useState)(null);
  const [idkitModule, setIdkitModule] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    if (apiKey) {
      console.warn(
        "[HumanAuth] Passing apiKey to a client component exposes it in the browser. Use widget flow (appId only) or call verifyWithHumanAuth() server-side."
      );
    }
  }, [apiKey]);
  (0, import_react.useEffect)(() => {
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
  const handleSuccess = (0, import_react.useCallback)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
      children: loading ? "Verifying..." : !rpContext ? "Loading..." : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }),
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        children: loading ? "Verifying..." : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__  */ (0, import_jsx_runtime.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }),
          children || "Verify with World ID"
        ] })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HumanAuth,
  verifyWithHumanAuth
});
