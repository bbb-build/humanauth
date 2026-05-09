"use client";

import { handleCallback } from "humanauth-sdk";
import { useEffect, useState } from "react";

const STORAGE_KEY = "humanauth_demo_tokens";

const CLIENT_ID = process.env.NEXT_PUBLIC_HUMANAUTH_CLIENT_ID ?? "";
const API_URL =
  process.env.NEXT_PUBLIC_HUMANAUTH_API_URL ?? "https://humanauth.vercel.app";

export default function CallbackPage() {
  const [status, setStatus] = useState<"working" | "ok" | "error">("working");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await handleCallback({
          clientId: CLIENT_ID,
          apiUrl: API_URL,
        });
        if (cancelled) return;

        // ホーム画面で再利用するためにsessionStorageへ保存
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result.tokens));

        setStatus("ok");
        setMessage("認証完了。ホームに戻ります…");
        setTimeout(() => {
          window.location.replace("/");
        }, 600);
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setMessage(String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "64px 24px",
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>OAuth Callback</h1>
      {status === "working" && (
        <p style={{ color: "#a8b0bc" }}>
          authorization_code をトークンに交換しています…
        </p>
      )}
      {status === "ok" && (
        <p style={{ color: "#10b981" }}>{message}</p>
      )}
      {status === "error" && (
        <div
          style={{
            padding: 16,
            border: "1px solid #ef4444",
            borderRadius: 8,
            color: "#fca5a5",
            background: "#1f0a0a",
          }}
        >
          <strong>Error:</strong>
          <pre
            style={{
              marginTop: 8,
              fontSize: 13,
              overflow: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {message}
          </pre>
          <p style={{ marginTop: 12 }}>
            <a href="/" style={{ color: "#00d4aa" }}>
              ← ホームに戻る
            </a>
          </p>
        </div>
      )}
    </main>
  );
}
