# Library web app

Next.js dashboard for **Ultimate Programming Books**.

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

## Add or edit a book

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

## Deploy (Vercel)

### Option A — whole GitHub repo (recommended)

1. Import `sx4im/programming-books-pdf` in Vercel.
2. Leave Root Directory empty (repo root). Root [`vercel.json`](../vercel.json) builds the `web/` Next.js app.
3. Deploy.

### Option B — Root Directory = `web`

1. Import the repo in Vercel.
2. Set **Root Directory** to `web`.
3. [`web/vercel.json`](vercel.json) handles install/build.

## Design

UI follows the Vercel monochrome / Geist system: hairline surfaces, one blue for focus/links, one gradient hero headline, light/dark theme toggle.
