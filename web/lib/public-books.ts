import type { Book } from "./types";

/** Book payload safe to send to the browser (no Drive URLs). */
export type PublicBook = Omit<Book, "driveUrl">;

export function toPublicBook(book: Book): PublicBook {
  const { driveUrl: _driveUrl, ...publicBook } = book;
  return publicBook;
}

export function toPublicBooks(books: Book[]): PublicBook[] {
  return books.map(toPublicBook);
}
