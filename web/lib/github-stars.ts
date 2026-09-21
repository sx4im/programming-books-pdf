import { STAR_REPO } from "./repo";

type StarredRepo = {
  full_name?: string;
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

async function readJson(res: Response): Promise<unknown> {
  return res.json();
}

/**
 * Check the user's public starred repos (newest first with star media type).
 * Works without a token for public profiles.
 */
async function userHasStarredRepo(username: string): Promise<boolean> {
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
      throw new Error(
        "GitHub rate limit reached. Try again shortly, or set GITHUB_TOKEN on the server.",
      );
    }
    if (!res.ok) {
      throw new Error(`GitHub API error (${res.status}).`);
    }

    const data = (await readJson(res)) as StarredRepo[];
    if (!Array.isArray(data)) {
      throw new Error("Unexpected GitHub starred response.");
    }

    for (const repo of data) {
      if ((repo.full_name || "").toLowerCase() === TARGET) {
        return true;
      }
    }
    if (data.length < 100) return false;
  }
  return false;
}

/**
 * Fallback: walk this repo's stargazer list (needs a token on many networks).
 */
async function loginInStargazerList(username: string): Promise<boolean | null> {
  const login = username.toLowerCase();
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) return null;

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

    const data = (await readJson(res)) as StargazerRow[];
    if (!Array.isArray(data)) return null;

    for (const row of data) {
      const entry = (row.user?.login || row.login || "").toLowerCase();
      if (entry === login) return true;
    }
    if (data.length < 100) return false;
  }
  return false;
}

/**
 * True when `username` has starred this repository.
 * Prefer the user's starred list (no token required); fall back to the
 * repo stargazer list when a token is available.
 */
export async function isRepoStargazer(username: string): Promise<boolean> {
  const login = username.toLowerCase();
  if (cachedPositive(login)) return true;

  // Fast path when token exists and the repo has relatively few stars.
  const fromList = await loginInStargazerList(login);
  if (fromList === true) {
    rememberPositive(login);
    return true;
  }
  if (fromList === false) {
    return false;
  }

  const starred = await userHasStarredRepo(login);
  if (starred) rememberPositive(login);
  return starred;
}
