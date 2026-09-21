import { Suspense } from "react";
import { getAllBooks } from "../../lib/books-server";
import { toPublicBooks } from "../../lib/public-books";
import { LibraryPage } from "../../components/LibraryPage";

export const metadata = {
  title: "Library — Ultimate Programming Books",
  description:
    "Browse programming books by language, filter by level, and search by title.",
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
