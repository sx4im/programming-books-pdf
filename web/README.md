# Library web app

Next.js dashboard for **Ultimate Programming Books**.

All dashboard / Vercel config for this UI lives in this folder (`web/`).

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
| `npm run import:docs` | Re-seed `data/books.json` from `../docs/*.md` (keeps existing `author` / `coverImage`) |

## Add or edit a book in the app

Edit [`data/books.json`](data/books.json):

```json
{
  "id": "python-fluent-python",
  "title": "Fluent Python",
  "author": "Luciano Ramalho",
  "language": "python",
  "category": "advanced",
  "edition": "2nd Edition",
  "driveUrl": "https://drive.google.com/file/d/YOUR_ID/view?usp=sharing",
  "coverImage": "https://example.com/cover.jpg"
}
```

- Leave `coverImage` as `""` for a blank cover placeholder.
- Leave `author` as `""` until you know it (UI shows “Author TBA”).
- `driveUrl` is what **Read book** opens.

New contributors can suggest titles via GitHub issues without a link — see the root [CONTRIBUTING.md](../CONTRIBUTING.md).

## Deploy on Vercel

1. Import `sx4im/programming-books-pdf` in Vercel.
2. Set **Root Directory** to `web`.
3. Framework: Next.js (see [`vercel.json`](vercel.json)).
4. Deploy.

## Design

UI follows the Vercel monochrome / Geist system: hairline surfaces, one blue for focus/links, one gradient hero headline, light/dark theme toggle.
