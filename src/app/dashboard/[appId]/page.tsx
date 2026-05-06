"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield, ArrowLeft, Key, Plus, Activity, Users,
  Copy, Check, Trash2, Clock, CheckCircle, XCircle,
} from "lucide-react";

interface AppDetail {
  id: string;
  name: string;
  rp_id: string;
  plan: string;
  mau_current_month: number;
  created_at: string;
  unique_users: number;
  recent_logs: VerificationLog[];
}

interface VerificationLog {
  id: string;
  nullifier_hash: string;
  action: string;
  success: boolean;
  created_at: string;
}

interface ApiKey {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

export default function AppDetailPage() {
  const { appId } = useParams<{ appId: string }>();
  const router = useRouter();
  const [app, setApp] = useState<AppDetail | null>(null);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "keys" | "logs">("overview");

  const token = typeof window !== "undefined" ? localStorage.getItem("ha_token") : null;

  const fetchApp = useCallback(async () => {
    if (!token) return;
    const res = await fetch(`/api/apps/${appId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setApp(await res.json());
    } else if (res.status === 401) {
      localStorage.removeItem("ha_token");
      router.push("/dashboard");
    }
    setLoading(false);
  }, [appId, token, router]);

  const fetchKeys = useCallback(async () => {
    if (!token) return;
    const res = await fetch(`/api/apps/${appId}/keys`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setKeys(await res.json());
  }, [appId, token]);

  useEffect(() => {
    fetchApp();
    fetchKeys();
  }, [fetchApp, fetchKeys]);

  const handleCreateKey = async () => {
    if (!token) return;
    const res = await fetch(`/api/apps/${appId}/keys`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name: `Key ${keys.length + 1}` }),
    });
    if (res.ok) {
      const data = await res.json();
      setNewKeyValue(data.api_key);
      fetchKeys();
    }
  };

  const handleCopy = () => {
    if (newKeyValue) {
      navigator.clipboard.writeText(newKeyValue);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setNewKeyValue(null);
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

  if (!app) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-[var(--text-tertiary)]">App not found</p>
          <Link href="/dashboard" className="text-[var(--accent)]">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-[var(--border-color)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[var(--accent)]" />
            <span className="text-lg font-bold">HumanAuth</span>
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        {/* App Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{app.name}</h1>
            <p className="mt-1 font-mono text-sm text-[var(--text-tertiary)]">{app.rp_id}</p>
          </div>
          <span className="rounded-full bg-[var(--accent-muted)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
            {app.plan}
          </span>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
            <div className="mb-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Users className="h-4 w-4" /> MAU (this month)
            </div>
            <div className="text-3xl font-bold">{app.mau_current_month || 0}</div>
          </div>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
            <div className="mb-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Users className="h-4 w-4" /> Unique Users (all time)
            </div>
            <div className="text-3xl font-bold">{app.unique_users}</div>
          </div>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
            <div className="mb-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Activity className="h-4 w-4" /> Recent Verifications
            </div>
            <div className="text-3xl font-bold">{app.recent_logs?.length || 0}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg bg-[var(--bg-secondary)] p-1">
          {(["overview", "keys", "logs"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                tab === t
                  ? "bg-[var(--bg-card)] text-[var(--text-primary)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {t === "overview" ? "Overview" : t === "keys" ? "API Keys" : "Verification Logs"}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
              <h3 className="mb-4 font-semibold">Quick Start</h3>
              <pre className="overflow-x-auto rounded-lg bg-[var(--bg-primary)] p-4 text-sm leading-relaxed">
                <code>{`// 1. Install
npm install humanauth-sdk/react @worldcoin/idkit

// 2. Use
import { HumanAuth } from "humanauth-sdk/react";

<HumanAuth
  appId="${app.rp_id}"
  apiKey="ha_YOUR_API_KEY"
  action="login"
  onVerified={(result) => {
    console.log(result.nullifier_hash);
    console.log(result.is_new_user);
  }}
/>`}</code>
              </pre>
            </div>

            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
              <h3 className="mb-4 font-semibold">App Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--text-secondary)]">App ID</dt>
                  <dd className="font-mono">{app.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--text-secondary)]">World ID RP</dt>
                  <dd className="font-mono">{app.rp_id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--text-secondary)]">Plan</dt>
                  <dd>{app.plan}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--text-secondary)]">Created</dt>
                  <dd>{new Date(app.created_at).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* API Keys Tab */}
        {tab === "keys" && (
          <div className="space-y-4">
            {newKeyValue && (
              <div className="rounded-xl border border-[var(--success)] bg-[rgba(16,185,129,0.1)] p-6">
                <h3 className="mb-2 font-semibold text-[var(--success)]">New API Key Created</h3>
                <p className="mb-3 text-sm text-[var(--text-secondary)]">
                  Copy this key now — it won&apos;t be shown again.
                </p>
                <code className="block break-all rounded-lg bg-[var(--bg-primary)] px-4 py-3 font-mono text-sm">
                  {newKeyValue}
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

            <div className="flex justify-end">
              <button
                onClick={handleCreateKey}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black hover:bg-[var(--accent-hover)]"
              >
                <Plus className="h-4 w-4" /> New Key
              </button>
            </div>

            {keys.length === 0 ? (
              <div className="py-12 text-center text-[var(--text-tertiary)]">
                No API keys. Create one to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {keys.map((k) => (
                  <div
                    key={k.id}
                    className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-[var(--text-tertiary)]" />
                        <span className="text-sm font-medium">{k.name || "API Key"}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${
                          k.is_active
                            ? "bg-[rgba(16,185,129,0.1)] text-[var(--success)]"
                            : "bg-[rgba(239,68,68,0.1)] text-[var(--error)]"
                        }`}>
                          {k.is_active ? "Active" : "Revoked"}
                        </span>
                      </div>
                      <div className="mt-1 flex gap-4 text-xs text-[var(--text-tertiary)]">
                        <span>Created {new Date(k.created_at).toLocaleDateString()}</span>
                        {k.last_used_at && (
                          <span>Last used {new Date(k.last_used_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Logs Tab */}
        {tab === "logs" && (
          <div>
            {!app.recent_logs?.length ? (
              <div className="py-12 text-center text-[var(--text-tertiary)]">
                No verification logs yet.
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-[var(--border-color)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                      <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">Action</th>
                      <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">Nullifier</th>
                      <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {app.recent_logs.map((log) => (
                      <tr key={log.id} className="border-b border-[var(--border-color)] last:border-b-0">
                        <td className="px-4 py-3">
                          {log.success ? (
                            <CheckCircle className="h-4 w-4 text-[var(--success)]" />
                          ) : (
                            <XCircle className="h-4 w-4 text-[var(--error)]" />
                          )}
                        </td>
                        <td className="px-4 py-3">{log.action}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[var(--text-tertiary)]">
                          {log.nullifier_hash?.slice(0, 10)}...{log.nullifier_hash?.slice(-8)}
                        </td>
                        <td className="px-4 py-3 text-[var(--text-tertiary)]">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
