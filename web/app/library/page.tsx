import { Suspense } from "react";
import { getAllBooks } from "../../lib/books-server";
import { toPublicBooks } from "../../lib/public-books";
import { LibraryPage } from "../../components/LibraryPage";

export const metadata = {
  title: "Library",
  description:
    "Browse 670+ programming books by language and skill level. Search Python, JavaScript, Java, Rust, Go, and more — then open public Drive links to read.",
  alternates: {
    canonical: "https://freecodebooks.vercel.app/library",
  },
};

function LibraryFallback() {
  return (
    <div className="container" style={{ padding: "48px 0" }}>
      Loading library…
    </div>
  );
}

export default function LibraryRoute() {
  const books = toPublicBooks(getAllBooks());
  return (
    <Suspense fallback={<LibraryFallback />}>
      <LibraryPage books={books} />
    </Suspense>
  );
}
