# Recommended GitHub repository settings

The automation token cannot update repository metadata (HTTP 403). Apply these in **GitHub → Settings → General** (About), or with an **owner-authenticated** `gh` session.

## About

| Field | Recommended value |
| --- | --- |
| **Description** | `Curated programming books for 32 languages — beginner to advanced. Searchable library for Python, JavaScript, Rust, Go, and more.` |
| **Website** | `https://freecodebooks.vercel.app/` |
| **Releases** | Optional dated tags such as `2026.09` when the catalog changes substantially |

### Description candidates (pick one)

1. **Preferred:** `Curated programming books for 32 languages — beginner to advanced. Searchable library for Python, JavaScript, Rust, Go, and more.`
2. `670+ programming books organized by language and skill level, with a searchable web library.`
3. `Language-first programming book catalog: Markdown guides + live library for 32 languages.`

Avoid vague or engagement-bait descriptions (for example “star repo to get programming-books”).

## Topics (≤ 20)

Replace misleading topics such as `javascript-library` (this repo is not a JS library).

```text
programming-books
ebooks
coding-books
books
education
learning-resources
developer-resources
awesome-list
computer-science
python
javascript
typescript
java
csharp
cpp
golang
rust
kotlin
swift
sql
```

Optional swaps if you need room for another language: `php`, `dart`, `haskell`, `solidity`, `zig`.

### Owner CLI

```bash
gh repo edit sx4im/programming-books-pdf \
  --description "Curated programming books for 32 languages — beginner to advanced. Searchable library for Python, JavaScript, Rust, Go, and more." \
  --homepage "https://freecodebooks.vercel.app/"

gh repo edit sx4im/programming-books-pdf \
  --add-topic programming-books \
  --add-topic ebooks \
  --add-topic coding-books \
  --add-topic books \
  --add-topic education \
  --add-topic learning-resources \
  --add-topic developer-resources \
  --add-topic awesome-list \
  --add-topic computer-science \
  --add-topic python \
  --add-topic javascript \
  --add-topic typescript \
  --add-topic java \
  --add-topic csharp \
  --add-topic cpp \
  --add-topic golang \
  --add-topic rust \
  --add-topic kotlin \
  --add-topic swift \
  --add-topic sql
```

Then remove inaccurate topics in the UI (or with `gh api`) if they remain: `javascript-library`, `developer-resource`, `learning-resource`.

## GitHub Pages

Docs are already Jekyll-ready under `docs/` (`_config.yml` + `jekyll-seo-tag` / `jekyll-sitemap`).

1. Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `main` / folder: `/docs`

```bash
gh api -X POST repos/sx4im/programming-books-pdf/pages \
  -f build_type=legacy \
  -f source[branch]=main \
  -f source[path]=/docs
```

## Social preview

1. Convert [`docs/assets/social-preview.svg`](../docs/assets/social-preview.svg) to PNG (1280×640), or screenshot the live OG image at `/opengraph-image`.
2. Upload under **Settings → Social preview**.

The live site also generates Open Graph images via `web/app/opengraph-image.tsx`.
