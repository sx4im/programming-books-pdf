import { getAllBooks } from "../lib/books-server";
import { HomePage } from "../components/HomePage";

export default function Page() {
  const books = getAllBooks();
  const counts: Record<string, number> = {};
  for (const book of books) {
    counts[book.language] = (counts[book.language] ?? 0) + 1;
  }
  return <HomePage bookCount={books.length} counts={counts} />;
}
