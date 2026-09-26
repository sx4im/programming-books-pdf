import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ACCESS_COOKIE = "book_star_access";
/** Short-lived: only covers the immediate read redirect after verify. */
export const ACCESS_MAX_AGE_SEC = 60 * 5; // 5 minutes

function getSecret(): string {
  const secret =
    process.env.STAR_GATE_SECRET ||
    process.env.ACCESS_SECRET ||
    process.env.GITHUB_TOKEN;
  if (secret && secret.length >= 16) return secret;
  // Dev/build fallback — set STAR_GATE_SECRET in production.
  return "dev-star-gate-secret-change-me";
}

function sign(body: string): string {
  return createHmac("sha256", getSecret()).update(body).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Compact signed token: username.expiry.signature */
export function createAccessToken(username: string): string {
  const exp = Math.floor(Date.now() / 1000) + ACCESS_MAX_AGE_SEC;
  const body = `${username.toLowerCase()}.${exp}`;
  return `${body}.${sign(body)}`;
}

export function verifyAccessToken(
  token: string | undefined | null,
): { username: string } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [username, expStr, sig] = parts;
  if (!username || !expStr || !sig) return null;
  if (!/^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i.test(username)) {
    return null;
  }
  const body = `${username}.${expStr}`;
  if (!safeEqual(sign(body), sig)) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    return null;
  }
  return { username: username.toLowerCase() };
}

export async function getAccessFromCookies(): Promise<{
  username: string;
} | null> {
  const jar = await cookies();
  return verifyAccessToken(jar.get(ACCESS_COOKIE)?.value);
}

export function accessCookieOptions(maxAge = ACCESS_MAX_AGE_SEC) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

/** GitHub login rules (simplified). */
export function normalizeGithubUsername(raw: string): string | null {
  const username = raw.trim().replace(/^@/, "");
  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username)) {
    return null;
  }
  return username;
}
