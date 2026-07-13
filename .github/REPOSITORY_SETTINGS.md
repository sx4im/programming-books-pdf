# Recommended GitHub repository settings

The cloud agent token could not update repository metadata (HTTP 403). Apply these settings in **GitHub → Settings → General** (or via an owner-authenticated `gh` session).

## About

| Field | Recommended value |
| --- | --- |
| **Description** | `Curated programming books for 20+ languages — beginner to advanced. Python, JavaScript, Rust, Go, Java, and more.` |
| **Website** | `https://sx4im.github.io/programming-books-pdf/` (after Pages is enabled) or `https://github.com/sx4im/programming-books-pdf` until then |
| **Releases** | Optional dated tags such as `2026.07` when the catalog changes substantially |

## Topics (≤ 20)

```text
awesome-list
programming-books
ebooks
education
learning-resources
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
developer-resources
```

Optional extras if you trim others: `books`, `r`, `julia`, `elixir`, `scala`, `php`, `dart`, `ruby`.

## GitHub Pages

1. Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `main` / folder: `/docs`

Or enable via API with an owner token:

```bash
gh api -X POST repos/sx4im/programming-books-pdf/pages \
  -f build_type=legacy \
  -f source[branch]=main \
  -f source[path]=/docs
```

## Social preview

Add a 1280×640 Open Graph image under Settings → Social preview for better share cards.
