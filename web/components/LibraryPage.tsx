"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const langParam = searchParams.get("lang") || "";
  const initialLang = LANGUAGES.some((l) => l.id === langParam)
    ? langParam
    : LANGUAGES[0].id;

  const [language, setLanguage] = useState(initialLang);
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    if (langParam && LANGUAGES.some((l) => l.id === langParam)) {
      setLanguage(langParam);
    }
  }, [langParam]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const book of books) {
      map[book.language] = (map[book.language] ?? 0) + 1;
    }
    return map;
  }, [books]);

  const languageMeta = LANGUAGES.find((l) => l.id === language)!;

  const filtered = useMemo(() => {
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

  const updateLang = useCallback(
    (id: string) => {
      setLanguage(id);
      setCategory("all");
      const params = new URLSearchParams();
      params.set("lang", id);
      const q = query.trim();
      if (q) params.set("q", q);
      router.replace(`/library?${params.toString()}`, { scroll: false });
    },
    [router, query]
  );

  function clearFilters() {
    setCategory("all");
    setQuery("");
    router.replace(`/library?lang=${language}`, { scroll: false });
  }

  return (
    <>
      <TopNav active="library" />
      <main className={styles.main}>
        <div className={`container ${styles.layout}`}>
          <header className={styles.header}>
            <div>
              <p className={styles.kicker}>Library</p>
              <h1 className={styles.title}>{languageMeta.label}</h1>
              <p className={styles.sub}>{languageMeta.blurb}</p>
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

          <div className={styles.langRail} aria-label="Languages">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                type="button"
                className={
                  language === lang.id ? styles.langActive : styles.langChip
                }
                onClick={() => updateLang(lang.id)}
                aria-pressed={language === lang.id}
              >
                {lang.label}
                <span className={styles.langCount}>{counts[lang.id] ?? 0}</span>
              </button>
            ))}
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
              body="Try another search term, category, or language."
              actionLabel="Reset filters"
              onAction={clearFilters}
            />
          ) : (
            <BookGrid books={filtered} />
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
