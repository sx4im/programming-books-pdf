import type { Book } from "./types";

/** Book payload safe to send to the browser (no Drive URLs). */
export type PublicBook = Omit<Book, "driveUrl"> & {
  /** True when a Google Drive PDF link is available to open after star-gate. */
  hasDrivePdf: boolean;
};

export function isDrivePdfUrl(url: string | undefined | null): boolean {
  const value = (url || "").trim();
  if (!value) return false;
  try {
    return new URL(value).hostname.toLowerCase() === "drive.google.com";
  } catch {
    return /https?:\/\/drive\.google\.com\//i.test(value);
  }
}


export function toPublicBook(book: Book): PublicBook {
  const { driveUrl, ...rest } = book;
  return {
    ...rest,
    hasDrivePdf: isDrivePdfUrl(driveUrl),
  };
}

export function toPublicBooks(books: Book[]): PublicBook[] {
  return books.map(toPublicBook);
}
