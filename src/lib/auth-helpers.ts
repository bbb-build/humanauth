import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "./jwt";

export async function getOwnerId(req: NextRequest): Promise<string | null> {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    const payload = await verifyJwt(token);
    return (payload.sub as string) || null;
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
