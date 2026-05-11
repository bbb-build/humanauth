# Humad

**World ID Authentication Gateway** — Add human verification to any app in 2 lines of code.

Managed RP signing, nullifier deduplication, real-time analytics, plus **Login with Humad** (OIDC). Powered by [World ID](https://worldcoin.org/world-id).

**Live:** [humanauth.vercel.app](https://humanauth.vercel.app) *(domain placeholder — will be migrated to humad.* later)*
**npm:** [humad-sdk](https://www.npmjs.com/package/humad-sdk)

## Quick Start

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

> Note: the public React component is still exported as `HumanAuth` for v0.2.x compatibility. It will be renamed to `Humad` in v1.0.

## What it does

| You get | Instead of building |
|---------|-------------------|
| Managed RP signing (AES-256-GCM) | KMS integration + key rotation |
| Automatic nullifier dedup | Custom DB + duplicate detection |
| MAU tracking + dashboard | Analytics from scratch |
| Drop-in React component | IDKit integration + error handling |
| World ID 4.0 auto-migration | Manual SDK upgrades |
| Login with Humad (OIDC) | Build your own OAuth/OIDC stack |

## Architecture

```
Your App → Humad API → World ID Cloud API
              ↓
         Supabase (nullifiers, logs, MAU, OIDC sessions)
```

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/verify` | POST | Verify World ID proof (API key required) |
| `/api/rp-context` | POST | Get signed RP context for IDKit v4 |
| `/api/apps` | GET/POST | Manage apps (JWT auth) |
| `/api/apps/:id/keys` | GET/POST | Manage API keys |
| `/api/dashboard/stats` | GET | Dashboard analytics |
| `/api/oauth/*` | — | OAuth 2.1 / OIDC endpoints (authorize, token, userinfo, revoke, jwks, discovery) |

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
