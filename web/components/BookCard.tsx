import type { Book } from "../lib/types";
import { CATEGORIES } from "../lib/types";
import { coverSrcForBook } from "../lib/covers";
import { LANGUAGES } from "../data/languages";
import { BookCover } from "./BookCover";
import styles from "./BookCard.module.css";

type Props = {
  book: Book;
};

function categoryLabel(id: Book["category"]): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function BookCard({ book }: Props) {
  const author = book.author?.trim() || "Author TBA";
  const language =
    LANGUAGES.find((l) => l.id === book.language)?.label ?? book.language;
  const level = categoryLabel(book.category);
  const coverSrc = coverSrcForBook(book);

  return (
    <article className={styles.card}>
      <div className={styles.coverWrap}>
        <BookCover src={coverSrc} title={book.title} />
      </div>

      <div className={styles.meta}>
        <div className={styles.badges}>
          <span className={styles.badge}>{level}</span>
          <span className={styles.badgeMuted}>{language}</span>
        </div>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{author}</p>
        {book.edition ? (
          <p className={styles.edition}>{book.edition}</p>
        ) : null}
      </div>

      <a
        className={styles.read}
        href={book.driveUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Read book
      </a>
    </article>
  );
}
