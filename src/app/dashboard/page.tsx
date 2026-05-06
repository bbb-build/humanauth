"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, Plus, Key, Activity, Users, ChevronRight } from "lucide-react";
import Link from "next/link";

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

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [showNewApp, setShowNewApp] = useState(false);
  const [newApp, setNewApp] = useState({ name: "", rp_id: "", signing_key: "" });
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [token] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("ha_token");
    return null;
  });

  const fetchStats = useCallback(async () => {
    if (!token) return;
    const res = await fetch("/api/dashboard/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setStats(await res.json());
  }, [token]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

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

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md text-center">
          <Shield className="mx-auto mb-6 h-12 w-12 text-[var(--accent)]" />
          <h1 className="mb-4 text-2xl font-bold">HumanAuth Dashboard</h1>
          <p className="mb-8 text-[var(--text-secondary)]">
            Dashboard authentication coming soon. For now, use the API directly.
          </p>
          <Link href="/" className="text-[var(--accent)] hover:underline">← Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="border-b border-[var(--border-color)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[var(--accent)]" />
            <span className="text-lg font-bold">HumanAuth</span>
          </Link>
          <span className="text-sm text-[var(--text-tertiary)]">Dashboard</span>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Stats */}
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

        {/* API Key Created Banner */}
        {createdKey && (
          <div className="mb-8 rounded-xl border border-[var(--success)] bg-[rgba(16,185,129,0.1)] p-6">
            <h3 className="mb-2 font-semibold text-[var(--success)]">API Key Created</h3>
            <p className="mb-3 text-sm text-[var(--text-secondary)]">Copy this key now — it won&apos;t be shown again.</p>
            <code className="block rounded-lg bg-[var(--bg-primary)] px-4 py-3 text-sm font-mono break-all">
              {createdKey}
            </code>
            <button
              onClick={() => { navigator.clipboard.writeText(createdKey); setCreatedKey(null); }}
              className="mt-4 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black"
            >
              Copy & Dismiss
            </button>
          </div>
        )}

        {/* Apps */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Apps</h2>
          <button
            onClick={() => setShowNewApp(true)}
            className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black hover:bg-[var(--accent-hover)]"
          >
            <Plus className="h-4 w-4" /> New App
          </button>
        </div>

        {/* New App Form */}
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
                <label className="mb-1 block text-sm text-[var(--text-secondary)]">World ID RP ID</label>
                <input
                  value={newApp.rp_id}
                  onChange={(e) => setNewApp({ ...newApp, rp_id: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2 text-sm font-mono"
                  placeholder="app_xxxxxxxxxxxx"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[var(--text-secondary)]">Signing Key (hex)</label>
                <input
                  value={newApp.signing_key}
                  onChange={(e) => setNewApp({ ...newApp, signing_key: e.target.value })}
                  type="password"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2 text-sm font-mono"
                  placeholder="0x..."
                />
                <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                  From your World ID Developer Portal. Encrypted at rest.
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

        {/* App List */}
        <div className="space-y-3">
          {stats?.apps?.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 transition hover:border-[var(--border-hover)]"
            >
              <div>
                <h3 className="font-semibold">{app.name}</h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  {app.rp_id} · {app.plan} plan · {app.mau_current_month || 0} MAU
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-[var(--text-tertiary)]" />
            </div>
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
