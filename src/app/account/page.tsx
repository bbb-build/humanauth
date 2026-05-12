"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, AtSign, Check, Loader2, LogOut, Save, ShieldCheck, Trash2, AlertTriangle } from "lucide-react";

interface UserProfile {
  id: string;
  handle: string;
  handle_is_custom: boolean;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  email_verified: boolean | null;
  verification_level: string | null;
  created_at: string;
}

const HANDLE_HINT = "3–30文字の英数字またはアンダースコア（_）";

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMissing, setAuthMissing] = useState(false);

  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [savingHandle, setSavingHandle] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [handleMsg, setHandleMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [profileMsg, setProfileMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const authHeader = useCallback((): HeadersInit => {
    const token = typeof window !== "undefined" ? localStorage.getItem("ha_token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const fetchMe = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("ha_token") : null;
    if (!token) {
      setAuthMissing(true);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/users/me", { headers: authHeader() });
      if (res.status === 401) {
        setAuthMissing(true);
        return;
      }
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setHandle(data.user.handle);
        setDisplayName(data.user.display_name ?? "");
        setAvatarUrl(data.user.avatar_url ?? "");
      }
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  async function onSaveHandle() {
    if (!user) return;
    setSavingHandle(true);
    setHandleMsg(null);
    try {
      const res = await fetch("/api/users/me/handle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ handle }),
      });
      const data = await res.json();
      if (!res.ok) {
        setHandleMsg({ tone: "err", text: data.error ?? "Failed to update handle" });
        return;
      }
      setUser(data.user);
      setHandle(data.user.handle);
      setHandleMsg({ tone: "ok", text: data.unchanged ? "No changes" : "Handle updated" });
    } catch (e) {
      setHandleMsg({ tone: "err", text: String(e) });
    } finally {
      setSavingHandle(false);
    }
  }

  async function onSignOut() {
    try {
      await fetch("/api/auth/sso-logout", { method: "POST" });
    } catch {
      // SSOクッキー破棄に失敗してもJWTは確実に消す
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("ha_token");
      window.location.href = "/dashboard";
    }
  }

  async function onDeleteAccount() {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    setDeleteMsg(null);
    try {
      const res = await fetch("/api/users/me", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ confirmation: "DELETE" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteMsg({ tone: "err", text: data.error ?? "Failed to delete account" });
        return;
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("ha_token");
        window.location.href = "/";
      }
    } catch (e) {
      setDeleteMsg({ tone: "err", text: String(e) });
    } finally {
      setDeleting(false);
    }
  }

  async function onSaveProfile() {
    if (!user) return;
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const body: Record<string, string | null> = {
        display_name: displayName.trim() === "" ? null : displayName,
        avatar_url: avatarUrl.trim() === "" ? null : avatarUrl,
      };
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileMsg({ tone: "err", text: data.error ?? "Failed to update profile" });
        return;
      }
      setUser(data.user);
      setDisplayName(data.user.display_name ?? "");
      setAvatarUrl(data.user.avatar_url ?? "");
      setProfileMsg({ tone: "ok", text: "Profile updated" });
    } catch (e) {
      setProfileMsg({ tone: "err", text: String(e) });
    } finally {
      setSavingProfile(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--text-tertiary)]" />
      </main>
    );
  }

  if (authMissing || !user) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="mb-4 text-2xl font-bold">Account</h1>
        <p className="mb-6 text-[var(--text-secondary)]">
          サインインが必要です。ダッシュボードでWorld ID認証してください。
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-black hover:bg-[var(--accent-hover)]"
        >
          <ShieldCheck className="h-4 w-4" />
          Go to Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between gap-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <button
          onClick={onSignOut}
          aria-label="Sign out"
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>

      <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold">
        <AtSign className="h-6 w-6 text-[var(--accent)]" />
        Account
      </h1>
      <p className="mb-8 text-sm text-[var(--text-tertiary)]">
        ハンドル（@xxx）はOIDCの <code>preferred_username</code> として連携先RPに渡されます。
      </p>

      {/* Handle section */}
      <section className="mb-10 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <h2 className="mb-1 text-lg font-semibold">Handle</h2>
        <p className="mb-4 text-xs text-[var(--text-tertiary)]">
          {user.handle_is_custom
            ? "現在カスタムハンドルを設定中です。再変更も可能です。"
            : "自動生成のハンドルが設定されています。任意の名前に変更できます。"}
        </p>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[var(--text-tertiary)]">@</span>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="your_handle"
            spellCheck={false}
            autoCapitalize="off"
            className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-base focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
        <p className="mb-4 text-xs text-[var(--text-tertiary)]">{HANDLE_HINT}</p>

        {handleMsg && (
          <p
            className={`mb-3 text-sm ${
              handleMsg.tone === "ok" ? "text-[var(--success)]" : "text-[var(--error)]"
            }`}
          >
            {handleMsg.text}
          </p>
        )}

        <button
          onClick={onSaveHandle}
          disabled={savingHandle || handle === user.handle}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {savingHandle ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Save handle
        </button>
      </section>

      {/* Profile section */}
      <section className="mb-10 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <h2 className="mb-4 text-lg font-semibold">Profile</h2>

        <label className="mb-1 block text-xs text-[var(--text-tertiary)]">Display name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={80}
          placeholder="(optional)"
          className="mb-4 w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-base focus:border-[var(--accent)] focus:outline-none"
        />

        <label className="mb-1 block text-xs text-[var(--text-tertiary)]">Avatar URL (https only)</label>
        <input
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          maxLength={500}
          placeholder="https://…"
          className="mb-4 w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-base focus:border-[var(--accent)] focus:outline-none"
        />

        {profileMsg && (
          <p
            className={`mb-3 text-sm ${
              profileMsg.tone === "ok" ? "text-[var(--success)]" : "text-[var(--error)]"
            }`}
          >
            {profileMsg.text}
          </p>
        )}

        <button
          onClick={onSaveProfile}
          disabled={savingProfile}
          className="inline-flex items-center gap-2 rounded-md border border-[var(--border-color)] px-4 py-2 text-sm font-medium hover:border-[var(--border-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save profile
        </button>
      </section>

      {/* Read-only info */}
      <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <h2 className="mb-4 text-lg font-semibold">Identity</h2>
        <dl className="space-y-3 text-sm">
          <Row label="Verification level" value={user.verification_level ?? "—"} />
          <Row label="Email" value={user.email ?? "—"} />
          <Row
            label="Email verified"
            value={user.email_verified === null ? "—" : user.email_verified ? "Yes" : "No"}
          />
          <Row label="User ID" value={user.id} mono />
          <Row label="Created" value={new Date(user.created_at).toLocaleString()} />
        </dl>
      </section>

      {/* Danger zone: account deletion */}
      <section className="mt-10 rounded-xl border border-[var(--error)]/40 bg-[var(--bg-card)] p-6">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-[var(--error)]">
          <AlertTriangle className="h-5 w-5" />
          Delete account
        </h2>
        <p className="mb-4 text-sm text-[var(--text-secondary)]">
          アカウントを完全に削除します。以下のデータが <strong>全て即時消去</strong> されます:
        </p>
        <ul className="mb-4 list-disc space-y-1 pl-6 text-sm text-[var(--text-secondary)]">
          <li>プロフィール (ハンドル / 表示名 / メール)</li>
          <li>SSO セッションと OAuth トークン</li>
          <li>連携先アプリへの同意記録</li>
          <li>データアクセス履歴 (どの RP に何の claim を渡したか)</li>
          <li>Vault 保存データ (humad.* / profile.* / external.* 等)</li>
        </ul>
        <p className="mb-4 text-xs text-[var(--text-tertiary)]">
          OAuth クライアントを所有している場合は、所有者なし状態で残ります (利用中の RP を巻き添えにしないため)。<br />
          再度 World ID で認証すれば新しいアカウントが作成されますが、旧アカウントのハンドル / 履歴は復元できません。
        </p>

        <label className="mb-1 block text-xs text-[var(--text-tertiary)]">
          確認のため <code className="text-[var(--error)]">DELETE</code> と入力してください
        </label>
        <input
          type="text"
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          placeholder="DELETE"
          className="mb-4 w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-base focus:border-[var(--error)] focus:outline-none"
        />

        {deleteMsg && (
          <p
            className={`mb-3 text-sm ${
              deleteMsg.tone === "ok" ? "text-[var(--success)]" : "text-[var(--error)]"
            }`}
          >
            {deleteMsg.text}
          </p>
        )}

        <button
          onClick={onDeleteAccount}
          disabled={deleting || deleteConfirm !== "DELETE"}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--error)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Delete my account permanently
        </button>
      </section>
    </main>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 text-[var(--text-tertiary)]">{label}</dt>
      <dd className={`text-right ${mono ? "font-mono text-xs" : ""} text-[var(--text-secondary)]`}>
        {value}
      </dd>
    </div>
  );
}
