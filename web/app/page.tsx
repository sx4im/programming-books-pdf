import books from "../data/books.json";
import type { Book } from "../lib/types";
import { HomePage } from "../components/HomePage";

export default function Page() {
  return <HomePage books={books as Book[]} />;
}
