"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Shield, Plus, Key, Activity, Users, ChevronRight, LogOut, Copy, Check } from "lucide-react";
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
  const [newApp, setNewApp] = useState({ name: "", rp_id: "", signing_key: "" });
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
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
    if (!token || !newApp.name || !newApp.rp_id || !newApp.signing_key) return;
    const res = await fetch("/api/apps", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(newApp),
    });
    if (res.ok) {
      const data = await res.json();
      setCreatedKey(data.api_key);
      setShowNewApp(false);
      setNewApp({ name: "", rp_id: "", signing_key: "" });
      fetchStats();
    }
  };

  const handleCopy = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setCreatedKey(null);
      }, 2000);
    }
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

        {createdKey && (
          <div className="mb-8 rounded-xl border border-[var(--success)] bg-[rgba(16,185,129,0.1)] p-6">
            <h3 className="mb-2 font-semibold text-[var(--success)]">API Key Created</h3>
            <p className="mb-3 text-sm text-[var(--text-secondary)]">
              Copy this key now — it won&apos;t be shown again.
            </p>
            <code className="block rounded-lg bg-[var(--bg-primary)] px-4 py-3 font-mono text-sm break-all">
              {createdKey}
            </code>
            <button
              onClick={handleCopy}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy & Dismiss"}
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
            <h3 className="mb-4 font-semibold">Register New App</h3>
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
                <label className="mb-1 block text-sm text-[var(--text-secondary)]">World ID App ID</label>
                <input
                  value={newApp.rp_id}
                  onChange={(e) => setNewApp({ ...newApp, rp_id: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2 font-mono text-sm"
                  placeholder="app_xxxxxxxxxxxx"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[var(--text-secondary)]">Signing Key (hex)</label>
                <input
                  value={newApp.signing_key}
                  onChange={(e) => setNewApp({ ...newApp, signing_key: e.target.value })}
                  type="password"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2 font-mono text-sm"
                  placeholder="0x..."
                />
                <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                  From your World ID Developer Portal. Encrypted at rest with AES-256-GCM.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateApp}
                  className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black"
                >
                  Create App
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
                  {app.rp_id} · {app.plan} · {app.mau_current_month || 0} MAU
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
