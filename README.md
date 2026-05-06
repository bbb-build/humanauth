# HumanAuth

**World ID Authentication Gateway** — Add human verification to any app in 2 lines of code.

Managed RP signing, nullifier deduplication, real-time analytics. Powered by [World ID](https://worldcoin.org/world-id).

**Live:** [humanauth.vercel.app](https://humanauth.vercel.app)
**npm:** [humanauth-sdk](https://www.npmjs.com/package/humanauth-sdk)

## Quick Start

```bash
npm install humanauth-sdk @worldcoin/idkit
```

```tsx
import { HumanAuth } from "humanauth-sdk/react";

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

## What it does

| You get | Instead of building |
|---------|-------------------|
| Managed RP signing (AES-256-GCM) | KMS integration + key rotation |
| Automatic nullifier dedup | Custom DB + duplicate detection |
| MAU tracking + dashboard | Analytics from scratch |
| Drop-in React component | IDKit integration + error handling |
| World ID 4.0 auto-migration | Manual SDK upgrades |

## Architecture

```
Your App → HumanAuth API → World ID Cloud API
                ↓
           Supabase (nullifiers, logs, MAU)
```

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
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

## Pricing

| Plan | MAU | Price |
|------|-----|-------|
| Free | 1,000 | $0 |
| Pro | 10,000 | $49/mo |
| Business | 100,000 | $199/mo |

## Development

```bash
cp .env.example .env.local
npm install
npm run dev
```

## License

MIT — BBB&Company
