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
  refresh: () => Promise<void>;
  markUnlocked: (username: string) => void;
};

const AccessContext = createContext<AccessState | null>(null);

export function StarAccessProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/access/status", { cache: "no-store" });
      const data = (await res.json()) as {
        unlocked?: boolean;
        username?: string;
      };
      setUnlocked(Boolean(data.unlocked));
      setUsername(data.username ?? null);
    } catch {
      setUnlocked(false);
      setUsername(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const markUnlocked = useCallback((name: string) => {
    setUnlocked(true);
    setUsername(name);
    setReady(true);
  }, []);

  return (
    <AccessContext.Provider
      value={{ ready, unlocked, username, refresh, markUnlocked }}
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
