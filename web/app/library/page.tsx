import { permanentRedirect } from "next/navigation";
import { getAllBooks } from "../../lib/books-server";
import { LANGUAGES } from "../../data/languages";
import { TopNav } from "../../components/TopNav";
import { LanguageShelf } from "../../components/LanguageShelf";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata = {
  title: "Library — Programming Books by Language",
  description:
    "Browse 700+ programming books across 32 languages by skill level. Python, JavaScript, Java, C#, C++, Rust, Go, and more.",
  alternates: {
    canonical: "https://freecodebooks.vercel.app/library",
  },
};

type Props = {
  searchParams: Promise<{ lang?: string | string[]; q?: string | string[] }>;
};

export default async function LibraryRoute({ searchParams }: Props) {
  const { lang, q } = await searchParams;
  const langId = Array.isArray(lang) ? lang[0] : lang;
  if (langId && LANGUAGES.some((l) => l.id === langId)) {
    const query = Array.isArray(q) ? q[0] : q;
    permanentRedirect(
      `/library/${langId}${query ? `?q=${encodeURIComponent(query)}` : ""}`,
    );
  }

  const counts: Record<string, number> = {};
  for (const book of getAllBooks()) {
    counts[book.language] = (counts[book.language] ?? 0) + 1;
  }

  return (
    <>
      <TopNav active="library" />
      <main>
        <LanguageShelf languages={LANGUAGES} counts={counts} />
      </main>
      <SiteFooter />
    </>
  );
}
