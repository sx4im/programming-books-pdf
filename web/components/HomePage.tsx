"use client";

import { useMemo } from "react";
import type { Book } from "../lib/types";
import { LANGUAGES } from "../data/languages";
import { TopNav } from "./TopNav";
import { Hero } from "./Hero";
import { LanguageShelf } from "./LanguageShelf";
import { SiteFooter } from "./SiteFooter";

type Props = {
  books: Book[];
};

export function HomePage({ books }: Props) {
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const book of books) {
      map[book.language] = (map[book.language] ?? 0) + 1;
    }
    return map;
  }, [books]);

  return (
    <>
      <TopNav active="home" />
      <main>
        <Hero bookCount={books.length} languageCount={LANGUAGES.length} />
        <LanguageShelf languages={LANGUAGES} counts={counts} />
      </main>
      <SiteFooter />
    </>
  );
}
