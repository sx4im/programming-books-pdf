import { LANGUAGES } from "../data/languages";
import { TopNav } from "./TopNav";
import { Hero } from "./Hero";
import { LanguageShelf } from "./LanguageShelf";
import { SiteFooter } from "./SiteFooter";

type Props = {
  bookCount: number;
  counts: Record<string, number>;
};

export function HomePage({ bookCount, counts }: Props) {
  return (
    <>
      <TopNav active="home" />
      <main>
        <Hero bookCount={bookCount} languageCount={LANGUAGES.length} />
        <LanguageShelf languages={LANGUAGES} counts={counts} />
      </main>
      <SiteFooter />
    </>
  );
}
