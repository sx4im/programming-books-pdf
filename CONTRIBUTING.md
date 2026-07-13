# Contributing to Ultimate Programming Books

Thanks for helping improve this curated programming-book index.

## Code of Conduct

By participating, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- **Suggest a book by title only** (no links — maintainers attach Google Drive PDFs)
- Report a broken or outdated Drive link
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
3. Maintainers find the book, upload a **public Google Drive PDF**, and add it to [`docs/`](docs/) + [`web/data/books.json`](web/data/books.json).

Fake or placeholder URLs (`https://example.com`, `PDF_LINK`, empty links) are rejected by validation.

## Link policy (maintainers only)

When adding or fixing a book URL:

**Required for PDF books**

- Public `https://drive.google.com/file/d/…` (or `docs.google.com`) share link that opens the correct title

**Also allowed for reference / official docs**

- Official language documentation hosts (MDN, rust-lang.org docs, etc.)

**Never allowed**

- `example.com` / `example.org` / localhost / other placeholders
- Empty `()`, `PDF_LINK`, `#`
- Random third-party dump sites
- Contributor-submitted unverified download links

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
npm run import:docs      # sync from docs/*.md (keeps author/cover)
npm run validate:links   # reject placeholders / invalid hosts
npm run dev
```

Set Vercel **Root Directory** to `web`.

## Entry format (Markdown — maintainers)

```markdown
- [**Book Title**](https://drive.google.com/file/d/FILE_ID/view?usp=sharing) (*Edition*)
```

Rules:

1. Correct skill-level section
2. Real Drive (or approved docs) URL — never example.com
3. Accurate title + edition
4. No duplicates on the same page

## Pull request checklist

- [ ] Contributors suggested **titles only** (no links in issues/PRs from new contributors)
- [ ] Any URL added by maintainers passes `npm run validate:links`
- [ ] Correct language + section when editing docs
- [ ] No duplicate titles
- [ ] Markdown renders correctly

## Issue templates

- Book suggestion (title only)
- Broken link
- General

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
