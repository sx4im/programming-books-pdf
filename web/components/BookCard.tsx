"use client";

import { useState } from "react";
import type { PublicBook } from "../lib/public-books";
import { CATEGORIES } from "../lib/types";
import { coverSrcForBook } from "../lib/covers";
import { LANGUAGES } from "../data/languages";
import { BookCover } from "./BookCover";
import { StarGateModal } from "./StarGateModal";
import { useStarAccess } from "./StarAccessProvider";
import styles from "./BookCard.module.css";

type Props = {
  book: PublicBook;
};

function categoryLabel(id: PublicBook["category"]): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function openBook(bookId: string) {
  // Server checks the httpOnly access cookie before redirecting.
  window.location.assign(`/api/books/${encodeURIComponent(bookId)}/read`);
}

export function BookCard({ book }: Props) {
  const author = book.author?.trim() || "Author TBA";
  const language =
    LANGUAGES.find((l) => l.id === book.language)?.label ?? book.language;
  const level = categoryLabel(book.category);
  const coverSrc = coverSrcForBook(book);
  const { ready, unlocked, ensureAccessCookie } = useStarAccess();
  const [gateOpen, setGateOpen] = useState(false);
  const [opening, setOpening] = useState(false);

  async function onReadClick() {
    if (unlocked) {
      setOpening(true);
      const ok = await ensureAccessCookie();
      setOpening(false);
      if (ok) {
        openBook(book.id);
        return;
      }
      // Star may have been removed — ask again.
      setGateOpen(true);
      return;
    }
    setGateOpen(true);
  }

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

      <button
        type="button"
        className={styles.read}
        onClick={() => void onReadClick()}
        disabled={!ready || opening}
        aria-haspopup="dialog"
      >
        {!ready ? "Loading…" : opening ? "Opening…" : "Read book"}
      </button>

      <StarGateModal
        open={gateOpen}
        bookTitle={book.title}
        onClose={() => setGateOpen(false)}
        onUnlocked={() => {
          setGateOpen(false);
          openBook(book.id);
        }}
      />
    </article>
  );
}
