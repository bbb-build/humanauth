"use client";

import { signIn, getUser, signOut, type TokenSet, type UserInfo } from "humanauth-sdk";
import { useEffect, useState } from "react";

const STORAGE_KEY = "humanauth_demo_tokens";

const CLIENT_ID = process.env.NEXT_PUBLIC_HUMANAUTH_CLIENT_ID ?? "";
const API_URL =
  process.env.NEXT_PUBLIC_HUMANAUTH_API_URL ?? "https://humanauth.vercel.app";
const REDIRECT_URI =
  process.env.NEXT_PUBLIC_HUMANAUTH_REDIRECT_URI ??
  (typeof window !== "undefined"
    ? `${window.location.origin}/oauth/callback`
    : "");

export default function HomePage() {
  const [tokens, setTokens] = useState<TokenSet | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // セッション復元（callbackページで保存したtokensを読み込む）
  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as TokenSet;
      setTokens(parsed);
      setLoading(true);
      getUser(parsed, API_URL)
        .then(setUser)
        .catch((e) => setError(String(e)))
        .finally(() => setLoading(false));
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  async function handleSignIn() {
    if (!CLIENT_ID) {
      setError("NEXT_PUBLIC_HUMANAUTH_CLIENT_ID が未設定です。.env.local を確認してください");
      return;
    }
    setError(null);
    try {
      await signIn({
        clientId: CLIENT_ID,
        redirectUri: REDIRECT_URI,
        scopes: ["openid", "profile", "verified_human"],
        apiUrl: API_URL,
      });
      // signIn() はリダイレクトするので以降のコードは実行されない
    } catch (e) {
      setError(String(e));
    }
  }

  async function handleSignOut() {
    if (!tokens) return;
    setLoading(true);
    try {
      await signOut({
        token: tokens.refreshToken ?? tokens.accessToken,
        tokenTypeHint: tokens.refreshToken ? "refresh_token" : "access_token",
        clientId: CLIENT_ID,
        apiUrl: API_URL,
      });
    } catch (e) {
      console.warn("revoke failed (ignored)", e);
    } finally {
      sessionStorage.removeItem(STORAGE_KEY);
      setTokens(null);
      setUser(null);
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "64px 24px",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>
        Login with Humanary — Sample
      </h1>
      <p style={{ color: "#a8b0bc", marginBottom: 32 }}>
        humanauth-sdk@0.2.x を使った最小サンプル。<code>signIn() → handleCallback() → getUser()</code> の流れを実演します。
      </p>

      {error && (
        <div
          style={{
            padding: 16,
            border: "1px solid #ef4444",
            borderRadius: 8,
            marginBottom: 24,
            color: "#fca5a5",
            background: "#1f0a0a",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {!tokens ? (
        <button
          onClick={handleSignIn}
          style={{
            background: "#00d4aa",
            color: "#0a0a0f",
            border: "none",
            borderRadius: 8,
            padding: "14px 24px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sign in with Humanary
        </button>
      ) : (
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Signed in ✓</h2>

          <Section title="UserInfo (/api/oauth/userinfo)">
            {loading ? (
              <em style={{ color: "#a8b0bc" }}>loading…</em>
            ) : (
              <pre style={preStyle}>{JSON.stringify(user, null, 2)}</pre>
            )}
          </Section>

          <Section title="TokenSet">
            <pre style={preStyle}>
              {JSON.stringify(
                {
                  ...tokens,
                  accessToken: tokens.accessToken.slice(0, 20) + "…",
                  refreshToken: tokens.refreshToken
                    ? tokens.refreshToken.slice(0, 20) + "…"
                    : undefined,
                  idToken: tokens.idToken
                    ? tokens.idToken.slice(0, 40) + "…"
                    : undefined,
                },
                null,
                2,
              )}
            </pre>
          </Section>

          <button
            onClick={handleSignOut}
            disabled={loading}
            style={{
              background: "transparent",
              color: "#ef4444",
              border: "1px solid #ef4444",
              borderRadius: 8,
              padding: "10px 18px",
              fontSize: 14,
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            Sign out (revoke token)
          </button>
        </div>
      )}

      <hr style={{ margin: "48px 0", border: "none", borderTop: "1px solid #2f323e" }} />

      <details>
        <summary style={{ cursor: "pointer", color: "#a8b0bc" }}>
          設定確認
        </summary>
        <pre style={preStyle}>
          {JSON.stringify(
            {
              CLIENT_ID: CLIENT_ID || "(未設定)",
              API_URL,
              REDIRECT_URI,
            },
            null,
            2,
          )}
        </pre>
      </details>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, color: "#a8b0bc", marginBottom: 8 }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

const preStyle: React.CSSProperties = {
  background: "#12141a",
  border: "1px solid #2f323e",
  borderRadius: 8,
  padding: 16,
  fontSize: 13,
  overflow: "auto",
  color: "#e5e7eb",
};
