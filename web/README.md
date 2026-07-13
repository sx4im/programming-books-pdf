# Library web app

Next.js dashboard for **Ultimate Programming Books**.

**Live:** [https://programming-books-pdf.vercel.app/](https://programming-books-pdf.vercel.app/)  
**Library:** [https://programming-books-pdf.vercel.app/library](https://programming-books-pdf.vercel.app/library)

All dashboard / Vercel config lives in this folder (`web/`).

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home — pick a language shelf |
| `/library` | Full library — search, language chips, category filters, books |

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
3. Deploy (see [`vercel.json`](vercel.json)).
