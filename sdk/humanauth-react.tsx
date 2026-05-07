"use client";

import { useState, useCallback, useEffect } from "react";

interface HumanAuthProps {
  appId: string;
  /** @deprecated Use widget flow (appId only) instead. API keys should only be used server-side. */
  apiKey?: string;
  action?: string;
  apiUrl?: string;
  verificationLevel?: "orb" | "device" | "phone";
  onVerified: (result: VerifyResult) => void;
  onError?: (error: Error) => void;
  children?: React.ReactNode;
  className?: string;
}

interface VerifyResult {
  success: boolean;
  nullifier_hash: string;
  is_new_user: boolean;
  action: string;
}

interface RpContext {
  rp_id: string;
  nonce: string;
  created_at: number;
  expires_at: number;
  signature: string;
}

const DEFAULT_API_URL = "https://humanauth.vercel.app";

/**
 * HumanAuth drop-in React component.
 *
 * Preferred: pass only `appId` (widget flow with Origin-based auth).
 * Server-side: use `verifyWithHumanAuth()` with apiKey instead.
 */
export function HumanAuth({
  appId,
  apiKey,
  action = "humanauth-verify",
  apiUrl = DEFAULT_API_URL,
  verificationLevel = "orb",
  onVerified,
  onError,
  children,
  className,
}: HumanAuthProps) {
  const [loading, setLoading] = useState(false);
  const [rpContext, setRpContext] = useState<RpContext | null>(null);
  const [idkitModule, setIdkitModule] = useState<{
    IDKitRequestWidget: React.ComponentType<Record<string, unknown>>;
    useIDKitRequest: (config: Record<string, unknown>) => { open: () => void; isOpen: boolean; reset: () => void };
    orbLegacy: () => unknown;
  } | null>(null);

  useEffect(() => {
    if (apiKey) {
      console.warn(
        "[HumanAuth] Passing apiKey to a client component exposes it in the browser. " +
        "Use widget flow (appId only) or call verifyWithHumanAuth() server-side."
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
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (!useWidget) headers["x-humanauth-key"] = apiKey!;

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(useWidget ? { app_id: appId, action } : { action }),
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
        IDKitRequestWidget: mod.IDKitRequestWidget as unknown as React.ComponentType<Record<string, unknown>>,
        useIDKitRequest: mod.useIDKitRequest as unknown as (config: Record<string, unknown>) => { open: () => void; isOpen: boolean; reset: () => void },
        orbLegacy: mod.orbLegacy as unknown as () => unknown,
      });
    } catch {
      // IDKit not installed — fall back to API-only mode
    }
  }

  const handleSuccess = useCallback(
    async (result: Record<string, unknown>) => {
      setLoading(true);
      try {
        const useWidget = !apiKey;
        const endpoint = useWidget ? `${apiUrl}/api/widget/verify` : `${apiUrl}/api/verify`;
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (!useWidget) headers["x-humanauth-key"] = apiKey!;

        let body: Record<string, unknown>;

        if (useWidget) {
          body = { app_id: appId, idkit_response: result };
        } else if (result.responses && Array.isArray(result.responses)) {
          const resp = result.responses[0] as Record<string, unknown>;
          body = {
            proof: resp.proof,
            merkle_root: resp.merkle_root,
            nullifier_hash: resp.nullifier,
            action,
            verification_level: verificationLevel,
          };
        } else {
          body = {
            proof: result.proof,
            merkle_root: result.merkle_root,
            nullifier_hash: result.nullifier_hash,
            action,
            verification_level: verificationLevel,
          };
        }

        const verifyRes = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
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
    [apiKey, appId, apiUrl, action, verificationLevel, onVerified, onError],
  );

  if (idkitModule && rpContext) {
    return (
      <HumanAuthWithIDKit
        idkit={idkitModule}
        rpContext={rpContext}
        appId={appId}
        action={action}
        onSuccess={handleSuccess}
        loading={loading}
        className={className}
      >
        {children}
      </HumanAuthWithIDKit>
    );
  }

  return (
    <button
      onClick={() => {
        if (!rpContext) {
          onError?.(new Error("RP context not loaded. Please install @worldcoin/idkit for the full flow, or wait for initialization."));
          return;
        }
        onError?.(new Error("Please install @worldcoin/idkit: npm install @worldcoin/idkit"));
      }}
      disabled={loading || !rpContext}
      className={className || undefined}
      style={
        !className
          ? {
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
              opacity: loading || !rpContext ? 0.7 : 1,
            }
          : undefined
      }
    >
      {loading ? (
        "Verifying..."
      ) : !rpContext ? (
        "Loading..."
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          {children || "Verify with World ID"}
        </>
      )}
    </button>
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
  children,
}: {
  idkit: NonNullable<Parameters<typeof HumanAuth>[0] extends never ? never : {
    IDKitRequestWidget: React.ComponentType<Record<string, unknown>>;
    useIDKitRequest: (config: Record<string, unknown>) => { open: () => void; isOpen: boolean; reset: () => void };
    orbLegacy: () => unknown;
  }>;
  rpContext: RpContext;
  appId: string;
  action: string;
  onSuccess: (result: Record<string, unknown>) => void;
  loading: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const idkitState = idkit.useIDKitRequest({
    app_id: appId as `app_${string}`,
    action,
    rp_context: rpContext,
    allow_legacy_proofs: true,
    preset: idkit.orbLegacy(),
  });

  return (
    <>
      <button
        onClick={idkitState.open}
        disabled={loading}
        className={className || undefined}
        style={
          !className
            ? {
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
                opacity: loading ? 0.7 : 1,
              }
            : undefined
        }
      >
        {loading ? (
          "Verifying..."
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            {children || "Verify with World ID"}
          </>
        )}
      </button>
      <idkit.IDKitRequestWidget
        open={idkitState.isOpen}
        onOpenChange={(open: boolean) => { if (!open) idkitState.reset(); }}
        app_id={appId as `app_${string}`}
        action={action}
        rp_context={rpContext}
        allow_legacy_proofs={true}
        preset={idkit.orbLegacy()}
        onSuccess={onSuccess}
      />
    </>
  );
}

/**
 * Server-side verification helper.
 * Call this from your API route to verify a World ID proof via HumanAuth.
 */
export async function verifyWithHumanAuth(params: {
  apiKey: string;
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  action?: string;
  verification_level?: string;
  apiUrl?: string;
}): Promise<VerifyResult> {
  const { apiKey, apiUrl = DEFAULT_API_URL, ...body } = params;
  const res = await fetch(`${apiUrl}/api/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-humanauth-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Verification failed");
  }

  return res.json();
}

export type { HumanAuthProps, VerifyResult, RpContext };
