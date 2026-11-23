"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import type { Category, LanguageMeta } from "../lib/types";
import { CATEGORIES } from "../lib/types";
import type { PublicBook } from "../lib/public-books";
import { requestAnyBookMailto } from "../lib/contact";
import { TopNav } from "./TopNav";
import { SiteFooter } from "./SiteFooter";
import { BookGrid } from "./BookGrid";
import { EmptyState } from "./EmptyState";
import { StarAccessProvider } from "./StarAccessProvider";
import styles from "./LibraryPage.module.css";

type Props = {
  language: LanguageMeta;
  books: PublicBook[];
};

export function LibraryPage({ language, books }: Props) {
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");

  // Read ?q= after hydration so the page stays statically rendered.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((book) => {
      if (category !== "all" && book.category !== category) return false;
      if (!q) return true;
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.edition.toLowerCase().includes(q)
      );
    });
  }, [books, category, query]);

  function clearFilters() {
    setCategory("all");
    setQuery("");
  }

  function requestAnyBook() {
    window.location.assign(requestAnyBookMailto(language.label, query.trim()));
  }

  return (
    <StarAccessProvider>
      <TopNav active="library" />
      <main className={styles.main}>
        <div className={`container ${styles.layout}`}>
          <header className={styles.header}>
            <div>
              <p className={styles.kicker}>Library shelf</p>
              <h1 className={styles.title}>{language.label} programming books</h1>
              <p className={styles.sub}>
                {language.blurb}. {books.length} curated {language.label} books
                from beginner to advanced. Search by title or author, filter by
                level, then open a book.
              </p>
              <div className={styles.headerLinks}>
                <Link className={styles.changeLang} href="/library">
                  ← Change language
                </Link>
                <button
                  type="button"
                  className={styles.requestAny}
                  onClick={requestAnyBook}
                >
                  Can&apos;t find a book? Request it by email
                </button>
              </div>
            </div>
            <p className={styles.count} aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "title" : "titles"}
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
                className={category === c.id ? styles.chipActive : styles.chip}
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
              body={
                query.trim()
                  ? `We don't have “${query.trim()}” yet. Request it by email and we'll add it to the ${language.label} shelf.`
                  : "Try another search term or category for this language."
              }
              actionLabel={query.trim() ? "Request this book" : "Reset filters"}
              onAction={query.trim() ? requestAnyBook : clearFilters}
            />
          ) : (
            <BookGrid books={filtered} />
          )}
        </div>
      </main>
      <SiteFooter />
    </StarAccessProvider>
  );
}
