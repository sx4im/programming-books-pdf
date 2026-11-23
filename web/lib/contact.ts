/** Inbox for “request this book” mailto links (no Drive PDF yet). */
export const REQUEST_BOOK_EMAIL = "saimshafique.dev@gmail.com";

function mailto(subject: string, body: string): string {
  return `mailto:${REQUEST_BOOK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function requestBookMailto(bookTitle: string): string {
  return mailto(`Book request: ${bookTitle}`, `I need this "${bookTitle}"`);
}

/** Request a title that is not in the catalog yet. */
export function requestAnyBookMailto(languageLabel: string, title: string): string {
  return title
    ? mailto(
        `Book request: ${title}`,
        `Please add "${title}" to the ${languageLabel} shelf.`,
      )
    : mailto(
        `Book request (${languageLabel})`,
        `Please add this ${languageLabel} book:\n\nTitle:\nAuthor:`,
      );
}
