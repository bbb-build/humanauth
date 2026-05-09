import { NextResponse } from "next/server";
import { getPublicJwk } from "@/lib/oidc-keys";

export async function GET() {
  const jwk = await getPublicJwk();
  return NextResponse.json({
    keys: [jwk],
  });
}
