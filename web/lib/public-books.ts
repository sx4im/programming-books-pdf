import type { Book } from "./types";

/** Book payload safe to send to the browser (no Drive URLs). */
export type PublicBook = Omit<Book, "driveUrl">;

export function toPublicBook(book: Book): PublicBook {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip Drive URL from client payload
  const { driveUrl, ...publicBook } = book;
  return publicBook;
}

export function toPublicBooks(books: Book[]): PublicBook[] {
  return books.map(toPublicBook);
}
