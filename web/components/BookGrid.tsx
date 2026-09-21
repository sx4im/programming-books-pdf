import type { PublicBook } from "../lib/public-books";
import { BookCard } from "./BookCard";
import styles from "./BookGrid.module.css";

type Props = {
  books: PublicBook[];
};

export function BookGrid({ books }: Props) {
  return (
    <div className={styles.grid}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
