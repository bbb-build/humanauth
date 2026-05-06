# @humanauth/sdk

World ID verification as a service. Add human verification to your app in minutes.

## Install

```bash
npm install @humanauth/sdk
```

## Server-side verification

```typescript
import { HumanAuthClient } from "@humanauth/sdk";

const ha = new HumanAuthClient({ apiKey: "ha_your_key" });

// Verify a World ID proof
const result = await ha.verify({
  proof: "0x...",
  merkle_root: "0x...",
  nullifier_hash: "0x...",
  action: "login",
});

console.log(result.is_new_user); // true on first verification
```

## Get RP Context (World ID 4.0)

```typescript
const { rp_context } = await ha.getRpContext("login");
// Pass rp_context to IDKit on the client
```

## React component

```bash
npm install @humanauth/sdk @worldcoin/idkit
```

```tsx
import { HumanAuth } from "@humanauth/sdk/react";

<HumanAuth
  appId="your-app-id"
  apiKey="ha_xxxxx"
  action="login"
  onVerified={(result) => console.log(result)}
/>
```

## Dashboard

Manage your apps and API keys at [humanauth.vercel.app](https://humanauth.vercel.app).
