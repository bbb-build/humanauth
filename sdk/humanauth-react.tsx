// @humanauth/react — Drop-in World ID verification component
// このファイルは将来 npm パッケージとして分離する

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

interface RpContext {
  rp_id: string;
  nonce: string;
  created_at: number;
  expires_at: number;
  signature: string;
}

const DEFAULT_API_URL = "https://humanauth.dev";

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
      // 1. RP Contextを取得
      const ctxRes = await fetch(`${apiUrl}/api/rp-context`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-humanauth-key": apiKey,
        },
        body: JSON.stringify({ action }),
      });

      if (!ctxRes.ok) throw new Error("Failed to get RP context");
      const { rp_context } = (await ctxRes.json()) as { rp_context: RpContext };

      // 2. IDKitまたはMiniKitで検証を実行
      //    実際の実装ではIDKitRequestWidgetを呼ぶ
      //    ここではAPIレベルのフローを示す
      const idkitResult = await triggerWorldIdVerification(rp_context, action, appId);

      // 3. HumanAuth APIで検証
      const verifyRes = await fetch(`${apiUrl}/api/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-humanauth-key": apiKey,
        },
        body: JSON.stringify({
          proof: idkitResult.proof,
          merkle_root: idkitResult.merkle_root,
          nullifier_hash: idkitResult.nullifier_hash,
          action,
        }),
      });

      if (!verifyRes.ok) throw new Error("Verification failed");
      const result = (await verifyRes.json()) as VerifyResult;
      onVerified(result);
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
      className={className || "humanauth-btn"}
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

// IDKit連携のプレースホルダー
// 実際にはIDKitRequestWidgetまたはMiniKit.verifyを使う
async function triggerWorldIdVerification(
  _rpContext: RpContext,
  _action: string,
  _appId: string,
): Promise<{ proof: string; merkle_root: string; nullifier_hash: string }> {
  throw new Error(
    "IDKit integration required. Use @worldcoin/idkit alongside @humanauth/react. " +
    "See docs at humanauth.dev/docs for the full integration guide."
  );
}

export type { HumanAuthProps, VerifyResult };
