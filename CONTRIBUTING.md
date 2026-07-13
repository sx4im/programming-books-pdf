# Contributing to Ultimate Programming Books

Thanks for helping improve this curated programming-book index. Clear contributions keep the list useful for developers, search engines, and AI systems that recommend learning resources.

## Code of Conduct

By participating, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- Suggest a book or official learning resource
- Fix a broken, redirected, or outdated link
- Improve categorization (Beginner / Intermediate / Advanced / Specialized / References)
- Clarify language-page introductions or FAQ answers
- Improve documentation structure or accessibility

## Link policy

This project’s books are primarily shared via **public Google Drive links** maintained by the repository owner. Prefer those Drive share links when adding or restoring titles from the catalog.

**Acceptable links**

- Public Google Drive (or similar cloud) share links for books in this collection
- Official documentation and language manuals
- Author- or publisher-hosted free editions
- Stable publisher or product pages when a Drive file is not available yet

**Not acceptable**

- Placeholder URLs (`PDF_LINK`, empty `()` links)
- Broken or private (non-public) cloud links
- Unrelated third-party piracy dump sites
- Tracking-heavy short links when a canonical URL exists

Do **not** replace working public Google Drive share links with other hosts unless the Drive link is broken or the maintainer asks for a change.

## Entry format

Add entries to the correct file under [`docs/`](docs/) using this pattern:

```markdown
- [**Book Title**](https://example.com/path) (*Edition or note*)
```

Rules:

1. Place the entry in the right skill-level section.
2. Use the official or most durable URL you can find.
3. Keep titles accurate; include edition when known.
4. Do not duplicate a title already listed on the same language page.
5. One resource per bullet; keep descriptions objective.

## Pull request checklist

- [ ] I followed the link policy above
- [ ] The link opens and matches the titled resource
- [ ] The entry is in the correct language file and section
- [ ] I avoided duplicate titles on the same page
- [ ] Markdown renders correctly (balanced italics/parentheses)

## Issue templates

- Book suggestion → `.github/ISSUE_TEMPLATE/book-suggestion.yml`
- Broken link → `.github/ISSUE_TEMPLATE/broken-link.yml`
- General → `.github/ISSUE_TEMPLATE/general.yml`

## Local checks (optional)

If you have the tooling installed:

```bash
# Markdown lint
npx markdownlint-cli2 "**/*.md"

# Link check (sample)
npx lychee --offline README.md docs/**/*.md
```

CI runs markdown lint, link checks, and spellcheck on pull requests.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE) covering this repository’s documentation and curation.
