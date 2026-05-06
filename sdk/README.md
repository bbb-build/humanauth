# @humanauth/sdk

World ID authentication gateway SDK. Add human verification to any app in 2 lines of code.

## Install

```bash
npm install @humanauth/sdk @worldcoin/idkit
```

## React — Drop-in Component

```tsx
import { HumanAuth } from "@humanauth/sdk/react";

function App() {
  return (
    <HumanAuth
      appId="app_your_world_id_app"
      apiKey="ha_your_api_key"
      action="login"
      verificationLevel="orb" // "orb" | "device" | "phone"
      onVerified={(result) => {
        console.log(result.nullifier_hash); // unique anonymous user ID
        console.log(result.is_new_user);    // first time verifying?
      }}
      onError={(err) => console.error(err)}
    />
  );
}
```

The component handles the full flow: fetch RP context → open World ID widget → verify proof → return result.

## Server-side — API Client

```typescript
import { HumanAuthClient } from "@humanauth/sdk";

const client = new HumanAuthClient({ apiKey: "ha_your_key" });

// Verify a World ID proof
const result = await client.verify({
  proof: "0x...",
  merkle_root: "0x...",
  nullifier_hash: "0x...",
  action: "login",
});

// Get RP context for World ID 4.0
const { rp_context } = await client.getRpContext("login");
```

## What HumanAuth handles for you

| Concern | Without HumanAuth | With HumanAuth |
|---------|-------------------|----------------|
| RP key management | Build KMS integration | Managed (AES-256-GCM at rest) |
| Nullifier storage | Build + maintain DB | Automatic dedup |
| MAU tracking | Build analytics | Dashboard included |
| SDK upgrades | Manual migration | Automatic |
| World ID 4.0 signing | Implement RP signing | One API call |

## Links

- [Dashboard](https://humanauth.vercel.app/dashboard) — Manage apps & API keys
- [Docs](https://humanauth.vercel.app/docs) — API reference & guides
- [GitHub](https://github.com/bbb-build/humanauth) — Source code

## License

MIT — BBB&Company
