# humad-sdk

World ID authentication gateway SDK. Add human verification to any app in 2 lines of code, plus a universal **Login with Humad** identity layer (OAuth 2.1 / OIDC).

> **Renamed from `humanauth-sdk`.** v0.2.0 is the first release under the new name. The old package (`humanauth-sdk`) is deprecated — please switch.

## Install

```bash
npm install humad-sdk @worldcoin/idkit
```

## React — Drop-in Component

```tsx
import { HumanAuth } from "humad-sdk/react";

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

> Note: the public React component is still exported as `HumanAuth` (class names: `HumanAuthClient`, `verifyWithHumanAuth`, etc.) for v0.2.x backwards compatibility with `humanauth-sdk`. These will be renamed to `Humad` / `HumadClient` / `verifyWithHumad` in v1.0.

## Server-side — API Client

```typescript
import { HumanAuthClient } from "humad-sdk";

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

## Login with Humad (OAuth 2.1 + OIDC)

A universal **Login with Humad** identity layer built on World ID. Users sign in once with World ID and your app gets their Humad handle, verified-human status, and a stable user_id — without you running an auth server.

### Browser flow

```typescript
import { signIn, handleCallback, getUser, signOut } from "humad-sdk";

// 1. On a "Login with Humad" button:
await signIn({
  clientId: "ha_oauth_xxxxxxxx",
  redirectUri: "https://yourapp.com/oauth/callback",
  scopes: ["openid", "profile", "verified_human"],
});

// 2. On your /oauth/callback page:
const { tokens } = await handleCallback({ clientId: "ha_oauth_xxxxxxxx" });
const user = await getUser(tokens);
console.log(user.handle, user.verified_human);

// 3. Sign out:
await signOut({ token: tokens.refreshToken!, tokenTypeHint: "refresh_token", clientId: "ha_oauth_xxxxxxxx" });
```

### Server flow (confidential client)

```typescript
import { exchangeCodeForTokens, getUserInfo } from "humad-sdk";

// In your /oauth/callback route handler:
const tokens = await exchangeCodeForTokens({
  clientId: process.env.HUMAD_CLIENT_ID!,
  clientSecret: process.env.HUMAD_CLIENT_SECRET!,
  code,
  codeVerifier,
  redirectUri,
});

const user = await getUserInfo({ accessToken: tokens.accessToken });
```

Register your OAuth client at [the dashboard](https://humanauth.vercel.app/dashboard/oauth).

OIDC discovery: `https://humanauth.vercel.app/.well-known/openid-configuration`.

> The IdP currently lives at `humanauth.vercel.app` as a placeholder domain. A `humad.*` custom domain will be assigned later — the SDK reads the issuer URL from the OIDC discovery document, so no breaking change is expected.

## What Humad handles for you

| Concern | Without Humad | With Humad |
|---------|---------------|------------|
| RP key management | Build KMS integration | Managed (AES-256-GCM at rest) |
| Nullifier storage | Build + maintain DB | Automatic dedup |
| MAU tracking | Build analytics | Dashboard included |
| SDK upgrades | Manual migration | Automatic |
| World ID 4.0 signing | Implement RP signing | One API call |
| OAuth/OIDC server | Run your own | Hosted Login with Humad |

## Links

- [Dashboard](https://humanauth.vercel.app/dashboard) — Manage apps & API keys
- [Docs](https://humanauth.vercel.app/docs) — API reference & guides
- [GitHub](https://github.com/bbb-build/humanauth) — Source code

## Migration from `humanauth-sdk`

```bash
npm uninstall humanauth-sdk
npm install humad-sdk
```

The public API is unchanged in v0.2.0 — only the package name moved. Find-and-replace `from "humanauth-sdk"` → `from "humad-sdk"` and you're done.

## License

MIT — BBB&Company
