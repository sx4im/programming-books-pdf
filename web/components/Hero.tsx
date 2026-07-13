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
          Pick a language.{" "}
          <span className={styles.gradient}>Open the shelf.</span>
        </h1>
        <p className={styles.sub}>
          A curated dashboard of {bookCount}+ programming books across{" "}
          {languageCount} languages. Filter by level, then read from public
          cloud links.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#languages">
            Choose a language
          </a>
          <a className={styles.secondary} href="#library">
            Jump to library
          </a>
        </div>
      </div>
    </section>
  );
}
