# Repository SEO & Discoverability Audit

**Repository:** [sx4im/programming-books-pdf](https://github.com/sx4im/programming-books-pdf)
**Display name:** Ultimate Programming Books
**Audit date:** 2026-09-21
**Live site:** [https://freecodebooks.vercel.app/](https://freecodebooks.vercel.app/)

---

## Project identity

| Field | Value |
| --- | --- |
| **What** | Curated index of programming books/ebooks + searchable Next.js library |
| **Problem** | Language learning paths and book lists are scattered across the web |
| **Users** | Students, self-taught developers, mentors, bootcamps |
| **Stack** | Markdown `docs/`, Next.js 15 `web/`, Vercel, Google Drive links |
| **Category** | Awesome-list / education / developer learning resources |
| **Differentiators** | Skill-level paths per language + live searchable UI (vs list-only repos) |

## Search intent

**Primary:** `programming books` / `programming ebooks` by language

**Secondary:** `python programming books`, `javascript books pdf`, `learn rust books`, `coding reading list`, `beginner to advanced programming books`, `free code books library`, `programming books github`

## Priority findings

### P0

- GitHub **About description** is engagement-bait: `star repo to get programming-books` (hurts clarity in search results)
- Topic `javascript-library` is **incorrect** (this is not a JS library)

### P1

- No site `robots.txt` / `sitemap.xml` (fixed in `web/app`)
- No Open Graph image route (fixed)
- No JSON-LD on the live site (fixed)
- GitHub Pages not enabled despite `docs/_config.yml`
- No custom GitHub social preview image

### P2

- README H1 could name the offer more clearly (improved)
- Getting-started doc for onboarding search intents (added)
- CI badges missing from README (added)

### P3

- Optional dated releases when catalog changes
- External tutorials / community posts (human action)

## Competitor patterns (do not copy)

| Project | Communicates well | Lesson for this repo |
| --- | --- | --- |
| EbookFoundation/free-programming-books | Clear “freely available” positioning + search site | Keep honest legal framing; differentiate with skill paths + UI |
| mikhailkhorokhorin/developer-library | Simple category README | Keep scannable language entry points |
| roadmap.sh | Audience clarity | Maintain “who this is for” + quick start |

## GitHub metadata (owner action required)

Automation cannot PATCH About/topics (HTTP 403). Apply [`.github/REPOSITORY_SETTINGS.md`](.github/REPOSITORY_SETTINGS.md).

**Recommended description:**
`Curated programming books for 32 languages — beginner to advanced. Searchable library for Python, JavaScript, Rust, Go, and more.`

**Homepage (already set):** `https://freecodebooks.vercel.app/`

## Validation

After this pass, run:

```bash
cd web && npm run lint && npm run build
npx --yes markdownlint-cli2 "**/*.md" "!REPORT.md"
git diff --check
```

## Rename recommendation (not executed)

```text
Current: programming-books-pdf
Proposed: (none — keep)
Reason: Name already matches primary search intent (programming books + pdf)
Potential risks: Rename would break stars, forks, clones, and inbound links
```
