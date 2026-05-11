import { NextResponse } from "next/server";
import { getIssuer } from "@/lib/oidc-keys";
import { SUPPORTED_SCOPES } from "@/lib/oauth";

export async function GET() {
  const issuer = getIssuer();

  return NextResponse.json({
    issuer,
    authorization_endpoint: `${issuer}/api/oauth/authorize`,
    token_endpoint: `${issuer}/api/oauth/token`,
    userinfo_endpoint: `${issuer}/api/oauth/userinfo`,
    revocation_endpoint: `${issuer}/api/oauth/revoke`,
    end_session_endpoint: `${issuer}/api/oauth/end-session`,
    jwks_uri: `${issuer}/.well-known/jwks.json`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    scopes_supported: SUPPORTED_SCOPES,
    token_endpoint_auth_methods_supported: ["client_secret_post", "client_secret_basic", "none"],
    code_challenge_methods_supported: ["S256"],
    claims_supported: [
      "sub",
      "iss",
      "aud",
      "iat",
      "exp",
      "nonce",
      "auth_time",
      "preferred_username",
      "name",
      "picture",
      "email",
      "email_verified",
      "verified_human",
      "verification_level",
    ],
  });
}
