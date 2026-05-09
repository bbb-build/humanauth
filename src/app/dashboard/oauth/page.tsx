"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Shield, Plus, Copy, Check, Trash2, ArrowLeft, Key } from "lucide-react";

interface OAuthClient {
  client_id: string;
  client_type: "public" | "confidential";
  name: string;
  homepage_url: string | null;
  redirect_uris: string[];
  allowed_scopes: string[];
  created_at: string;
}

interface CreatedResult {
  client: OAuthClient;
  client_secret: string | null;
  note: string;
}

const ALL_SCOPES = ["openid", "profile", "verified_human", "email"] as const;

export default function OAuthClientsPage() {
  const [clients, setClients] = useState<OAuthClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [createdResult, setCreatedResult] = useState<CreatedResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [homepageUrl, setHomepageUrl] = useState("");
  const [redirectUrisRaw, setRedirectUrisRaw] = useState("");
  const [clientType, setClientType] = useState<"public" | "confidential">("public");
  const [scopes, setScopes] = useState<string[]>(["openid", "profile", "verified_human"]);

  const authHeader = useCallback((): HeadersInit => {
    const token = typeof window !== "undefined" ? localStorage.getItem("ha_token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/oauth-clients", { headers: authHeader() });
      if (res.status === 401) {
        window.location.href = "/dashboard";
        return;
      }
      const data = await res.json();
      setClients(data.clients || []);
    } catch {
      setError("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const onCreate = async () => {
    setError(null);
    setCreating(true);

    const redirect_uris = redirectUrisRaw
      .split(/\s*\n\s*|\s*,\s*/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (!name) {
      setError("Name is required");
      setCreating(false);
      return;
    }
    if (redirect_uris.length === 0) {
      setError("At least one redirect URI is required");
      setCreating(false);
      return;
    }

    try {
      const res = await fetch("/api/oauth-clients", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({
          name,
          homepage_url: homepageUrl || undefined,
          redirect_uris,
          client_type: clientType,
          allowed_scopes: scopes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create client");
        setCreating(false);
        return;
      }

      setCreatedResult(data);
      setShowNew(false);
      setName("");
      setHomepageUrl("");
      setRedirectUrisRaw("");
      setScopes(["openid", "profile", "verified_human"]);
      setClientType("public");
      fetchClients();
    } catch {
      setError("Network error");
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (clientId: string) => {
    if (!confirm(`Delete client ${clientId}? This cannot be undone.`)) return;
    const res = await fetch(`/api/oauth-clients/${clientId}`, {
      method: "DELETE",
      headers: authHeader(),
    });
    if (res.ok) {
      fetchClients();
    } else {
      setError("Failed to delete client");
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const toggleScope = (s: string) => {
    if (s === "openid") return; // openidは常に必須
    setScopes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f", color: "#ffffff" }}>
      <nav className="border-b" style={{ borderColor: "#2f323e" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm" style={{ color: "#a8b0bc" }}>
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" style={{ color: "#00d4aa" }} />
            <span className="font-semibold">Login with Humanary</span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">OAuth Clients</h1>
            <p className="mt-1 text-sm" style={{ color: "#a8b0bc" }}>
              Register apps that integrate &quot;Sign in with Humanary&quot;.
            </p>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
            style={{ background: "#00d4aa", color: "#0a0a0f" }}
          >
            <Plus className="h-4 w-4" /> New Client
          </button>
        </div>

        {error && (
          <p className="mb-4 text-sm" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}

        {createdResult && (
          <div
            className="mb-6 rounded-xl p-6"
            style={{ border: "1px solid #10b981", background: "rgba(16,185,129,0.08)" }}
          >
            <h3 className="mb-3 font-semibold" style={{ color: "#10b981" }}>
              Client Created
            </h3>
            <p className="mb-3 text-xs" style={{ color: "#a8b0bc" }}>
              {createdResult.note}
            </p>

            <div className="mb-3">
              <div className="mb-1 text-xs" style={{ color: "#7a8392" }}>
                client_id
              </div>
              <div className="flex items-center gap-2">
                <code
                  className="block flex-1 rounded-lg px-3 py-2 font-mono text-xs break-all"
                  style={{ background: "#0a0a0f" }}
                >
                  {createdResult.client.client_id}
                </code>
                <button
                  onClick={() => handleCopy(createdResult.client.client_id, "id")}
                  className="rounded-lg px-3 py-2 text-xs"
                  style={{ border: "1px solid #2f323e" }}
                >
                  {copied === "id" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>

            {createdResult.client_secret && (
              <div>
                <div className="mb-1 text-xs" style={{ color: "#7a8392" }}>
                  client_secret <span style={{ color: "#fbbf24" }}>(shown only once)</span>
                </div>
                <div className="flex items-center gap-2">
                  <code
                    className="block flex-1 rounded-lg px-3 py-2 font-mono text-xs break-all"
                    style={{ background: "#0a0a0f" }}
                  >
                    {createdResult.client_secret}
                  </code>
                  <button
                    onClick={() => handleCopy(createdResult.client_secret!, "secret")}
                    className="rounded-lg px-3 py-2 text-xs"
                    style={{ border: "1px solid #2f323e" }}
                  >
                    {copied === "secret" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setCreatedResult(null)}
              className="mt-4 text-xs"
              style={{ color: "#7a8392" }}
            >
              Dismiss
            </button>
          </div>
        )}

        {showNew && (
          <div className="mb-6 rounded-xl p-6" style={{ border: "1px solid #2f323e", background: "#12141a" }}>
            <h3 className="mb-4 font-semibold">New OAuth Client</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm" style={{ color: "#a8b0bc" }}>
                  Client name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ background: "#0a0a0f", border: "1px solid #2f323e", color: "#fff" }}
                  placeholder="My App"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm" style={{ color: "#a8b0bc" }}>
                  Homepage URL (optional)
                </label>
                <input
                  value={homepageUrl}
                  onChange={(e) => setHomepageUrl(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ background: "#0a0a0f", border: "1px solid #2f323e", color: "#fff" }}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm" style={{ color: "#a8b0bc" }}>
                  Redirect URIs (one per line, https only — localhost allowed)
                </label>
                <textarea
                  value={redirectUrisRaw}
                  onChange={(e) => setRedirectUrisRaw(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg px-3 py-2 font-mono text-xs"
                  style={{ background: "#0a0a0f", border: "1px solid #2f323e", color: "#fff" }}
                  placeholder="https://example.com/oauth/callback"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm" style={{ color: "#a8b0bc" }}>
                  Client type
                </label>
                <div className="flex gap-3">
                  {(["public", "confidential"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setClientType(t)}
                      className="rounded-lg px-3 py-2 text-xs"
                      style={{
                        border: "1px solid #2f323e",
                        background: clientType === t ? "#00d4aa" : "transparent",
                        color: clientType === t ? "#0a0a0f" : "#a8b0bc",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs" style={{ color: "#7a8392" }}>
                  Choose &quot;public&quot; for SPAs and mobile apps (PKCE only). &quot;confidential&quot; for
                  server-side apps that can keep a client_secret.
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm" style={{ color: "#a8b0bc" }}>
                  Allowed scopes
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SCOPES.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleScope(s)}
                      disabled={s === "openid"}
                      className="rounded-lg px-3 py-1.5 text-xs"
                      style={{
                        border: "1px solid #2f323e",
                        background: scopes.includes(s) ? "#00d4aa" : "transparent",
                        color: scopes.includes(s) ? "#0a0a0f" : "#a8b0bc",
                        opacity: s === "openid" ? 0.7 : 1,
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onCreate}
                  disabled={creating}
                  className="rounded-lg px-4 py-2 text-sm font-medium"
                  style={{ background: "#00d4aa", color: "#0a0a0f" }}
                >
                  {creating ? "Creating..." : "Create Client"}
                </button>
                <button
                  onClick={() => setShowNew(false)}
                  className="rounded-lg px-4 py-2 text-sm"
                  style={{ border: "1px solid #2f323e", color: "#a8b0bc" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {loading && <div style={{ color: "#7a8392" }}>Loading...</div>}
          {!loading &&
            clients.map((c) => (
              <div
                key={c.client_id}
                className="rounded-xl p-5"
                style={{ border: "1px solid #2f323e", background: "#12141a" }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4" style={{ color: "#00d4aa" }} />
                      <h3 className="font-semibold">{c.name}</h3>
                      <span
                        className="rounded px-2 py-0.5 text-xs"
                        style={{
                          background: c.client_type === "confidential" ? "#1a1c24" : "transparent",
                          border: "1px solid #2f323e",
                          color: "#a8b0bc",
                        }}
                      >
                        {c.client_type}
                      </span>
                    </div>
                    <code className="mt-1 block font-mono text-xs" style={{ color: "#7a8392" }}>
                      {c.client_id}
                    </code>
                    {c.homepage_url && (
                      <div className="mt-1 text-xs" style={{ color: "#7a8392" }}>
                        {c.homepage_url}
                      </div>
                    )}
                    <div className="mt-2 text-xs" style={{ color: "#a8b0bc" }}>
                      <span style={{ color: "#7a8392" }}>scopes:</span> {c.allowed_scopes.join(", ")}
                    </div>
                    <div className="mt-1 text-xs" style={{ color: "#a8b0bc" }}>
                      <span style={{ color: "#7a8392" }}>redirect_uris:</span>{" "}
                      {c.redirect_uris.join(", ")}
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(c.client_id)}
                    className="rounded-lg p-2"
                    style={{ border: "1px solid #2f323e", color: "#ef4444" }}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          {!loading && clients.length === 0 && (
            <div className="py-12 text-center" style={{ color: "#7a8392" }}>
              No OAuth clients yet. Create your first one above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
