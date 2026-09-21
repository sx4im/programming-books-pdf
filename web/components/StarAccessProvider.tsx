"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AccessState = {
  ready: boolean;
  unlocked: boolean;
  username: string | null;
  markUnlocked: (username: string) => void;
  /** Re-verify stored username and refresh the short-lived read cookie. */
  ensureAccessCookie: () => Promise<boolean>;
};

const AccessContext = createContext<AccessState | null>(null);

export function StarAccessProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Every full page load starts locked and wipes any leftover unlock cookie.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await fetch("/api/access/clear", {
          method: "POST",
          cache: "no-store",
        });
      } catch {
        // Ignore — UI still starts locked.
      } finally {
        if (!cancelled) {
          setUnlocked(false);
          setUsername(null);
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const markUnlocked = useCallback((name: string) => {
    setUnlocked(true);
    setUsername(name);
    setReady(true);
  }, []);

  const ensureAccessCookie = useCallback(async () => {
    if (!username) return false;
    try {
      const res = await fetch("/api/access/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = (await res.json()) as { ok?: boolean };
      return Boolean(res.ok && data.ok);
    } catch {
      return false;
    }
  }, [username]);

  return (
    <AccessContext.Provider
      value={{ ready, unlocked, username, markUnlocked, ensureAccessCookie }}
    >
      {children}
    </AccessContext.Provider>
  );
}

export function useStarAccess(): AccessState {
  const ctx = useContext(AccessContext);
  if (!ctx) {
    throw new Error("useStarAccess must be used within StarAccessProvider");
  }
  return ctx;
}
