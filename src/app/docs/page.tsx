import { Shield } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-[var(--border-color)] px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--accent)]" />
            <span className="font-bold">Humad</span>
          </Link>
          <span className="text-[var(--text-tertiary)]">/</span>
          <span className="text-[var(--text-secondary)]">Docs</span>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-3 text-4xl font-bold">Documentation</h1>
        <p className="mb-10 text-[var(--text-secondary)]">
          Humad is a World ID–powered identity layer for any web app. Two products live here:
          <strong className="ml-1 text-[var(--text-primary)]">Login with Humad (OIDC)</strong> for full sign-in
          flows, and a <strong className="text-[var(--text-primary)]">Verify API</strong> for one-shot human-verification checks.
          Pick the section that matches what you&apos;re building.
        </p>

        {/* Table of contents */}
        <nav className="mb-12 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 text-sm">
          <h2 className="mb-3 font-semibold">On this page</h2>
          <ul className="grid grid-cols-1 gap-1 md:grid-cols-2">
            <li><a className="text-[var(--accent)] hover:underline" href="#quick-start">Quick start</a></li>
            <li><a className="text-[var(--accent)] hover:underline" href="#login-with-humad">Login with Humad (OIDC)</a></li>
            <li><a className="text-[var(--accent)] hover:underline" href="#silent-refresh">Silent refresh</a></li>
            <li><a className="text-[var(--accent)] hover:underline" href="#logout">Logout (RP-Initiated)</a></li>
            <li><a className="text-[var(--accent)] hover:underline" href="#verify-api">Verify API</a></li>
            <li><a className="text-[var(--accent)] hover:underline" href="#apps-api">Apps API</a></li>
            <li><a className="text-[var(--accent)] hover:underline" href="#discovery">OIDC discovery</a></li>
            <li><a className="text-[var(--accent)] hover:underline" href="#concepts">Concepts</a></li>
            <li><a className="text-[var(--accent)] hover:underline" href="#ops">Operational notes</a></li>
          </ul>
        </nav>

        {/* Quick Start */}
        <section id="quick-start" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold text-[var(--accent)]">Quick start</h2>

          <div className="mb-8 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
            <h3 className="mb-3 text-lg font-semibold">A. Login with Humad (recommended for SaaS / web apps)</h3>
            <p className="mb-4 text-sm text-[var(--text-secondary)]">
              Adds a <strong>&quot;Sign in&quot;</strong> button to your app. Users authenticate with World ID,
              you get a stable <code>sub</code>, handle, and verified-human status. Standards-compliant OAuth 2.1 / OIDC.
            </p>
            <ol className="mb-4 space-y-2 text-sm text-[var(--text-secondary)]">
              <li>1. Register an OAuth client in the <Link href="/dashboard/oauth" className="text-[var(--accent)] hover:underline">dashboard</Link> to get <code>client_id</code> and <code>client_secret</code>.</li>
              <li>2. <code>npm install humad-sdk</code></li>
              <li>3. Wire up <code>signIn()</code> and <code>handleCallback()</code> (see <a className="text-[var(--accent)] hover:underline" href="#login-with-humad">below</a>).</li>
            </ol>
            <p className="text-xs text-[var(--text-tertiary)]">
              Live demo: <a className="text-[var(--accent)] hover:underline" href="https://humad-demo.vercel.app" target="_blank" rel="noreferrer">humad-demo.vercel.app</a>
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
            <h3 className="mb-3 text-lg font-semibold">B. Verify API (one-shot human check)</h3>
            <p className="mb-4 text-sm text-[var(--text-secondary)]">
              Replace CAPTCHA. No session, no users — just &quot;is this a human?&quot; with a managed nullifier dedup store.
            </p>
            <pre className="mb-2 overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-sm">
              <code>npm install humad-sdk @worldcoin/idkit</code>
            </pre>
            <pre className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-sm leading-relaxed">
              <code>{`import { HumanAuth } from "humad-sdk/react";

function VerifyButton() {
  return (
    <HumanAuth
      appId="app_your_world_id"
      apiKey="ha_your_key"
      action="login"
      onVerified={(r) => console.log(r.nullifier_hash, r.is_new_user)}
      onError={(e) => console.error(e)}
    />
  );
}`}</code>
            </pre>
            <p className="mt-2 text-xs text-[var(--text-tertiary)]">
              The React component is still exported as <code>HumanAuth</code> for v0.2.x compatibility; it will be renamed to <code>Humad</code> in v1.0.
            </p>
          </div>
        </section>

        {/* Login with Humad */}
        <section id="login-with-humad" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold text-[var(--accent)]">Login with Humad (OIDC)</h2>

          <p className="mb-6 text-sm text-[var(--text-secondary)]">
            Standards-compliant OAuth 2.1 + OpenID Connect. PKCE-required for public clients,{" "}
            <code>client_secret_post</code> / <code>client_secret_basic</code> for confidential clients, RS256-signed id_tokens,
            refresh token rotation, RP-Initiated Logout.
          </p>

          <h3 className="mb-3 text-lg font-semibold">1. Register an OAuth client</h3>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            Go to <Link href="/dashboard/oauth" className="text-[var(--accent)] hover:underline">/dashboard/oauth</Link> and create a client.
            You&apos;ll need at minimum a name and one <code>redirect_uri</code>. For SPAs, also set <code>post_logout_redirect_uris</code>.
          </p>
          <ul className="mb-6 ml-5 list-disc space-y-1 text-sm text-[var(--text-secondary)]">
            <li><strong>Public client (SPA / mobile):</strong> no <code>client_secret</code>; PKCE is enforced.</li>
            <li><strong>Confidential client (server-side):</strong> store <code>client_secret</code> in your backend; PKCE still recommended.</li>
            <li><strong>Scopes:</strong> <code>openid</code> (required), <code>profile</code>, <code>verified_human</code>, <code>email</code>, <code>offline_access</code> (for refresh tokens).</li>
          </ul>

          <h3 className="mb-3 text-lg font-semibold">2. Browser flow</h3>
          <pre className="mb-6 overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-sm leading-relaxed">
            <code>{`import { signIn, handleCallback, getUser } from "humad-sdk";

// On your "Login with Humad" button:
await signIn({
  clientId: "ha_oauth_xxxxxxxx",
  redirectUri: "https://yourapp.com/oauth/callback",
  scopes: ["openid", "profile", "verified_human"],
});

// On /oauth/callback:
const { tokens } = await handleCallback({ clientId: "ha_oauth_xxxxxxxx" });
const user = await getUser(tokens);

// user.sub                  — stable, pairwise user id (string)
// user.handle               — Humad handle (e.g. "alice")
// user.verified_human       — boolean
// user.verification_level   — "orb" | "device" | "phone"`}</code>
          </pre>

          <h3 className="mb-3 text-lg font-semibold">3. Server flow (confidential client)</h3>
          <pre className="mb-6 overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-sm leading-relaxed">
            <code>{`import { exchangeCodeForTokens, getUserInfo } from "humad-sdk";

// In your /oauth/callback route handler:
const tokens = await exchangeCodeForTokens({
  clientId: process.env.HUMAD_CLIENT_ID!,
  clientSecret: process.env.HUMAD_CLIENT_SECRET!,
  code,
  codeVerifier,
  redirectUri,
});

const user = await getUserInfo({ accessToken: tokens.accessToken });`}</code>
          </pre>
        </section>

        {/* Silent Refresh */}
        <section id="silent-refresh" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold text-[var(--accent)]">Silent refresh</h2>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            Access tokens expire in 15 minutes. Pick the helper that matches your security posture.
          </p>

          <h3 className="mb-3 text-lg font-semibold">(a) Background timer — if you can store the refresh_token</h3>
          <pre className="mb-6 overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-sm leading-relaxed">
            <code>{`import { startAutoRefresh } from "humad-sdk";

const controller = startAutoRefresh({
  clientId: "ha_oauth_xxxxxxxx",
  initialTokens: tokens,
  onUpdate: (next) => setTokens(next),   // persist the rotated tokens
  onError: (err) => console.warn(err),   // refresh failed — fall back to signIn()
  refreshLeewaySec: 60,                  // renew 60s before exp
});

// later (sign out / unmount):
controller.stop();`}</code>
          </pre>

          <h3 className="mb-3 text-lg font-semibold">(b) iframe + prompt=none — if you can&apos;t safely hold a refresh_token</h3>
          <pre className="mb-3 overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-sm leading-relaxed">
            <code>{`import { silentRenew, handleSilentCallback } from "humad-sdk";

try {
  const { tokens: next } = await silentRenew({
    clientId: "ha_oauth_xxxxxxxx",
    redirectUri: "https://yourapp.com/oauth/callback",
  });
  setTokens(next);
} catch (err) {
  // SSO expired or interaction required — fall back to signIn()
}

// On /oauth/callback, handle BOTH normal and silent iframe results:
const wasSilent = await handleSilentCallback({ clientId });
if (!wasSilent) {
  const { tokens } = await handleCallback({ clientId });
  // ... normal post-login flow
}`}</code>
          </pre>
          <p className="text-xs text-[var(--text-tertiary)]">
            Silent renew relies on the Humad SSO cookie. If the user has been inactive long enough for the SSO session to expire,
            the iframe will time out and you must initiate a regular <code>signIn()</code>.
          </p>
        </section>

        {/* Logout */}
        <section id="logout" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold text-[var(--accent)]">Logout</h2>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            Two flavors, depending on whether you want to keep the Humad SSO session alive across other RPs.
          </p>

          <h3 className="mb-3 text-lg font-semibold">(a) Quiet token revocation — default</h3>
          <p className="mb-3 text-sm text-[var(--text-secondary)]">
            Invalidates the user&apos;s tokens for <em>your</em> app. The Humad SSO session continues, so the user stays signed in to other RPs.
          </p>
          <pre className="mb-6 overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-sm leading-relaxed">
            <code>{`import { signOut } from "humad-sdk";

await signOut({
  token: tokens.refreshToken!,
  tokenTypeHint: "refresh_token",
  clientId: "ha_oauth_xxxxxxxx",
});`}</code>
          </pre>

          <h3 className="mb-3 text-lg font-semibold">(b) RP-Initiated Logout — end the SSO session</h3>
          <p className="mb-3 text-sm text-[var(--text-secondary)]">
            Ends the user&apos;s Humad SSO session and redirects back to your post-logout page. Use this for a real
            &quot;sign out everywhere&quot; UX. Requires <code>post_logout_redirect_uri</code> to be pre-registered on the client.
          </p>
          <pre className="mb-3 overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-sm leading-relaxed">
            <code>{`await signOut({
  mode: "navigate",
  clientId: "ha_oauth_xxxxxxxx",
  idTokenHint: tokens.idToken,
  postLogoutRedirectUri: "https://yourapp.com/goodbye",
  state: "csrf-token-or-return-marker",
});`}</code>
          </pre>
          <p className="text-xs text-[var(--text-tertiary)]">
            Need a URL only (e.g. for an <code>&lt;a href&gt;</code>)? Use <code>buildEndSessionUrl(...)</code>.
            The endpoint follows <a className="text-[var(--accent)] hover:underline" href="https://openid.net/specs/openid-connect-rpinitiated-1_0.html" target="_blank" rel="noreferrer">OIDC RP-Initiated Logout 1.0</a>.
          </p>
        </section>

        {/* Verify API */}
        <section id="verify-api" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold text-[var(--accent)]">Verify API</h2>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">
            Direct REST access if you don&apos;t want to use the SDK. Use this when you only need one-shot
            human verification (CAPTCHA-replacement) and don&apos;t need user sessions.
          </p>

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
            <h4 className="mb-2 text-sm font-semibold">Request body</h4>
            <pre className="mb-4 rounded-lg bg-[var(--bg-primary)] p-3 text-xs leading-relaxed">
              <code>{`{
  "proof": "0x...",
  "merkle_root": "0x...",
  "nullifier_hash": "0x...",
  "action": "login",
  "verification_level": "orb"   // optional
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

          <div className="mt-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded bg-[var(--accent)] px-2 py-0.5 text-xs font-bold text-black">POST</span>
              <code className="text-sm">/api/rp-context</code>
            </div>
            <p className="mb-4 text-sm text-[var(--text-secondary)]">
              Generate a signed RP context for World ID 4.0 verification. Required for IDKit v4.
            </p>
            <h4 className="mb-2 text-sm font-semibold">Request body</h4>
            <pre className="mb-4 rounded-lg bg-[var(--bg-primary)] p-3 text-xs">
              <code>{`{ "action": "login" }   // optional, defaults to "humanauth-verify"`}</code>
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
        </section>

        {/* Apps */}
        <section id="apps-api" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold text-[var(--accent)]">Apps API</h2>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded bg-[var(--warning)] px-2 py-0.5 text-xs font-bold text-black">CRUD</span>
              <code className="text-sm">/api/apps</code>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              App management endpoints. Requires dashboard JWT authentication.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-[var(--text-tertiary)]">
              <li><code>GET /api/apps</code> — list your apps</li>
              <li><code>POST /api/apps</code> — register a new app</li>
              <li><code>GET /api/apps/:id</code> — app details + recent logs</li>
              <li><code>DELETE /api/apps/:id</code> — delete (cascades keys, logs, nullifiers)</li>
              <li><code>GET /api/apps/:id/keys</code> — list API keys</li>
              <li><code>POST /api/apps/:id/keys</code> — create new API key</li>
              <li><code>DELETE /api/apps/:id/keys</code> — revoke a key (body: {`{"key_id": "..."}`})</li>
            </ul>
          </div>
        </section>

        {/* Discovery */}
        <section id="discovery" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold text-[var(--accent)]">OIDC discovery</h2>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            Most OIDC client libraries can configure themselves from the discovery document.
          </p>
          <pre className="mb-4 overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-sm">
            <code>https://humanauth.vercel.app/.well-known/openid-configuration</code>
          </pre>
          <p className="text-xs text-[var(--text-tertiary)]">
            <strong>Note on domains:</strong> the IdP issuer currently lives at <code>humanauth.vercel.app</code> as a placeholder.
            A <code>humad.*</code> custom domain will be assigned later. The SDK reads the issuer URL from discovery, so SDK consumers won&apos;t see a breaking change.
            If you hardcode <code>issuer</code> in your config, plan a one-line update.
          </p>
        </section>

        {/* Concepts */}
        <section id="concepts" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold text-[var(--accent)]">Concepts</h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Nullifier hash</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                A unique, anonymous identifier per (user, action). The same person verifying &quot;login&quot; and &quot;vote&quot; produces
                different nullifiers — privacy by design. Humad stores and deduplicates these automatically. For OIDC, the
                <code> sub</code> claim is a pairwise identifier derived from the user&apos;s World ID nullifier and the RP&apos;s <code>client_id</code>.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">RP signing (World ID 4.0)</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                World ID 4.0 requires all verification requests to be signed by the Relying Party. Humad manages
                your signing keys (encrypted at rest with AES-256-GCM) and generates signed RP contexts on demand.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">MAU tracking</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Monthly Active Users are counted by unique nullifier per calendar month. Your dashboard shows real-time MAU counts and historical trends.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">SSO session</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Humad maintains a session cookie on the IdP domain so a user signing in to one RP can sign in to other RPs without re-prompting World ID.
                Silent refresh and <code>prompt=none</code> rely on this. RP-Initiated Logout ends the SSO session for all RPs at once.
              </p>
            </div>
          </div>
        </section>

        {/* Operational */}
        <section id="ops" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold text-[var(--accent)]">Operational notes</h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Signing-key rotation</h3>
              <p className="mb-2 text-sm text-[var(--text-secondary)]">
                Humad signs id_tokens with RS256 keys exposed at <code>/.well-known/jwks.json</code>. We support overlap-style
                rotation: the new key publishes alongside the previous key for a grace period so already-issued id_tokens
                remain verifiable. RPs that fetch JWKS dynamically (the SDK does this) need no action.
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">
                Run <code>tsx scripts/rotate-oidc-keys.ts</code> to generate a fresh keypair; promote it via the
                <code> OIDC_*</code> / <code>OIDC_PREV_*</code> environment variables. Only the Humad operator can do this.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Token lifetimes (current defaults)</h3>
              <ul className="ml-5 list-disc text-sm text-[var(--text-secondary)]">
                <li><code>access_token</code>: 15 minutes (opaque, server-introspected)</li>
                <li><code>id_token</code>: 15 minutes (RS256 JWT)</li>
                <li><code>refresh_token</code>: 30 days, rotated on every use</li>
                <li>authorization code: 60 seconds, one-time use</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Status</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Beta. Issuer is <code>humanauth.vercel.app</code> until the <code>humad.*</code> domain is assigned.
                Production RPs are welcome — give us a heads up before launch so we can keep your client_id pinned through any migrations.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
