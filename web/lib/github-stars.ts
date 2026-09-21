import { STAR_REPO } from "./repo";

type StargazerRow = {
  starred_at?: string;
  user?: { login?: string };
  login?: string;
};

type CacheState = {
  logins: Set<string>;
  fetchedAt: number;
  complete: boolean;
};

const CACHE_TTL_MS = 5 * 60 * 1000;
let cache: CacheState | null = null;

function authHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.star+json",
    "User-Agent": "programming-books-pdf-star-gate",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function loginFromRow(row: StargazerRow): string | null {
  const login = row.user?.login || row.login;
  return login ? login.toLowerCase() : null;
}

async function fetchStargazerPage(page: number): Promise<{
  logins: string[];
  done: boolean;
}> {
  const url = new URL(
    `https://api.github.com/repos/${STAR_REPO.owner}/${STAR_REPO.name}/stargazers`,
  );
  url.searchParams.set("per_page", "100");
  url.searchParams.set("page", String(page));

  const res = await fetch(url, {
    headers: authHeaders(),
    next: { revalidate: 0 },
  });

  if (res.status === 404) {
    throw new Error("Repository not found on GitHub.");
  }
  if (res.status === 403 || res.status === 429) {
    throw new Error(
      "GitHub rate limit reached. Try again in a few minutes, or set GITHUB_TOKEN on the server.",
    );
  }
  if (!res.ok) {
    throw new Error(`GitHub API error (${res.status}).`);
  }

  const data = (await res.json()) as StargazerRow[];
  if (!Array.isArray(data)) {
    throw new Error("Unexpected GitHub stargazer response.");
  }

  const logins = data
    .map(loginFromRow)
    .filter((login): login is string => Boolean(login));

  return { logins, done: data.length < 100 };
}

/**
 * Check whether `username` appears in this repo's stargazer list.
 * Newest stargazers come first (star media type), so a just-starred user
 * is usually found on page 1. Results are cached briefly in memory.
 */
export async function isRepoStargazer(username: string): Promise<boolean> {
  const login = username.toLowerCase();
  const now = Date.now();

  if (cache && now - cache.fetchedAt < CACHE_TTL_MS && cache.logins.has(login)) {
    return true;
  }

  const logins = new Set<string>(
    cache && now - cache.fetchedAt < CACHE_TTL_MS ? cache.logins : [],
  );

  // Walk pages (newest first) until we find the user or exhaust the list.
  let page = 1;
  let complete = false;
  const maxPages = 50; // up to 5,000 stargazers per check pass

  while (page <= maxPages) {
    const { logins: pageLogins, done } = await fetchStargazerPage(page);
    for (const entry of pageLogins) logins.add(entry);
    if (logins.has(login)) {
      cache = { logins, fetchedAt: now, complete: done && page === 1 ? false : complete };
      return true;
    }
    if (done) {
      complete = true;
      break;
    }
    page += 1;
  }

  cache = { logins, fetchedAt: now, complete };
  return complete ? false : logins.has(login);
}
