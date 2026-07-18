import type { Book } from "./types";

/** Shared cover art for documentation / reference entries. */
export const REFERENCE_COVER_SRC = "/covers/reference.svg";

const REFERENCE_EDITION =
  /\b(online resource|official reference|official language)\b/i;

const REFERENCE_TITLE =
  /\b(documentation|\bdocs\b|language reference|style guide|reference manual|\bmdn\b|hexdocs|\bwiki\b)\b/i;

/** Published books that are tagged Online Resource but should keep a real cover. */
const PUBLISHED_ONLINE_EXCEPTIONS = new Set([
  "Scala with Cats",
  "Zionomicon",
  "Creating Solid APIs with Lua",
  "Functional Programming for Mortals with Scalaz",
]);

export function isReferenceCoverBook(
  book: Pick<Book, "category" | "edition" | "title">,
): boolean {
  if (book.category === "references") return true;
  if (PUBLISHED_ONLINE_EXCEPTIONS.has(book.title)) return false;
  if (REFERENCE_EDITION.test(book.edition || "")) return true;
  if (REFERENCE_TITLE.test(book.title || "")) return true;
  return false;
}

export function coverSrcForBook(book: Book): string {
  if (isReferenceCoverBook(book)) return REFERENCE_COVER_SRC;
  return book.coverImage?.trim() || "";
}
