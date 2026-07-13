# Ultimate Programming Books

**Curated programming books and ebooks for 32 languages** — Python, JavaScript, Java, C#, C/C++, TypeScript, Go, Rust, HTML/CSS, and more — organized from beginner to advanced.

Browse the live library, pick a language, filter by skill level, search by title, and open public Google Drive links to read.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Languages](https://img.shields.io/badge/Languages-32-blue)](#languages)
[![Books](https://img.shields.io/badge/Books-634%2B-9cf)](web/data/books.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub stars](https://img.shields.io/github/stars/sx4im/programming-books-pdf?style=social)](https://github.com/sx4im/programming-books-pdf)

[Library](https://programming-books-pdf.vercel.app/)  · [Docs](docs/index.md) · [FAQ](docs/faq.md) · [Contribute](CONTRIBUTING.md)

---

## Why this repository

Developers searching for **programming books**, **learning paths**, and **language-specific reading lists** often land on scattered links. This project is a single, maintained catalog:

- **32 programming languages** with beginner → advanced paths  
- **634+ curated titles** (Drive PDFs + official docs where useful)  
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

Click a language for the GitHub guide, or open the same shelf in the [live library](https://programming-books-pdf.vercel.app/library).

<table align="center" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0;max-width:980px;">
  <tr>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/python.md" title="Python programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="36" height="36" alt="Python logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Python</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/javascript.md" title="JavaScript programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="36" height="36" alt="JavaScript logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">JavaScript</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/java.md" title="Java programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openjdk/openjdk-original.svg" width="36" height="36" alt="Java logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Java</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/csharp.md" title="C# programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" width="36" height="36" alt="C# logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">C#</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/c.md" title="C programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" width="36" height="36" alt="C logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">C</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/cpp.md" title="C++ programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" width="36" height="36" alt="C++ logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">C++</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/typescript.md" title="TypeScript programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="36" height="36" alt="TypeScript logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">TypeScript</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/go.md" title="Go programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" width="36" height="36" alt="Go logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Go</span>
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/rust.md" title="Rust programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg" width="36" height="36" alt="Rust logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Rust</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/php.md" title="PHP programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" width="36" height="36" alt="PHP logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">PHP</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/kotlin.md" title="Kotlin programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" width="36" height="36" alt="Kotlin logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Kotlin</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/sql.md" title="SQL programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" width="36" height="36" alt="SQL logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">SQL</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/swift.md" title="Swift programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" width="36" height="36" alt="Swift logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Swift</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/ruby.md" title="Ruby programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg" width="36" height="36" alt="Ruby logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Ruby</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/dart.md" title="Dart programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" width="36" height="36" alt="Dart logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Dart</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/scala.md" title="Scala programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg" width="36" height="36" alt="Scala logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Scala</span>
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/elixir.md" title="Elixir programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg" width="36" height="36" alt="Elixir logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Elixir</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/shell.md" title="Bash programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" width="36" height="36" alt="Bash logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Bash</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/r.md" title="R programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg" width="36" height="36" alt="R logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">R</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/julia.md" title="Julia programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/julia/julia-original.svg" width="36" height="36" alt="Julia logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Julia</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/htmlcss.md" title="HTML/CSS programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="36" height="36" alt="HTML/CSS logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">HTML/CSS</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/lua.md" title="Lua programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lua/lua-original.svg" width="36" height="36" alt="Lua logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Lua</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/matlab.md" title="MATLAB programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg" width="36" height="36" alt="MATLAB logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">MATLAB</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/assembly.md" title="Assembly programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aarch64/aarch64-original.svg" width="36" height="36" alt="Assembly logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Assembly</span>
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/haskell.md" title="Haskell programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/haskell/haskell-original.svg" width="36" height="36" alt="Haskell logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Haskell</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/powershell.md" title="PowerShell programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/powershell/powershell-original.svg" width="36" height="36" alt="PowerShell logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">PowerShell</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/zig.md" title="Zig programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/zig/zig-original.svg" width="36" height="36" alt="Zig logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Zig</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/solidity.md" title="Solidity programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg" width="36" height="36" alt="Solidity logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Solidity</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/perl.md" title="Perl programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/perl/perl-original.svg" width="36" height="36" alt="Perl logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Perl</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/fortran.md" title="Fortran programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fortran/fortran-original.svg" width="36" height="36" alt="Fortran logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Fortran</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/objectivec.md" title="Objective-C programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/objectivec/objectivec-plain.svg" width="36" height="36" alt="Objective-C logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Objective-C</span>
      </a>
    </td>
    <td align="center" width="12.5%" style="padding:6px;">
      <a href="docs/clojure.md" title="Clojure programming books" style="display:block;text-decoration:none;color:#24292f;border:1px solid #d0d7de;border-radius:10px;padding:14px 6px;background:#f6f8fa;">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/clojure/clojure-original.svg" width="36" height="36" alt="Clojure logo" style="display:block;margin:0 auto 8px;"/>
        <span style="font-size:12px;font-weight:600;line-height:1.2;">Clojure</span>
      </a>
    </td>
  </tr>
</table>

<details>
<summary><strong>Catalog snapshot</strong> (book counts by language)</summary>

<br/>

```text
Python ........ 57    JavaScript .... 51    Java .......... 50
C# ............ 39    C ............. 30    C++ ........... 21
TypeScript .... 17    Go ............ 19    Rust .......... 21
PHP ........... 19    Kotlin ........ 17    SQL ........... 19
Swift ......... 19    Ruby .......... 24    Dart .......... 18
Scala ......... 17    Elixir ........ 18    Shell .........  8
R ............. 17    Julia ......... 16    HTML/CSS ...... 15
Lua ........... 11    MATLAB ........ 11    Assembly ...... 11
Haskell ....... 12    PowerShell .... 11    Zig ........... 11
Solidity ...... 11    Perl .......... 11    Fortran ....... 11
Objective-C ... 11    Clojure ....... 11
```

</details>

Popular entry points in the live app:

- [Python books](https://programming-books-pdf.vercel.app/library?lang=python)
- [JavaScript books](https://programming-books-pdf.vercel.app/library?lang=javascript)
- [Java books](https://programming-books-pdf.vercel.app/library?lang=java)
- [HTML/CSS books](https://programming-books-pdf.vercel.app/library?lang=htmlcss)
- [Rust books](https://programming-books-pdf.vercel.app/library?lang=rust)
- [Go books](https://programming-books-pdf.vercel.app/library?lang=go)
- [TypeScript books](https://programming-books-pdf.vercel.app/library?lang=typescript)
- [Solidity books](https://programming-books-pdf.vercel.app/library?lang=solidity)

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
