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
          Pick a language. Open the shelf.
        </h1>
        <p className={styles.sub}>
          {bookCount}+ curated books across {languageCount} languages. Choose a
          language below, then browse the full library page with search and
          filters.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} href="/library">
            Open library
          </Link>
          <a className={styles.secondary} href="#languages">
            Choose a language
          </a>
        </div>
      </div>
    </section>
  );
}
