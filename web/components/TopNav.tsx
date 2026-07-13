import { ThemeToggle } from "./ThemeToggle";
import styles from "./TopNav.module.css";

export function TopNav() {
  return (
    <header className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.brand} href="#top">
          <span className={styles.mark} aria-hidden>
            ▲
          </span>
          Ultimate Programming Books
        </a>
        <nav className={styles.links} aria-label="Primary">
          <a href="#library">Library</a>
          <a href="#languages">Languages</a>
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
          <a className={styles.cta} href="#library">
            Browse shelf
          </a>
        </div>
      </div>
    </header>
  );
}
