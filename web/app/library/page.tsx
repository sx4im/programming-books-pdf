import { Suspense } from "react";
import books from "../../data/books.json";
import type { Book } from "../../lib/types";
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
  return (
    <Suspense fallback={<LibraryFallback />}>
      <LibraryPage books={books as Book[]} />
    </Suspense>
  );
}
