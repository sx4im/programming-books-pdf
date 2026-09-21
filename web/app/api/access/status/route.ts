import { NextResponse } from "next/server";
import { getAccessFromCookies } from "../../../../lib/star-access";

export const runtime = "nodejs";

export async function GET() {
  const access = await getAccessFromCookies();
  if (!access) {
    return NextResponse.json({ ok: true, unlocked: false });
  }
  return NextResponse.json({
    ok: true,
    unlocked: true,
    username: access.username,
  });
}
