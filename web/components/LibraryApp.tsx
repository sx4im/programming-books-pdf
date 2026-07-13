"use client";

import { useMemo, useState } from "react";
import type { Book, Category } from "../lib/types";
import { LANGUAGES } from "../data/languages";
import { TopNav } from "./TopNav";
import { Hero } from "./Hero";
import { LanguageShelf } from "./LanguageShelf";
import { FilterBar } from "./FilterBar";
import { BookGrid } from "./BookGrid";
import { EmptyState } from "./EmptyState";
import styles from "./LibraryApp.module.css";

type Props = {
  books: Book[];
};

export function LibraryApp({ books }: Props) {
  const [language, setLanguage] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const book of books) {
      map[book.language] = (map[book.language] ?? 0) + 1;
    }
    return map;
  }, [books]);

  const languageMeta = LANGUAGES.find((l) => l.id === language) ?? null;

  const filtered = useMemo(() => {
    if (!language) return [];
    const q = query.trim().toLowerCase();
    return books.filter((book) => {
      if (book.language !== language) return false;
      if (category !== "all" && book.category !== category) return false;
      if (!q) return true;
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q)
      );
    });
  }, [books, language, category, query]);

  function selectLanguage(id: string) {
    setLanguage(id);
    setCategory("all");
    setQuery("");
    requestAnimationFrame(() => {
      document.getElementById("library")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  function clearFilters() {
    setCategory("all");
    setQuery("");
  }

  return (
    <>
      <TopNav />
      <main>
        <Hero bookCount={books.length} languageCount={LANGUAGES.length} />
        <LanguageShelf
          languages={LANGUAGES}
          selected={language}
          counts={counts}
          onSelect={selectLanguage}
        />

        <section className={styles.library} id="library">
          <div className="container">
            <FilterBar
              languageLabel={languageMeta?.label ?? null}
              category={category}
              query={query}
              resultCount={filtered.length}
              onCategory={setCategory}
              onQuery={setQuery}
              onClear={clearFilters}
            />

            {!language ? (
              <EmptyState
                title="Your shelf is waiting"
                body="Choose a language above to browse beginner-to-advanced titles. Read book opens the public Drive link."
                actionLabel="Choose a language"
                onAction={() =>
                  document
                    .getElementById("languages")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No books match these filters"
                body="Try another category or clear the search to see the full shelf."
                actionLabel="Reset filters"
                onAction={clearFilters}
              />
            ) : (
              <BookGrid books={filtered} />
            )}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <p>
            Ultimate Programming Books — curated index. Covers and authors can be
            filled in <code>web/data/books.json</code>.
          </p>
          <a
            href="https://github.com/sx4im/programming-books-pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </footer>
    </>
  );
}
