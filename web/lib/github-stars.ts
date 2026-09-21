import { STAR_REPO } from "./repo";

type StarredRow = {
  full_name?: string;
  repo?: { full_name?: string };
};

type StargazerRow = {
  user?: { login?: string };
  login?: string;
};

const TARGET = `${STAR_REPO.owner}/${STAR_REPO.name}`.toLowerCase();
const CACHE_TTL_MS = 5 * 60 * 1000;

/** Positive verifications cached briefly (username → expiry). */
const positiveCache = new Map<string, number>();

function authHeaders(accept: string): HeadersInit {
  const headers: Record<string, string> = {
    Accept: accept,
    "User-Agent": "programming-books-pdf-star-gate",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function cachedPositive(login: string): boolean {
  const exp = positiveCache.get(login);
  if (!exp) return false;
  if (Date.now() > exp) {
    positiveCache.delete(login);
    return false;
  }
  return true;
}

function rememberPositive(login: string) {
  positiveCache.set(login, Date.now() + CACHE_TTL_MS);
}

/** star+json nests the repo under `.repo`; default JSON is flat. */
function starredFullName(row: StarredRow): string {
  return (row.repo?.full_name || row.full_name || "").toLowerCase();
}

function stargazerLogin(row: StargazerRow): string {
  return (row.user?.login || row.login || "").toLowerCase();
}

/**
 * Check the user's starred repos (newest first with star media type).
 * Handles both default and star+json response shapes.
 */
async function userHasStarredRepo(username: string): Promise<boolean | null> {
  const maxPages = 20; // up to 2,000 starred repos
  for (let page = 1; page <= maxPages; page += 1) {
    const url = new URL(
      `https://api.github.com/users/${encodeURIComponent(username)}/starred`,
    );
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));

    const res = await fetch(url, {
      headers: authHeaders("application/vnd.github.star+json"),
      cache: "no-store",
    });

    if (res.status === 404) {
      throw new Error(`GitHub user @${username} was not found.`);
    }
    if (res.status === 403 || res.status === 429) {
      // Rate limited / blocked — try the other method instead of failing hard.
      return null;
    }
    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as StarredRow[];
    if (!Array.isArray(data)) return null;

    for (const row of data) {
      if (starredFullName(row) === TARGET) return true;
    }
    if (data.length < 100) return false;
  }
  return false;
}

/**
 * Walk this repo's stargazer list (newest first with star media type).
 * Works best with GITHUB_TOKEN; returns null if the API is unavailable.
 */
async function loginInStargazerList(username: string): Promise<boolean | null> {
  const login = username.toLowerCase();
  const maxPages = 50;

  for (let page = 1; page <= maxPages; page += 1) {
    const url = new URL(
      `https://api.github.com/repos/${STAR_REPO.owner}/${STAR_REPO.name}/stargazers`,
    );
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));

    const res = await fetch(url, {
      headers: authHeaders("application/vnd.github.star+json"),
      cache: "no-store",
    });

    if (res.status === 401 || res.status === 403 || res.status === 429) {
      return null;
    }
    if (!res.ok) return null;

    const data = (await res.json()) as StargazerRow[];
    if (!Array.isArray(data)) return null;

    for (const row of data) {
      if (stargazerLogin(row) === login) return true;
    }
    if (data.length < 100) return false;
  }
  return false;
}

/**
 * True when `username` has starred this repository.
 *
 * Tries the user's starred list first (best for "I just starred"), then the
 * repo stargazer list. Succeeds if either method confirms — never short-circuits
 * a false from one method without trying the other.
 */
export async function isRepoStargazer(username: string): Promise<boolean> {
  const login = username.toLowerCase();
  if (cachedPositive(login)) return true;

  const fromUser = await userHasStarredRepo(login);
  if (fromUser === true) {
    rememberPositive(login);
    return true;
  }

  const fromList = await loginInStargazerList(login);
  if (fromList === true) {
    rememberPositive(login);
    return true;
  }

  // Only treat as not starred when at least one method completed a full scan.
  if (fromUser === false || fromList === false) {
    return false;
  }

  throw new Error(
    "Could not reach GitHub to verify stars. Try again shortly, or set GITHUB_TOKEN on the server.",
  );
}
