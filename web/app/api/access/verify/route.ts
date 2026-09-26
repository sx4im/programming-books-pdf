import { NextResponse } from "next/server";
import { isRepoStargazer } from "../../../../lib/github-stars";
import {
  ACCESS_COOKIE,
  accessCookieOptions,
  createAccessToken,
  normalizeGithubUsername,
} from "../../../../lib/star-access";
import { STAR_REPO } from "../../../../lib/repo";

export const runtime = "nodejs";

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function rateLimit(key: string): boolean {
  const now = Date.now();
  const row = hits.get(key);
  if (!row || now > row.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (row.count >= RATE_MAX) return false;
  row.count += 1;
  return true;
}

export async function POST(req: Request) {
  if (!rateLimit(clientKey(req))) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const usernameRaw =
    typeof body === "object" &&
    body !== null &&
    "username" in body &&
    typeof (body as { username: unknown }).username === "string"
      ? (body as { username: string }).username
      : "";

  const username = normalizeGithubUsername(usernameRaw);
  if (!username) {
    return NextResponse.json(
      {
        ok: false,
        error: "Enter a valid GitHub username.",
      },
      { status: 400 },
    );
  }

  let starred: boolean;
  try {
    starred = await isRepoStargazer(username);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not reach GitHub.";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }

  if (!starred) {
    return NextResponse.json(
      {
        ok: false,
        starred: false,
        error: "We could not find this username.",
        starUrl: STAR_REPO.starUrl,
      },
      { status: 403 },
    );
  }

  const token = createAccessToken(username);
  const res = NextResponse.json({
    ok: true,
    starred: true,
    username: username.toLowerCase(),
  });
  res.cookies.set(ACCESS_COOKIE, token, accessCookieOptions());
  return res;
}
