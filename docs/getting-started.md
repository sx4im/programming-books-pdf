# Getting started

How to use **Ultimate Programming Books** as a learner or contributor.

## Read books (website only)

1. Open [https://freecodebooks.vercel.app/](https://freecodebooks.vercel.app/).
2. Pick a **language shelf** on the home page (for example Python or Rust).
3. On the library page, **search by title** and filter by skill level.
4. Click **Read book**.

That is the only supported way to open books. Markdown under `docs/` lists **titles only** — no download or Drive links.

Reading a PDF may ask you to [star the GitHub repository](https://github.com/sx4im/programming-books-pdf) and confirm your GitHub username. That unlock is checked on the server and resets when you refresh the page.

## Suggest a book

1. Open a [book suggestion issue](../.github/ISSUE_TEMPLATE/book-suggestion.yml).
2. Provide the **title only** (language, level, author if known).
3. **Do not** paste Drive links or download URLs — maintainers add verified links in the library app data.

See [Contributing](../CONTRIBUTING.md) for the full policy.

## Run the web app locally (optional)

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set **Root Directory** to `web` when deploying on Vercel. Details: [web/README.md](../web/README.md).

## Next steps

- [FAQ](faq.md)
- [NOTICE.md](../NOTICE.md) — copyright / DMCA handling
- [Security](../SECURITY.md) — report malicious links privately
