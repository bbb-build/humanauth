# Humad

**Identity layer for the human web.** A World ID–powered IdP plus a managed Verify API — pick what fits your app.

- **Login with Humad (OIDC)** — drop a "Sign in" button into any SaaS / web app. OAuth 2.1 + OpenID Connect, PKCE-required for public clients, RS256 id_tokens, refresh-token rotation, silent renew, RP-Initiated Logout. No auth server to run.
- **Verify API** — one-shot human verification (CAPTCHA replacement). Managed RP signing, nullifier dedup, MAU analytics.

**Live IdP:** [humanauth.vercel.app](https://humanauth.vercel.app) *(domain placeholder — will be migrated to humad.* later)*
**Live demo RP:** [humad-demo.vercel.app](https://humad-demo.vercel.app)
**Docs:** [humanauth.vercel.app/docs](https://humanauth.vercel.app/docs)
**npm:** [humad-sdk](https://www.npmjs.com/package/humad-sdk)

## Quick Start

### A. Login with Humad (recommended for SaaS / web apps)

1. Register an OAuth client at [/dashboard/oauth](https://humanauth.vercel.app/dashboard/oauth) → get `client_id` (+ `client_secret` for confidential clients).
2. `npm install humad-sdk`
3. Wire up `signIn()` + `handleCallback()`:

```typescript
import { signIn, handleCallback, getUser } from "humad-sdk";

// Login button
await signIn({
  clientId: "ha_oauth_xxxxxxxx",
  redirectUri: "https://yourapp.com/oauth/callback",
  scopes: ["openid", "profile", "verified_human"],
});

// /oauth/callback
const { tokens } = await handleCallback({ clientId: "ha_oauth_xxxxxxxx" });
const user = await getUser(tokens);
// user.sub / user.handle / user.verified_human / user.verification_level
```

OIDC discovery: `https://humanauth.vercel.app/.well-known/openid-configuration`

### B. Verify API (one-shot human check)

```bash
npm install humad-sdk @worldcoin/idkit
```

```tsx
import { HumanAuth } from "humad-sdk/react";

<HumanAuth
  appId="app_your_world_id"
  apiKey="ha_your_key"
  action="login"
  onVerified={(result) => {
    console.log(result.nullifier_hash); // unique anonymous user ID
    console.log(result.is_new_user);    // first time?
  }}
/>
```

> Note: the React component is still exported as `HumanAuth` for v0.2.x compatibility. It will be renamed to `Humad` in v1.0.

## What it does

| You get | Instead of building |
|---------|-------------------|
| Hosted OIDC IdP (Login with Humad) | Your own OAuth/OIDC stack |
| Silent refresh (timer + iframe modes) | Custom token rotation + iframe plumbing |
| Signed-key rotation w/ overlap window | KMS + JWKS lifecycle |
| Managed RP signing (AES-256-GCM at rest) | KMS integration + key rotation |
| Automatic nullifier dedup | Custom DB + duplicate detection |
| MAU tracking + dashboard | Analytics from scratch |
| Drop-in React component | IDKit integration + error handling |
| World ID 4.0 auto-migration | Manual SDK upgrades |

## Architecture

```
Your App ──┬─► Humad OIDC (Login with Humad) ──► World ID
           └─► Humad Verify API ─────────────────► World ID
                       ↓
                  Supabase (nullifiers, logs, MAU, OIDC sessions)
```

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/oauth/authorize` | GET | OAuth 2.1 authorization endpoint |
| `/api/oauth/token` | POST | Token endpoint (code + refresh grants) |
| `/api/oauth/userinfo` | GET/POST | OIDC userinfo |
| `/api/oauth/revoke` | POST | RFC 7009 token revocation |
| `/api/oauth/end-session` | GET/POST | OIDC RP-Initiated Logout |
| `/.well-known/openid-configuration` | GET | OIDC discovery |
| `/.well-known/jwks.json` | GET | RS256 JWKS (current + previous during rotation) |
| `/api/verify` | POST | Verify World ID proof (API key required) |
| `/api/rp-context` | POST | Get signed RP context for IDKit v4 |
| `/api/apps` | GET/POST | Manage apps (JWT auth) |
| `/api/apps/:id/keys` | GET/POST | Manage API keys |
| `/api/dashboard/stats` | GET | Dashboard analytics |

## Stack

- Next.js 16 + React 19 + TypeScript
- Supabase (PostgreSQL)
- World ID SDK (IDKit v4)
- Vercel (deployment + cron)
- Tailwind CSS v4

## Positioning

Humad is the **ID layer** of the HUMAD product family. It is not a standalone revenue product — like Facebook Login, it monetizes indirectly through the data it gathers (see HUMAD Ads).

## Development

```bash
cp .env.example .env.local
npm install
npm run dev
```

## License

MIT — BBB&Company
