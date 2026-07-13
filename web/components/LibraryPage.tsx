"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Book, Category } from "../lib/types";
import { CATEGORIES } from "../lib/types";
import { LANGUAGES } from "../data/languages";
import { TopNav } from "./TopNav";
import { SiteFooter } from "./SiteFooter";
import { BookGrid } from "./BookGrid";
import { EmptyState } from "./EmptyState";
import styles from "./LibraryPage.module.css";

type Props = {
  books: Book[];
};

export function LibraryPage({ books }: Props) {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang") || "";
  const hasLang = LANGUAGES.some((l) => l.id === langParam);
  const language = hasLang ? langParam : null;

  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setCategory("all");
    setQuery(searchParams.get("q") || "");
  }, [langParam, searchParams]);

  const languageMeta = language
    ? LANGUAGES.find((l) => l.id === language) ?? null
    : null;

  const filtered = useMemo(() => {
    if (!language) return [];
    const q = query.trim().toLowerCase();
    return books.filter((book) => {
      if (book.language !== language) return false;
      if (category !== "all" && book.category !== category) return false;
      if (!q) return true;
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.edition.toLowerCase().includes(q)
      );
    });
  }, [books, language, category, query]);

  function clearFilters() {
    setCategory("all");
    setQuery("");
  }

  return (
    <>
      <TopNav active="library" />
      <main className={styles.main}>
        <div className={`container ${styles.layout}`}>
          {!language || !languageMeta ? (
            <EmptyState
              title="Choose a language shelf first"
              body="Pick a language on the home page. That opens this library with books for that shelf only."
              actionLabel="Go to language shelves"
              onAction={() => {
                window.location.href = "/#languages";
              }}
            />
          ) : (
            <>
              <header className={styles.header}>
                <div>
                  <p className={styles.kicker}>Library shelf</p>
                  <h1 className={styles.title}>{languageMeta.label}</h1>
                  <p className={styles.sub}>
                    {languageMeta.blurb} Search by title, filter by level, then
                    open a book.
                  </p>
                  <Link className={styles.changeLang} href="/#languages">
                    ← Change language
                  </Link>
                </div>
                <p className={styles.count} aria-live="polite">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "title" : "titles"}
                </p>
              </header>

              <div className={styles.searchWrap}>
                <label className="sr-only" htmlFor="library-search">
                  Search books by name
                </label>
                <input
                  id="library-search"
                  className={styles.search}
                  type="search"
                  placeholder="Search books by name or author…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className={styles.chips} role="tablist" aria-label="Category">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={category === c.id}
                    className={
                      category === c.id ? styles.chipActive : styles.chip
                    }
                    onClick={() => setCategory(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
                {(category !== "all" || query.trim()) && (
                  <button
                    type="button"
                    className={styles.reset}
                    onClick={clearFilters}
                  >
                    Reset
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <EmptyState
                  title="No books match"
                  body="Try another search term or category for this language."
                  actionLabel="Reset filters"
                  onAction={clearFilters}
                />
              ) : (
                <BookGrid books={filtered} />
              )}
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
