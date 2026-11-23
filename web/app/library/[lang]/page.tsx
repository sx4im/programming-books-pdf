import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBooks } from "../../../lib/books-server";
import { toPublicBooks } from "../../../lib/public-books";
import { coverSrcForBook } from "../../../lib/covers";
import { LANGUAGES } from "../../../data/languages";
import { LibraryPage } from "../../../components/LibraryPage";

const siteUrl = "https://freecodebooks.vercel.app";

type Params = { params: Promise<{ lang: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang: lang.id }));
}

function shelf(id: string) {
  const language = LANGUAGES.find((l) => l.id === id);
  if (!language) return null;
  const books = getAllBooks().filter((b) => b.language === id);
  return { language, books };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const data = shelf((await params).lang);
  if (!data) return {};
  const { language, books } = data;
  const famous = books
    .filter((b) => b.author)
    .slice(0, 3)
    .map((b) => b.title.split(":")[0])
    .join(", ");
  const title = `${language.label} Programming Books — ${books.length} Best Books, Beginner to Advanced`;
  const description = `${books.length} curated ${language.label} books (${language.blurb}): ${famous} and more. Filter by skill level, search by title or author, and read on Programming Books.`;
  const url = `${siteUrl}/library/${language.id}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, images: ["/og.png"] },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}

export default async function LanguageLibraryRoute({ params }: Params) {
  const data = shelf((await params).lang);
  if (!data) notFound();
  const { language, books } = data;
  const url = `${siteUrl}/library/${language.id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        url,
        name: `${language.label} programming books`,
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: books.length,
          itemListElement: books.map((book, i) => {
            const cover = coverSrcForBook(book);
            return {
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Book",
                name: book.title,
                ...(book.author
                  ? { author: book.author.split(", ").map((name) => ({ "@type": "Person", name })) }
                  : {}),
                ...(book.edition ? { bookEdition: book.edition } : {}),
                ...(cover ? { image: cover.startsWith("/") ? `${siteUrl}${cover}` : cover } : {}),
                inLanguage: "en",
              },
            };
          }),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Library", item: `${siteUrl}/library` },
          { "@type": "ListItem", position: 3, name: language.label, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <LibraryPage language={language} books={toPublicBooks(books)} />
    </>
  );
}
