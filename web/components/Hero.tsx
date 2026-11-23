import Link from "next/link";
import styles from "./Hero.module.css";

type HeroProps = {
  bookCount: number;
  languageCount: number;
};

export function Hero({ bookCount, languageCount }: HeroProps) {
  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-title">
      <div className="container">
        <p className={styles.eyebrow}>Programming library</p>
        <h1 id="hero-title" className={styles.title}>
          Programming books for {languageCount} languages.
        </h1>
        <p className={styles.sub}>
          {bookCount}+ curated books, beginner to advanced — Python, JavaScript,
          Java, C++, Rust, Go, and more. Pick a language shelf to search and
          filter its books.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#languages">
            Choose a language
          </a>
          <Link className={styles.secondary} href="/library">
            Open library
          </Link>
        </div>
      </div>
    </section>
  );
}
