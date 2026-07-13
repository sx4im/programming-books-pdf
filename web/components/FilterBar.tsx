import { CATEGORIES, type Category } from "../lib/types";
import styles from "./FilterBar.module.css";

type Props = {
  languageLabel: string | null;
  category: Category | "all";
  query: string;
  resultCount: number;
  onCategory: (c: Category | "all") => void;
  onQuery: (q: string) => void;
  onClear: () => void;
};

export function FilterBar({
  languageLabel,
  category,
  query,
  resultCount,
  onCategory,
  onQuery,
  onClear,
}: Props) {
  return (
    <div className={styles.bar}>
      <div className={styles.top}>
        <div>
          <p className={styles.kicker}>Library</p>
          <h2 className={styles.title}>
            {languageLabel ? `${languageLabel} shelf` : "Select a language"}
          </h2>
        </div>
        <p className={styles.count} aria-live="polite">
          {languageLabel
            ? `${resultCount} ${resultCount === 1 ? "title" : "titles"}`
            : "—"}
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.chips} role="tablist" aria-label="Category">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={category === c.id}
              className={category === c.id ? styles.chipActive : styles.chip}
              onClick={() => onCategory(c.id)}
              disabled={!languageLabel}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className={styles.searchRow}>
          <label className="sr-only" htmlFor="book-search">
            Search books
          </label>
          <input
            id="book-search"
            className={styles.search}
            type="search"
            placeholder="Search title or author"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            disabled={!languageLabel}
          />
          {(category !== "all" || query) && (
            <button type="button" className={styles.clear} onClick={onClear}>
              Reset filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
