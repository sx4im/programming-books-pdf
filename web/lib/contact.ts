/** Inbox for “request this book” mailto links (no Drive PDF yet). */
export const REQUEST_BOOK_EMAIL = "saimshafique.dev@gmail.com";

export function requestBookMailto(bookTitle: string): string {
  const subject = `Book request: ${bookTitle}`;
  const body = `I need this "${bookTitle}"`;
  return `mailto:${REQUEST_BOOK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
