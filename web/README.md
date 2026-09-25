# Library web app

Next.js dashboard for **Ultimate Programming Books** — the searchable UI over the curated programming-book catalog.

**Live:** [https://freecodebooks.vercel.app/](https://freecodebooks.vercel.app/)  
**Library:** [https://freecodebooks.vercel.app/library](https://freecodebooks.vercel.app/library)

All dashboard / Vercel config lives in this folder (`web/`). Repository landing page: [../README.md](../README.md).

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home — language shelves (pick a language here) |
| `/library?lang=python` | Full library for that language — search, level filters, book details |
| `/robots.txt` | Crawler rules (generated) |
| `/sitemap.xml` | Sitemap for home, library, and language shelves (generated) |
| `/opengraph-image` | Social / Open Graph preview image (generated) |

There is **no language chip bar** on `/library`. Change language via **← Change language** (back to home shelves).

## Run locally

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run import:docs` | Sync titles/categories from `../docs/*.md` (keeps existing `driveUrl`) |
| `npm run validate:links` | Reject placeholder hosts (`example.com`, etc.); require Drive/approved URLs |

## Contributors vs maintainers

- **Contributors** suggest book **titles only** via GitHub issues — never paste Drive or example.com links.
- **Maintainers** set `driveUrl` in `data/books.json` only (not in `docs/` Markdown) and run `npm run validate:links`.
- Readers open books on the **live site** only — public Markdown lists titles, not download links.

## Deploy on Vercel

1. Import the GitHub repo.
2. Set **Root Directory** to `web`.
3. Set environment variables:
   - `STAR_GATE_SECRET` — long random string used to sign the unlock cookie (**required** in production)
   - `GITHUB_TOKEN` — GitHub PAT (recommended; raises rate limits and unlocks the stargazer-list API)
4. Deploy (see [`vercel.json`](vercel.json)).

## Star gate (read access)

Clicking **Read book** opens a modal: star
[`sx4im/programming-books-pdf`](https://github.com/sx4im/programming-books-pdf),
enter your GitHub username, and the server checks the stargazer list.

- Drive URLs are **not** sent to the browser until unlock succeeds.
- Unlock is **per page visit**: a refresh clears access and asks for the username again.
- A short-lived **httpOnly** cookie is set only so `/api/books/[id]/read` can redirect after verify.
- Inspecting the page or forging a client flag cannot reveal book links.
