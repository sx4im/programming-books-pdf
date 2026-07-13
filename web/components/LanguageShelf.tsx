import type { LanguageMeta } from "../lib/types";
import styles from "./LanguageShelf.module.css";

type Props = {
  languages: LanguageMeta[];
  selected: string | null;
  counts: Record<string, number>;
  onSelect: (id: string) => void;
};

export function LanguageShelf({
  languages,
  selected,
  counts,
  onSelect,
}: Props) {
  return (
    <section className={styles.section} id="languages" aria-labelledby="lang-title">
      <div className="container">
        <div className={styles.header}>
          <h2 id="lang-title" className={styles.title}>
            Language shelves
          </h2>
          <p className={styles.sub}>
            Select a language to open its shelf. Counts update from the live
            catalog.
          </p>
        </div>
        <div className={styles.grid}>
          {languages.map((lang) => {
            const active = selected === lang.id;
            const count = counts[lang.id] ?? 0;
            return (
              <button
                key={lang.id}
                type="button"
                className={active ? styles.cardActive : styles.card}
                onClick={() => onSelect(lang.id)}
                aria-pressed={active}
              >
                <span className={styles.label}>{lang.label}</span>
                <span className={styles.blurb}>{lang.blurb}</span>
                <span className={styles.count}>
                  {count} {count === 1 ? "book" : "books"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
