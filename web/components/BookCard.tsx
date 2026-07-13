import type { Book } from "../lib/types";
import styles from "./BookCard.module.css";

type Props = {
  book: Book;
};

export function BookCard({ book }: Props) {
  const hasCover = Boolean(book.coverImage?.trim());
  const author = book.author?.trim() || "Author TBA";

  return (
    <article className={styles.card}>
      <div className={styles.coverWrap}>
        {hasCover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.cover}
            src={book.coverImage}
            alt=""
            loading="lazy"
          />
        ) : (
          <div className={styles.blank} aria-hidden>
            <span className={styles.blankSpine} />
            <span className={styles.blankLabel}>Cover</span>
          </div>
        )}
      </div>

      <div className={styles.meta}>
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
