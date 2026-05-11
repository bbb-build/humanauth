import { NextResponse } from "next/server";
import { getAllPublicJwks } from "@/lib/oidc-keys";
import { withPublicCors, publicCorsPreflightResponse } from "@/lib/oauth-cors";

export async function GET() {
  const keys = await getAllPublicJwks();
  const res = NextResponse.json({ keys });
  return withPublicCors(res);
}

export async function OPTIONS() {
  return publicCorsPreflightResponse();
}
