import { Shield } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-[var(--border-color)] px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--accent)]" />
            <span className="font-bold">HumanAuth</span>
          </Link>
          <span className="text-[var(--text-tertiary)]">/</span>
          <span className="text-[var(--text-secondary)]">Docs</span>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-bold">Documentation</h1>

        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-[var(--accent)]">Quick Start</h2>

          <div className="space-y-8">
            <div>
              <h3 className="mb-3 text-lg font-semibold">1. Create an app</h3>
              <p className="mb-4 text-[var(--text-secondary)]">
                Sign up at the <Link href="/dashboard" className="text-[var(--accent)] hover:underline">dashboard</Link>,
                register your World ID app (you&apos;ll need your RP ID and signing key from the{" "}
                <span className="text-[var(--text-primary)]">World ID Developer Portal</span>).
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">2. Install the SDK</h3>
              <pre className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-sm">
                <code>npm install @humanauth/react</code>
              </pre>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">3. Add the component</h3>
              <pre className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-sm leading-relaxed">
                <code>{`import { HumanAuth } from "@humanauth/react";

function LoginButton() {
  return (
    <HumanAuth
      appId="your-app-id"
      apiKey="ha_xxxxx"
      action="login"
      onVerified={(result) => {
        // result.nullifier_hash — unique user ID
        // result.is_new_user — first time?
      }}
      onError={(error) => console.error(error)}
    />
  );
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-[var(--accent)]">API Reference</h2>

          <div className="space-y-8">
            {/* Verify */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded bg-[var(--success)] px-2 py-0.5 text-xs font-bold text-black">POST</span>
                <code className="text-sm">/api/verify</code>
              </div>
              <p className="mb-4 text-sm text-[var(--text-secondary)]">
                Verify a World ID proof. Handles Cloud API verification, nullifier dedup, and MAU tracking.
              </p>
              <h4 className="mb-2 text-sm font-semibold">Headers</h4>
              <pre className="mb-4 rounded-lg bg-[var(--bg-primary)] p-3 text-xs">
                <code>{`x-humanauth-key: ha_your_api_key`}</code>
              </pre>
              <h4 className="mb-2 text-sm font-semibold">Request Body</h4>
              <pre className="mb-4 rounded-lg bg-[var(--bg-primary)] p-3 text-xs leading-relaxed">
                <code>{`{
  "proof": "0x...",
  "merkle_root": "0x...",
  "nullifier_hash": "0x...",
  "action": "login",
  "verification_level": "orb"  // optional
}`}</code>
              </pre>
              <h4 className="mb-2 text-sm font-semibold">Response</h4>
              <pre className="rounded-lg bg-[var(--bg-primary)] p-3 text-xs leading-relaxed">
                <code>{`{
  "success": true,
  "nullifier_hash": "0x...",
  "is_new_user": true,
  "action": "login"
}`}</code>
              </pre>
            </div>

            {/* RP Context */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded bg-[var(--accent)] px-2 py-0.5 text-xs font-bold text-black">POST</span>
                <code className="text-sm">/api/rp-context</code>
              </div>
              <p className="mb-4 text-sm text-[var(--text-secondary)]">
                Generate a signed RP context for World ID 4.0 verification. Required for IDKit v4.
              </p>
              <h4 className="mb-2 text-sm font-semibold">Request Body</h4>
              <pre className="mb-4 rounded-lg bg-[var(--bg-primary)] p-3 text-xs">
                <code>{`{ "action": "login" }  // optional, defaults to "humanauth-verify"`}</code>
              </pre>
              <h4 className="mb-2 text-sm font-semibold">Response</h4>
              <pre className="rounded-lg bg-[var(--bg-primary)] p-3 text-xs leading-relaxed">
                <code>{`{
  "rp_context": {
    "rp_id": "app_xxx",
    "nonce": "...",
    "created_at": 1234567890,
    "expires_at": 1234567890,
    "signature": "0x..."
  }
}`}</code>
              </pre>
            </div>

            {/* Apps */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded bg-[var(--warning)] px-2 py-0.5 text-xs font-bold text-black">CRUD</span>
                <code className="text-sm">/api/apps</code>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                App management endpoints. Requires dashboard JWT authentication.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-[var(--text-tertiary)]">
                <li><code>GET /api/apps</code> — List your apps</li>
                <li><code>POST /api/apps</code> — Register a new app</li>
                <li><code>GET /api/apps/:id</code> — App details + recent logs</li>
                <li><code>GET /api/apps/:id/keys</code> — List API keys</li>
                <li><code>POST /api/apps/:id/keys</code> — Create new API key</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Concepts */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-[var(--accent)]">Concepts</h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Nullifier Hash</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                A unique, anonymous identifier for each World ID user per action. The same person verifying
                &quot;login&quot; and &quot;vote&quot; produces different nullifiers — privacy by design. HumanAuth
                stores and deduplicates these automatically.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">RP Signing (World ID 4.0)</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                World ID 4.0 requires all verification requests to be signed by the Relying Party.
                HumanAuth manages your signing keys (encrypted at rest with AES-256-GCM) and generates
                signed RP contexts on demand.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">MAU Tracking</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Monthly Active Users are counted by unique nullifier per calendar month.
                Your dashboard shows real-time MAU counts and historical trends.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
