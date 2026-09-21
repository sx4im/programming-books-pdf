import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  accessCookieOptions,
} from "../../../../lib/star-access";

export const runtime = "nodejs";

/** Clear unlock cookie so a page refresh requires username again. */
export async function POST() {
  const res = NextResponse.json({ ok: true, unlocked: false });
  res.cookies.set(ACCESS_COOKIE, "", accessCookieOptions(0));
  return res;
}
