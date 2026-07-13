"use client";

import Link from "next/link";
import type { LanguageMeta } from "../lib/types";
import styles from "./LanguageShelf.module.css";

type Props = {
  languages: LanguageMeta[];
  counts: Record<string, number>;
  selected?: string | null;
};

export function LanguageShelf({ languages, counts, selected }: Props) {
  return (
    <section className={styles.section} id="languages" aria-labelledby="lang-title">
      <div className="container">
        <div className={styles.header}>
          <h2 id="lang-title" className={styles.title}>
            Language shelves
          </h2>
          <p className={styles.sub}>
            Tap a language to open its library page — search and filter books for that shelf only.
          </p>
        </div>
        <div className={styles.grid}>
          {languages.map((lang) => {
            const active = selected === lang.id;
            const count = counts[lang.id] ?? 0;
            return (
              <Link
                key={lang.id}
                href={`/library?lang=${lang.id}`}
                className={active ? styles.cardActive : styles.card}
                aria-current={active ? "page" : undefined}
              >
                <span className={styles.label}>{lang.label}</span>
                <span className={styles.blurb}>{lang.blurb}</span>
                <span className={styles.count}>
                  {count} {count === 1 ? "book" : "books"}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
