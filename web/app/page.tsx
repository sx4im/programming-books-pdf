import { getAllBooks } from "../lib/books-server";
import { toPublicBooks } from "../lib/public-books";
import { HomePage } from "../components/HomePage";

export default function Page() {
  return <HomePage books={toPublicBooks(getAllBooks())} />;
}
