# HumanAuth

**World ID Authentication Gateway** — Add human verification to your app in 2 lines of code.

Managed RP signing, nullifier deduplication, and real-time analytics. Powered by [World ID](https://worldcoin.org/world-id).

## Quick Start

```tsx
import { HumanAuth } from "@humanauth/react";

<HumanAuth
  appId="your-app-id"
  apiKey="ha_xxxxx"
  action="login"
  onVerified={(result) => console.log(result)}
/>
```

## Features

- **Managed RP Signing** — Keys encrypted at rest (AES-256-GCM), automatic context generation
- **Nullifier Dedup** — Automatic duplicate detection and replay prevention
- **MAU Tracking** — Real-time analytics dashboard
- **Multi-Action** — Different actions per app, each with isolated nullifiers
- **API-First** — REST API + React SDK

## Architecture

```
Your App → HumanAuth API → World ID Cloud API
                ↓
           Supabase (nullifiers, logs, MAU)
```

## Development

```bash
npm install
npm run dev
```

## License

MIT
