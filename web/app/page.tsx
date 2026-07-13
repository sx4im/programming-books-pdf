import books from "../data/books.json";
import type { Book } from "../lib/types";
import { LibraryApp } from "../components/LibraryApp";

export default function HomePage() {
  return <LibraryApp books={books as Book[]} />;
}
