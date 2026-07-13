# Ultimate Programming Books

Curated programming books for **20 languages** — beginner to advanced. Pick a language, follow the skill path, and open public Drive links to read.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Languages](https://img.shields.io/badge/Languages-20-blue)](#languages)
[![Books](https://img.shields.io/badge/Books-469%2B-9cf)](web/data/books.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub stars](https://img.shields.io/github/stars/sx4im/programming-books-pdf?style=social)](https://github.com/sx4im/programming-books-pdf)

**Browse** · [Library app](web/) · [Docs home](docs/index.md) · [FAQ](docs/faq.md) · [Contribute](CONTRIBUTING.md)

---

## Quick start

1. **Library UI** — open [`web/`](web/), run `cd web && npm install && npm run dev`
2. **Markdown guides** — browse [`docs/`](docs/) on GitHub
3. **Suggest a book** — open a [book suggestion](.github/ISSUE_TEMPLATE/book-suggestion.yml) with the **title only** (no links; maintainers attach Drive PDFs)

Each guide is split by level: **Beginner → Intermediate → Advanced → Specialized → References**.

---

## Languages

Click a badge to open that guide:

<p align="center">
<a href="docs/python.md"><img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/></a>
<a href="docs/javascript.md"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/></a>
<a href="docs/java.md"><img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java"/></a>
<a href="docs/csharp.md"><img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white" alt="C#"/></a>
<a href="docs/c.md"><img src="https://img.shields.io/badge/C-00599C?style=for-the-badge&logo=c&logoColor=white" alt="C"/></a>
<a href="docs/cpp.md"><img src="https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=cplusplus&logoColor=white" alt="C++"/></a>
<a href="docs/typescript.md"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/></a>
<a href="docs/go.md"><img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go"/></a>
<a href="docs/rust.md"><img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust"/></a>
<a href="docs/php.md"><img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP"/></a>
<a href="docs/kotlin.md"><img src="https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white" alt="Kotlin"/></a>
<a href="docs/sql.md"><img src="https://img.shields.io/badge/SQL-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQL"/></a>
<a href="docs/swift.md"><img src="https://img.shields.io/badge/Swift-F05138?style=for-the-badge&logo=swift&logoColor=white" alt="Swift"/></a>
<a href="docs/ruby.md"><img src="https://img.shields.io/badge/Ruby-CC342D?style=for-the-badge&logo=ruby&logoColor=white" alt="Ruby"/></a>
<a href="docs/dart.md"><img src="https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white" alt="Dart"/></a>
<a href="docs/scala.md"><img src="https://img.shields.io/badge/Scala-DC322F?style=for-the-badge&logo=scala&logoColor=white" alt="Scala"/></a>
<a href="docs/elixir.md"><img src="https://img.shields.io/badge/Elixir-4B275F?style=for-the-badge&logo=elixir&logoColor=white" alt="Elixir"/></a>
<a href="docs/shell.md"><img src="https://img.shields.io/badge/Bash-4EAA25?style=for-the-badge&logo=gnubash&logoColor=white" alt="Bash"/></a>
<a href="docs/r.md"><img src="https://img.shields.io/badge/R-276DC3?style=for-the-badge&logo=r&logoColor=white" alt="R"/></a>
<a href="docs/julia.md"><img src="https://img.shields.io/badge/Julia-9558B2?style=for-the-badge&logo=julia&logoColor=white" alt="Julia"/></a>
</p>

<details>
<summary><strong>Catalog snapshot</strong> (counts by language)</summary>

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

---

## FAQ

**Is this free / open source?**  
The repo is [MIT](LICENSE). Books keep their own licenses — use legal sources in your region.

**Where are the PDFs?**  
Most titles use **public Google Drive** links maintained for this collection. This repo stores Markdown + the web catalog, not binary files.

**How do I suggest a book?**  
Open a [book suggestion issue](.github/ISSUE_TEMPLATE/book-suggestion.yml) with the **title** (and author if you know it). **Do not submit links** — maintainers find the PDF and attach a valid Google Drive share.

**How do I add covers or authors in the app?**  
Edit [`web/data/books.json`](web/data/books.json) (`author`, `coverImage`). See [CONTRIBUTING.md](CONTRIBUTING.md).

**Broken link?**  
Open a [broken-link issue](.github/ISSUE_TEMPLATE/broken-link.yml). Malicious links → [SECURITY.md](SECURITY.md).

**vs free-programming-books?**  
[EbookFoundation/free-programming-books](https://github.com/EbookFoundation/free-programming-books) focuses on free books. This project is **language + skill-level learning paths** plus a browsable library UI.

More: [docs/faq.md](docs/faq.md)

---

## Contributing

PRs and suggestions welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).

- Suggest a book by title only (no links)
- Report broken Drive links
- Fill `author` / `coverImage` in the library JSON (maintainers)

```bash
cd web && npm install && npm run import:docs   # sync JSON from docs (keeps author/cover)
npm run dev                                   # local library UI
```

## License

[MIT](LICENSE) for this repository’s curation and docs — not for third-party book contents.

> Book titles and linked files belong to their authors and publishers. Comply with copyright and each source’s terms.

## Related

- [EbookFoundation/free-programming-books](https://github.com/EbookFoundation/free-programming-books)
- [Awesome lists](https://github.com/sindresorhus/awesome)
- [Developer Roadmaps](https://roadmap.sh/)
