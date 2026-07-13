# Contributing to Ultimate Programming Books

Thanks for helping improve this curated programming-book index.

## Code of Conduct

By participating, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- **Suggest a book by title** (link optional — maintainers find and attach the Drive file)
- Report a broken, redirected, or outdated link
- Improve categorization (Beginner / Intermediate / Advanced / Specialized / References)
- Clarify docs or FAQ answers
- Enrich the library app (`web/data/books.json`) with authors and cover image URLs

## Suggest a book (easiest for new contributors)

You do **not** need a Google Drive link.

1. Open a [book suggestion issue](.github/ISSUE_TEMPLATE/book-suggestion.yml).
2. Fill in:
   - Language
   - Skill level
   - Book title
   - Author (if you know it)
   - Edition (optional)
   - Why it belongs in the list
3. Maintainers look up the book, upload/host the public Drive share if appropriate, and add it to [`docs/`](docs/) + [`web/data/books.json`](web/data/books.json).

Optional: if you already have a working public Drive or official docs URL, include it — that speeds things up. It is never required.

## Link policy (for PRs that add or change URLs)

This project’s books are primarily shared via **public Google Drive links** maintained by the repository owner.

**Acceptable links**

- Public Google Drive (or similar cloud) share links for books in this collection
- Official documentation and language manuals
- Author- or publisher-hosted free editions
- Stable publisher or product pages when a Drive file is not available yet

**Not acceptable**

- Placeholder URLs (`PDF_LINK`, empty `()` links)
- Broken or private (non-public) cloud links
- Unrelated third-party dump sites
- Tracking-heavy short links when a canonical URL exists

Do **not** replace working public Google Drive share links unless the Drive link is broken or a maintainer asks for a change.

## Library web app

Everything for the dashboard lives under [`web/`](web/) (including [`web/vercel.json`](web/vercel.json) for deploy). Catalog data: [`web/data/books.json`](web/data/books.json).

To update an entry in the dashboard (maintainers / advanced contributors):

1. Edit `web/data/books.json` (or run `npm run import:docs` inside `web/` after updating Markdown).
2. Set `driveUrl` to the public Google Drive share.
3. Optionally set `author` and `coverImage`. Leave blank for placeholders.
4. Categories: `beginner` | `intermediate` | `advanced` | `specialized` | `references`.

See [`web/README.md`](web/README.md) for local run and Vercel notes (set Root Directory to `web`).

## Entry format (Markdown docs)

When a maintainer (or a PR that already has a URL) adds an entry under [`docs/`](docs/):

```markdown
- [**Book Title**](https://drive.google.com/...) (*Edition or note*)
```

Rules:

1. Place the entry in the right skill-level section.
2. Prefer the maintainer’s public Drive share when available.
3. Keep titles accurate; include edition when known.
4. Do not duplicate a title on the same language page.
5. One resource per bullet.

## Pull request checklist

- [ ] Book suggestions via issue are fine without a link
- [ ] If this PR adds/changes a URL, it follows the link policy
- [ ] Entry is in the correct language file and section (when editing docs)
- [ ] No duplicate titles on the same page
- [ ] Markdown renders correctly

## Issue templates

- Book suggestion → `.github/ISSUE_TEMPLATE/book-suggestion.yml`
- Broken link → `.github/ISSUE_TEMPLATE/broken-link.yml`
- General → `.github/ISSUE_TEMPLATE/general.yml`

## Local checks (optional)

```bash
npx markdownlint-cli2 "**/*.md"
npx lychee --offline README.md docs/**/*.md
```

CI runs markdown lint, link checks, and spellcheck on pull requests.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE) covering this repository’s documentation and curation.
