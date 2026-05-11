"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AtSign, Key, LogOut, Shield } from "lucide-react";

/**
 * ランディングページ用ヘッダー。
 * `ha_token` の有無でサインイン状態を判定し、ナビゲーションを切り替える。
 * - 未サインイン: Features / Pricing / Docs / [Dashboard]CTA
 * - サインイン済: Dashboard / Account / Sign out
 *
 * SSRでは未サインイン版を出すため hydration mismatch は発生しない。
 * クライアント側で `ha_token` が見つかったらサインイン版に切り替える（一瞬のフラッシュは許容）。
 */
export default function LandingNav() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSignedIn(Boolean(window.localStorage.getItem("ha_token")));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/sso-logout", { method: "POST" });
    } catch {
      // SSO logoutが失敗してもダッシュボードJWTは確実に消す
    }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("ha_token");
    }
    setSignedIn(false);
  };

  return (
    <nav className="border-b border-[var(--border-color)] px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-[var(--accent)]" />
          <span className="text-lg font-bold">HumanAuth</span>
        </Link>

        {signedIn ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              aria-label="Dashboard"
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:border-[var(--border-hover)] sm:px-3"
            >
              <Key className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:border-[var(--border-hover)] sm:px-3"
            >
              <AtSign className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Account</span>
            </Link>
            <button
              onClick={handleLogout}
              aria-label="Sign out"
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:border-[var(--border-hover)] sm:px-3"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Docs
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black hover:bg-[var(--accent-hover)]"
            >
              Dashboard
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
