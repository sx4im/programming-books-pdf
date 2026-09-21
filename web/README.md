# Library web app

Next.js dashboard for **Ultimate Programming Books**.

**Live:** [https://freecodebooks.vercel.app/](https://freecodebooks.vercel.app/)  
**Library:** [https://freecodebooks.vercel.app/library](https://freecodebooks.vercel.app/library)

All dashboard / Vercel config lives in this folder (`web/`).

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home — language shelves (pick a language here) |
| `/library?lang=python` | Full library for that language — search, level filters, book details |

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
| `npm run import:docs` | Re-seed `data/books.json` from `../docs/*.md` |
| `npm run validate:links` | Reject placeholder hosts (`example.com`, etc.); require Drive/approved URLs |

## Contributors vs maintainers

- **Contributors** suggest book **titles only** via GitHub issues — never paste Drive or example.com links.
- **Maintainers** attach real `https://drive.google.com/file/d/…` links and run `npm run validate:links`.

## Deploy on Vercel

1. Import the GitHub repo.
2. Set **Root Directory** to `web`.
3. Set environment variables (recommended):
   - `STAR_GATE_SECRET` — long random string used to sign the unlock cookie
   - `GITHUB_TOKEN` — GitHub PAT (raises API rate limits for stargazer checks)
4. Deploy (see [`vercel.json`](vercel.json)).

## Star gate (read access)

Clicking **Read book** opens a modal: star
[`sx4im/programming-books-pdf`](https://github.com/sx4im/programming-books-pdf),
enter your GitHub username, and the server checks the stargazer list.

- Drive URLs are **not** sent to the browser until unlock succeeds.
- Unlock sets an **httpOnly** signed cookie; `/api/books/[id]/read` redirects only when that cookie is valid.
- Inspecting the page or forging a client flag cannot reveal book links.
