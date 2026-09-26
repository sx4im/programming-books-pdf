import { NextResponse } from "next/server";
import { getBookById } from "../../../../../lib/books-server";
import { isDrivePdfUrl } from "../../../../../lib/public-books";
import { getAccessFromCookies } from "../../../../../lib/star-access";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const access = await getAccessFromCookies();
  if (!access) {
    return NextResponse.json(
      {
        ok: false,
        error: "Star the GitHub repo and verify your username first.",
      },
      { status: 401 },
    );
  }

  const { id } = await params;
  if (!id || id.length > 200) {
    return NextResponse.json(
      { ok: false, error: "Invalid book id." },
      { status: 400 },
    );
  }

  const book = getBookById(id);
  if (!book) {
    return NextResponse.json(
      { ok: false, error: "Book not found." },
      { status: 404 },
    );
  }

  if (!isDrivePdfUrl(book.driveUrl)) {
    return NextResponse.json(
      {
        ok: false,
        error: "No Drive PDF for this title yet. Use Request book to email us.",
      },
      { status: 404 },
    );
  }

  // Never embed the URL in HTML/JSON for anonymous clients — redirect only.
  return NextResponse.redirect(book.driveUrl.trim(), 302);
}
