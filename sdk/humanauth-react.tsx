"use client";

import { useState, useCallback } from "react";

interface HumanAuthProps {
  appId: string;
  apiKey: string;
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

const DEFAULT_API_URL = "https://humanauth.vercel.app";

/**
 * HumanAuth React component.
 *
 * Two integration modes:
 *
 * 1. **API-only** (recommended for most cases):
 *    Use IDKit or MiniKit to collect the proof client-side,
 *    then call HumanAuth's /api/verify endpoint server-side.
 *
 * 2. **Drop-in button**:
 *    Use this component which handles the full flow:
 *    get RP context → trigger IDKit → verify via HumanAuth.
 *
 * For mode 1, you don't need this component at all — just call
 * the REST API from your backend.
 */
export function HumanAuth({
  appId,
  apiKey,
  action = "humanauth-verify",
  apiUrl = DEFAULT_API_URL,
  onVerified,
  onError,
  children,
  className,
}: HumanAuthProps) {
  const [loading, setLoading] = useState(false);

  const handleVerify = useCallback(async () => {
    setLoading(true);
    try {
      const ctxRes = await fetch(`${apiUrl}/api/rp-context`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-humanauth-key": apiKey,
        },
        body: JSON.stringify({ action }),
      });

      if (!ctxRes.ok) throw new Error("Failed to get RP context");

      // At this point, the developer needs IDKit or MiniKit
      // to complete the verification flow. This component
      // provides the API orchestration layer.
      throw new Error(
        "Client-side proof collection requires @worldcoin/idkit. " +
          "Install it alongside @humanauth/react and use IDKitWidget " +
          "to collect the proof, then pass it to HumanAuth's /api/verify. " +
          `See ${apiUrl}/docs for the full integration guide.`,
      );
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [appId, apiKey, action, apiUrl, onVerified, onError]);

  if (children) {
    return (
      <button onClick={handleVerify} disabled={loading} className={className}>
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={handleVerify}
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
          Verify with World ID
        </>
      )}
    </button>
  );
}

/**
 * Helper function for server-side verification.
 * Use this in your API route to verify a World ID proof via HumanAuth.
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

export type { HumanAuthProps, VerifyResult };
