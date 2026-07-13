"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

function getPreferred(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("upb-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initial = getPreferred();
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("upb-theme", next);
  }

  return (
    <div className={styles.wrap} role="group" aria-label="Theme">
      <button
        type="button"
        className={theme === "light" ? styles.active : styles.btn}
        onClick={() => apply("light")}
        aria-pressed={theme === "light"}
      >
        Light
      </button>
      <button
        type="button"
        className={theme === "dark" ? styles.active : styles.btn}
        onClick={() => apply("dark")}
        aria-pressed={theme === "dark"}
      >
        Dark
      </button>
    </div>
  );
}
