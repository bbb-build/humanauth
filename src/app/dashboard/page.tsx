"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Shield, Plus, Key, Activity, Users, ChevronRight, LogOut, Copy, Check, Globe, Code } from "lucide-react";
import Link from "next/link";
import { useIDKitRequest, IDKitRequestWidget, orbLegacy } from "@worldcoin/idkit";
import type { IDKitResult, RpContext } from "@worldcoin/idkit-core";

interface App {
  id: string;
  name: string;
  rp_id: string;
  plan: string;
  mau_current_month: number;
  created_at: string;
  website_url: string | null;
  action_name: string | null;
}

interface Stats {
  total_apps: number;
  total_mau: number;
  total_verifications: number;
  apps: App[];
}

function LoginPanel() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [rpContext, setRpContext] = useState<RpContext | null>(null);

  useEffect(() => {
    fetch("/api/auth/rp-context", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setRpContext(d.rp_context))
      .catch(() => setLoginError("Failed to initialize. Please refresh."));
  }, []);

  const handleSuccess = async (result: IDKitResult) => {
    setLoginError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("ha_token", data.token);
      window.location.reload();
    } else {
      setLoginError("Verification failed. Please try again.");
    }
  };

  const idkit = useIDKitRequest({
    app_id: (process.env.NEXT_PUBLIC_WORLD_APP_ID || "app_") as `app_${string}`,
    action: "humanauth-dashboard-login",
    rp_context: rpContext || { rp_id: "", nonce: "", created_at: 0, expires_at: 0, signature: "" },
    allow_legacy_proofs: true,
    preset: orbLegacy(),
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md text-center">
        <Shield className="mx-auto mb-6 h-12 w-12 text-[var(--accent)]" />
        <h1 className="mb-4 text-2xl font-bold">HumanAuth Dashboard</h1>
        <p className="mb-8 text-[var(--text-secondary)]">
          Verify your humanity to access the dashboard.
        </p>
        {loginError && (
          <p className="mb-4 text-sm text-[var(--error)]">{loginError}</p>
        )}
        <button
          onClick={idkit.open}
          disabled={!rpContext}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-3 font-medium text-black hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          <Shield className="h-5 w-5" />
          {rpContext ? "Sign in with World ID" : "Loading..."}
        </button>
        <IDKitRequestWidget
          open={idkit.isOpen}
          onOpenChange={(open) => { if (!open) idkit.reset(); }}
          app_id={(process.env.NEXT_PUBLIC_WORLD_APP_ID || "app_") as `app_${string}`}
          action="humanauth-dashboard-login"
          rp_context={rpContext || { rp_id: "", nonce: "", created_at: 0, expires_at: 0, signature: "" }}
          allow_legacy_proofs={true}
          preset={orbLegacy()}
          onSuccess={handleSuccess}
        />
        <div className="mt-6">
          <Link href="/" className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [showNewApp, setShowNewApp] = useState(false);
  const [newApp, setNewApp] = useState({ name: "", website_url: "" });
  const [createdResult, setCreatedResult] = useState<{ api_key: string; embed_code: string; app_id: string } | null>(null);
  const [copied, setCopied] = useState<"embed" | "key" | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("ha_token"));
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    const res = await fetch("/api/dashboard/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setStats(await res.json());
    } else if (res.status === 401) {
      localStorage.removeItem("ha_token");
      setToken(null);
    }
  }, [token]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleLogout = () => {
    localStorage.removeItem("ha_token");
    setToken(null);
    setStats(null);
  };

  const handleCreateApp = async () => {
    if (!token || !newApp.name || !newApp.website_url) return;
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch("/api/apps", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(newApp),
      });
      if (res.ok) {
        const data = await res.json();
        setCreatedResult({ api_key: data.api_key, embed_code: data.embed_code, app_id: data.app.id });
        setShowNewApp(false);
        setNewApp({ name: "", website_url: "" });
        fetchStats();
      } else {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setCreateError(err.error || "Failed to create app");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = (text: string, type: "embed" | "key") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-[var(--text-tertiary)]">Loading...</div>
      </div>
    );
  }

  if (!token) {
    return <LoginPanel />;
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-[var(--border-color)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[var(--accent)]" />
            <span className="text-lg font-bold">HumanAuth</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--text-tertiary)]">Dashboard</span>
            <Link
              href="/dashboard/oauth"
              className="rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
            >
              OAuth Clients
            </Link>
            <Link
              href="/account"
              className="rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
            >
              Account
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
            >
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            { label: "Total Apps", value: stats?.total_apps ?? "—", icon: Key },
            { label: "Monthly Active Users", value: stats?.total_mau ?? "—", icon: Users },
            { label: "Verifications (this month)", value: stats?.total_verifications ?? "—", icon: Activity },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
              <div className="mb-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <s.icon className="h-4 w-4" /> {s.label}
              </div>
              <div className="text-3xl font-bold">{s.value}</div>
            </div>
          ))}
        </div>

        {createdResult && (
          <div className="mb-8 rounded-xl border border-[var(--success)] bg-[rgba(16,185,129,0.1)] p-6">
            <h3 className="mb-4 font-semibold text-[var(--success)]">App Created — Add to Your Website</h3>

            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Code className="h-4 w-4" /> Embed Code
              </div>
              <pre className="rounded-lg bg-[var(--bg-primary)] px-4 py-3 font-mono text-sm break-all whitespace-pre-wrap">
                {createdResult.embed_code}
              </pre>
              <button
                onClick={() => handleCopy(createdResult.embed_code, "embed")}
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black"
              >
                {copied === "embed" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "embed" ? "Copied!" : "Copy Embed Code"}
              </button>
            </div>

            <div className="border-t border-[var(--border-color)] pt-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Key className="h-4 w-4" /> API Key (for server-side use)
              </div>
              <p className="mb-2 text-xs text-[var(--text-tertiary)]">
                Copy this key now — it won&apos;t be shown again.
              </p>
              <code className="block rounded-lg bg-[var(--bg-primary)] px-4 py-3 font-mono text-xs break-all">
                {createdResult.api_key}
              </code>
              <button
                onClick={() => handleCopy(createdResult.api_key, "key")}
                className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs"
              >
                {copied === "key" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied === "key" ? "Copied!" : "Copy API Key"}
              </button>
            </div>

            <button
              onClick={() => setCreatedResult(null)}
              className="mt-4 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Apps</h2>
          <button
            onClick={() => setShowNewApp(true)}
            className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black hover:bg-[var(--accent-hover)]"
          >
            <Plus className="h-4 w-4" /> New App
          </button>
        </div>

        {showNewApp && (
          <div className="mb-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
            <h3 className="mb-2 font-semibold">Add Your Website</h3>
            <p className="mb-4 text-sm text-[var(--text-tertiary)]">
              We handle all the World ID setup automatically. Just tell us your app name and website.
            </p>
            {createError && (
              <p className="mb-4 text-sm text-[var(--error)]">{createError}</p>
            )}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-[var(--text-secondary)]">App Name</label>
                <input
                  value={newApp.name}
                  onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                  placeholder="My App"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[var(--text-secondary)]">Website URL</label>
                <input
                  value={newApp.website_url}
                  onChange={(e) => setNewApp({ ...newApp, website_url: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateApp}
                  disabled={!newApp.name || !newApp.website_url || creating}
                  className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black hover:bg-[var(--accent-hover)] disabled:opacity-50"
                >
                  {creating ? "Setting up World ID..." : "Create App"}
                </button>
                <button
                  onClick={() => setShowNewApp(false)}
                  className="rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {stats?.apps?.map((app) => (
            <Link
              key={app.id}
              href={`/dashboard/${app.id}`}
              className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 transition hover:border-[var(--border-hover)]"
            >
              <div>
                <h3 className="font-semibold">{app.name}</h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  {app.website_url || app.rp_id} · {app.plan} · {app.mau_current_month || 0} MAU
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-[var(--text-tertiary)]" />
            </Link>
          ))}
          {stats?.apps?.length === 0 && (
            <div className="py-12 text-center text-[var(--text-tertiary)]">
              No apps yet. Create your first one above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
