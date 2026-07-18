import type { Book } from "./types";

/** Shared cover art for documentation / reference entries. */
export const REFERENCE_COVER_SRC = "/covers/reference.svg";

const REFERENCE_EDITION =
  /\b(online resource|official reference|official language)\b/i;

const REFERENCE_TITLE =
  /\b(documentation|\bdocs\b|language reference|style guide|reference manual|\bmdn\b|hexdocs|\bwiki\b)\b/i;

/** Published books tagged Online Resource that should keep a real cover. */
const PUBLISHED_ONLINE_EXCEPTIONS = new Set([
  "Scala with Cats",
  "Zionomicon",
  "Creating Solid APIs with Lua",
  "Functional Programming for Mortals with Scalaz",
]);

export function isReferenceCoverBook(
  book: Pick<Book, "category" | "edition" | "title">,
): boolean {
  if (PUBLISHED_ONLINE_EXCEPTIONS.has(book.title)) return false;
  // Real published "references" (Nutshell, Pocket Reference, etc.) keep
  // their coverImage when it is a normal http(s) URL. Only force the SVG
  // for docs/online resources or when no real cover is set.
  if (REFERENCE_EDITION.test(book.edition || "")) return true;
  if (REFERENCE_TITLE.test(book.title || "")) return true;
  if (book.category === "references") return true;
  return false;
}

export function coverSrcForBook(book: Book): string {
  const src = book.coverImage?.trim() || "";
  // Always prefer an explicit remote cover when present.
  if (/^https?:\/\//i.test(src)) return src;
  if (isReferenceCoverBook(book)) return REFERENCE_COVER_SRC;
  return src;
}
