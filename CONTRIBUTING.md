# Contributing to Ultimate Programming Books

Thanks for helping improve this curated programming-book index.

## Code of Conduct

By participating, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- **Suggest a book by title only** (no links — maintainers add PDFs in the library app)
- Report a broken library link via the issue template
- Improve categorization or docs clarity
- Enrich the library app (`web/data/books.json`) with `author` / `coverImage` (maintainers)

## Suggest a book (for all contributors)

**Do not submit Google Drive links, example.com links, or any download URLs.**

1. Open a [book suggestion issue](.github/ISSUE_TEMPLATE/book-suggestion.yml).
2. Provide:
   - Language
   - Skill level
   - Book title
   - Author (if known)
   - Edition (optional)
   - Why it belongs
3. Maintainers find the book, upload a **public Google Drive PDF**, and add it to [`web/data/books.json`](web/data/books.json). Optionally mirror the **title only** (no URL) under [`docs/`](docs/).

Fake or placeholder URLs (`https://example.com`, `PDF_LINK`, empty links) are rejected by validation.

## Where readers open books

Readers use **only** the live library: [https://freecodebooks.vercel.app/](https://freecodebooks.vercel.app/).

Do **not** put Drive, publisher, or download URLs in README or `docs/*.md`. Those files list titles and point people to the site.

## Link policy (maintainers only)

Book URLs live **only** in [`web/data/books.json`](web/data/books.json) (`driveUrl`), never in public Markdown guides.

**Required for PDF books**

- Public `https://drive.google.com/file/d/…` (or `docs.google.com`) share link that opens the correct title

**Also allowed for reference / official docs**

- Official language documentation hosts (MDN, rust-lang.org docs, etc.)

**Never allowed**

- `example.com` / `example.org` / localhost / other placeholders
- Empty `()`, `PDF_LINK`, `#`
- Random third-party dump sites
- Contributor-submitted unverified download links
- Drive / download URLs in `docs/` or README

Validate before merge:

```bash
cd web && npm run validate:links
```

## Library web app

Dashboard code and Vercel config live under [`web/`](web/). Catalog: [`web/data/books.json`](web/data/books.json).

Maintainer fields:

- `driveUrl` — must pass `npm run validate:links`
- `author` / `coverImage` — optional; leave `""` for placeholders

```bash
cd web
npm run import:docs      # sync titles/categories from docs/*.md (keeps existing driveUrl/author/cover)
npm run validate:links   # reject placeholders / invalid hosts
npm run dev
```

Set Vercel **Root Directory** to `web`.

## Entry format (Markdown — titles only)

```markdown
- **Book Title** (*Edition*)
```

Rules:

1. Correct skill-level section
2. Accurate title + edition — **no URL**
3. No duplicates on the same page
4. Point readers to `https://freecodebooks.vercel.app/library?lang=…`

## Pull request checklist

- [ ] Contributors suggested **titles only** (no links in issues/PRs from new contributors)
- [ ] Any URL added by maintainers is in `web/data/books.json` and passes `npm run validate:links`
- [ ] `docs/` and README have **no** Drive/download book links
- [ ] Correct language + section when editing docs
- [ ] No duplicate titles
- [ ] Markdown renders correctly

## Issue templates

- Book suggestion (title only)
- Broken link
- General

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
