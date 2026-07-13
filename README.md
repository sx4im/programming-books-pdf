# Ultimate Programming Books

**Curated programming books and ebooks for 20+ languages** — Python, JavaScript, Java, C#, C/C++, TypeScript, Go, Rust, and more — organized from beginner to advanced.

Browse the live library, pick a language, filter by skill level, search by title, and open public Google Drive links to read.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Languages](https://img.shields.io/badge/Languages-20-blue)](#languages)
[![Books](https://img.shields.io/badge/Books-469%2B-9cf)](web/data/books.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub stars](https://img.shields.io/github/stars/sx4im/programming-books-pdf?style=social)](https://github.com/sx4im/programming-books-pdf)

[Library](https://programming-books-pdf.vercel.app/)  · [Docs](docs/index.md) · [FAQ](docs/faq.md) · [Contribute](CONTRIBUTING.md)

---

## Why this repository

Developers searching for **programming books**, **learning paths**, and **language-specific reading lists** often land on scattered links. This project is a single, maintained catalog:

- **20 programming languages** with beginner → advanced paths  
- **469+ curated titles** (Drive PDFs + official docs where useful)  
- A **searchable web library** so you can find a book by name in seconds  
- Clear contribution flow: suggest a title; maintainers attach Drive links  

If this helps you learn, please **[star the repo](https://github.com/sx4im/programming-books-pdf)** — it helps more developers discover it on GitHub and in search.

---

## Quick start

1. **Use the live dashboard (recommended)**  
   Open **[https://programming-books-pdf.vercel.app/](https://programming-books-pdf.vercel.app/)**  
   - Home: choose a **language shelf**  
   - That opens the [library](https://programming-books-pdf.vercel.app/library) for that language — search by book name, filter by level, click **Read book**

2. **Browse Markdown guides on GitHub**  
   Start from [`docs/`](docs/) (for example [Python](docs/python.md), [JavaScript](docs/javascript.md), [Rust](docs/rust.md)).

3. **Suggest a book**  
   Open a [book suggestion](.github/ISSUE_TEMPLATE/book-suggestion.yml) with the **title only** (no links). Maintainers attach a valid Google Drive PDF.

4. **Run the app locally (optional)**  
   ```bash
   cd web && npm install && npm run dev
   ```

Each language guide is organized: **Beginner → Intermediate → Advanced → Specialized → References**.

---

## Contents

- [Why this repository](#why-this-repository)
- [Quick start](#quick-start)
- [Languages](#languages)
- [How the library works](#how-the-library-works)
- [Who this is for](#who-this-is-for)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)
- [Related resources](#related-resources)

---

## Languages

Click a badge for the GitHub guide, or open the same language in the [live library](https://programming-books-pdf.vercel.app/library).

<p align="center">
<a href="docs/python.md"><img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python programming books"/></a>
<a href="docs/javascript.md"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript programming books"/></a>
<a href="docs/java.md"><img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java programming books"/></a>
<a href="docs/csharp.md"><img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white" alt="C# programming books"/></a>
<a href="docs/c.md"><img src="https://img.shields.io/badge/C-00599C?style=for-the-badge&logo=c&logoColor=white" alt="C programming books"/></a>
<a href="docs/cpp.md"><img src="https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=cplusplus&logoColor=white" alt="C++ programming books"/></a>
<a href="docs/typescript.md"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript programming books"/></a>
<a href="docs/go.md"><img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go programming books"/></a>
<a href="docs/rust.md"><img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust programming books"/></a>
<a href="docs/php.md"><img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP programming books"/></a>
<a href="docs/kotlin.md"><img src="https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white" alt="Kotlin programming books"/></a>
<a href="docs/sql.md"><img src="https://img.shields.io/badge/SQL-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQL programming books"/></a>
<a href="docs/swift.md"><img src="https://img.shields.io/badge/Swift-F05138?style=for-the-badge&logo=swift&logoColor=white" alt="Swift programming books"/></a>
<a href="docs/ruby.md"><img src="https://img.shields.io/badge/Ruby-CC342D?style=for-the-badge&logo=ruby&logoColor=white" alt="Ruby programming books"/></a>
<a href="docs/dart.md"><img src="https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white" alt="Dart programming books"/></a>
<a href="docs/scala.md"><img src="https://img.shields.io/badge/Scala-DC322F?style=for-the-badge&logo=scala&logoColor=white" alt="Scala programming books"/></a>
<a href="docs/elixir.md"><img src="https://img.shields.io/badge/Elixir-4B275F?style=for-the-badge&logo=elixir&logoColor=white" alt="Elixir programming books"/></a>
<a href="docs/shell.md"><img src="https://img.shields.io/badge/Bash-4EAA25?style=for-the-badge&logo=gnubash&logoColor=white" alt="Bash shell programming books"/></a>
<a href="docs/r.md"><img src="https://img.shields.io/badge/R-276DC3?style=for-the-badge&logo=r&logoColor=white" alt="R programming books"/></a>
<a href="docs/julia.md"><img src="https://img.shields.io/badge/Julia-9558B2?style=for-the-badge&logo=julia&logoColor=white" alt="Julia programming books"/></a>
</p>

<details>
<summary><strong>Catalog snapshot</strong> (book counts by language)</summary>

<br/>

```text
Python ........ 57    JavaScript .... 51    Java .......... 50
C# ............ 39    C ............. 30    C++ ........... 21
TypeScript .... 17    Go ............ 19    Rust .......... 21
PHP ........... 19    Kotlin ........ 17    SQL ........... 19
Swift ......... 19    Ruby .......... 24    Dart .......... 18
Scala .........  9    Elixir ........  6    Shell .........  8
R ............. 17    Julia .........  8
```

</details>

Popular entry points in the live app:

- [Python books](https://programming-books-pdf.vercel.app/library?lang=python)
- [JavaScript books](https://programming-books-pdf.vercel.app/library?lang=javascript)
- [Java books](https://programming-books-pdf.vercel.app/library?lang=java)
- [Rust books](https://programming-books-pdf.vercel.app/library?lang=rust)
- [Go books](https://programming-books-pdf.vercel.app/library?lang=go)
- [TypeScript books](https://programming-books-pdf.vercel.app/library?lang=typescript)

---

## How the library works

1. Open [programming-books-pdf.vercel.app](https://programming-books-pdf.vercel.app/).
2. Select a **language shelf** on the home page.
3. On the library page, use **search** and **level filters** (no second language picker).
4. Click **Read book** to open the public Google Drive (or docs) link.

Source for the UI catalog: [`web/data/books.json`](web/data/books.json). Markdown mirrors live under [`docs/`](docs/).

**Project health:** See [NOTICE.md](NOTICE.md) for copyright / DMCA takedown handling so disputed links can be removed quickly.

---

## Who this is for

- Students building a **programming reading list** by language  
- Self-taught developers looking for **beginner to advanced** paths  
- Mentors and bootcamps that need a **shared book index**  
- Contributors who want to **suggest titles** without hunting for files  

---

## FAQ

**Where is the live dashboard?**  
[https://programming-books-pdf.vercel.app/](https://programming-books-pdf.vercel.app/) (library: [/library](https://programming-books-pdf.vercel.app/library)).

**Is this free / open source?**  
The repository is [MIT](LICENSE). Individual books keep their own copyright and publisher licenses — use legal sources in your region.

**Where are the PDFs?**  
Most titles use **public Google Drive** links maintained for this collection. This repo stores Markdown + the web catalog, not binary files in git.

**How do I suggest a book?**  
Open a [book suggestion issue](.github/ISSUE_TEMPLATE/book-suggestion.yml) with the **title** (and author if known). **Do not submit links** — maintainers find the PDF and attach a valid Google Drive share.

**How do I add covers or authors in the app?**  
Edit [`web/data/books.json`](web/data/books.json) (`author`, `coverImage`). See [CONTRIBUTING.md](CONTRIBUTING.md).

**Broken link?**  
Open a [broken-link issue](.github/ISSUE_TEMPLATE/broken-link.yml). Malicious links → [SECURITY.md](SECURITY.md).

**How is this different from free-programming-books?**  
[EbookFoundation/free-programming-books](https://github.com/EbookFoundation/free-programming-books) focuses on freely available books worldwide. This project adds **language + skill-level learning paths** and a **searchable library UI** at [programming-books-pdf.vercel.app](https://programming-books-pdf.vercel.app/).

More answers: [docs/faq.md](docs/faq.md)

---

## Contributing

Suggestions and PRs welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).

- Suggest a book by **title only** (no links)
- Report broken Drive links
- Maintainers: fill `author` / `coverImage` and attach Drive URLs (`cd web && npm run validate:links`)

```bash
cd web && npm install && npm run import:docs
npm run validate:links
npm run dev
```

Star the project if you use it — it improves GitHub ranking and discovery:  
[https://github.com/sx4im/programming-books-pdf](https://github.com/sx4im/programming-books-pdf)

---

## License

[MIT](LICENSE) for this repository’s curation and docs — not for third-party book contents.

Copyright / DMCA takedown process: [NOTICE.md](NOTICE.md).

> Book titles and linked files belong to their authors and publishers. Comply with copyright and each source’s terms.

---

## Related resources

- Live library: [programming-books-pdf.vercel.app](https://programming-books-pdf.vercel.app/)
- [EbookFoundation/free-programming-books](https://github.com/EbookFoundation/free-programming-books) — freely available programming books
- [Awesome lists](https://github.com/sindresorhus/awesome) — curated lists across the ecosystem
- [Developer Roadmaps](https://roadmap.sh/) — skill roadmaps for developers
