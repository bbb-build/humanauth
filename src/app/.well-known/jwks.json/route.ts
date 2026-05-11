import { NextResponse } from "next/server";
import { getPublicJwk } from "@/lib/oidc-keys";
import { withPublicCors, publicCorsPreflightResponse } from "@/lib/oauth-cors";

export async function GET() {
  const jwk = await getPublicJwk();
  const res = NextResponse.json({
    keys: [jwk],
  });
  return withPublicCors(res);
}

export async function OPTIONS() {
  return publicCorsPreflightResponse();
}
