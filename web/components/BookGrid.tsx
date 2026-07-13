import type { Book } from "../lib/types";
import { BookCard } from "./BookCard";
import styles from "./BookGrid.module.css";

type Props = {
  books: Book[];
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
