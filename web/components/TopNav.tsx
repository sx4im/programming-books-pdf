"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./TopNav.module.css";

type Props = {
  active?: "home" | "library";
};

export function TopNav({ active = "home" }: Props) {
  return (
    <header className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <Link className={styles.brand} href="/">
          <span className={styles.mark} aria-hidden>
            ▲
          </span>
          <span className={styles.brandText}>Ultimate Programming Books</span>
        </Link>
        <nav className={styles.links} aria-label="Primary">
          <Link
            href="/"
            className={active === "home" ? styles.linkActive : undefined}
          >
            Home
          </Link>
          <Link
            href="/library"
            className={active === "library" ? styles.linkActive : undefined}
          >
            Library
          </Link>
          <a
            href="https://github.com/sx4im/programming-books-pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
        <div className={styles.actions}>
          <ThemeToggle />
          <Link className={styles.cta} href="/library">
            Open library
          </Link>
        </div>
      </div>
    </header>
  );
}
