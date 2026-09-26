#!/usr/bin/env python3
"""Third pass: publisher pages, docs og:images, and Manning cover fixes."""

from __future__ import annotations

import html as html_lib
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOOKS_PATH = ROOT / "web" / "data" / "books.json"
CACHE_PATH = ROOT / "scripts" / ".cover_cache.json"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)

# Known online docs / guides → stable public images
CURATED: dict[str, str] = {
    "MDN Web Docs": "https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png",
    "MDN Web Docs — HTML": "https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png",
    "MDN Web Docs — CSS": "https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png",
    "Official Go Documentation": "https://go.dev/blog/go-brand/Go-Logo/PNG/Go-Logo_Blue.png",
    "The TypeScript Handbook": "https://www.typescriptlang.org/images/branding/logo-grouping.png",
    "TypeScript Deep Dive": "https://basarat.gitbook.io/typescript/~gitbook/ogimage/-LxQ3jd_Z3snLZ7ef2c3",
    "Kotlin Documentation": "https://kotlinlang.org/assets/images/open-graph/docs.png",
    "Official Ruby Documentation": "https://www.ruby-lang.org/images/header-ruby-logo@2x.png",
    "The Ruby Style Guide": "https://raw.githubusercontent.com/rubocop/ruby-style-guide/master/images/cover.png",
    "Effective Dart": "https://dart.dev/assets/shared/dart-logo-for-shares.png?2",
    "Dart Language Documentation": "https://dart.dev/assets/shared/dart-logo-for-shares.png?2",
    "A Tour of the Dart Language": "https://dart.dev/assets/shared/dart-logo-for-shares.png?2",
    "Scala Documentation": "https://www.scala-lang.org/resources/img/scala-logo-red-circle-transparent.png",
    "Scala 3 Book": "https://docs.scala-lang.org/static/img/scala-spiral-white.png",
    "Elixir Getting Started Guide": "https://elixir-lang.org/images/logo/logo.png",
    "Official Elixir Documentation": "https://elixir-lang.org/images/logo/logo.png",
    "Elixir on HexDocs": "https://hexdocs.pm/images/apple-touch-icon.png",
    "HexDocs": "https://hexdocs.pm/images/apple-touch-icon.png",
    "Erlang/OTP Documentation": "https://www.erlang.org/img/erlang.png",
    "Greg's Wiki — BashGuide": "https://mywiki.wooledge.org/htdocs/apple-touch-icon.png",
    "ShellCheck": "https://www.shellcheck.net/shellcheck.png",
    "Google Shell Style Guide": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
    "RDocumentation": "https://www.r-project.org/logo/Rlogo.png",
    "The Julia Language Documentation": "https://julialang.org/assets/infra/julia-opengraph.png",
    "JuliaAcademy": "https://julialang.org/assets/infra/julia-opengraph.png",
    "Lua 5.4 Reference Manual": "https://www.lua.org/images/lua-logo.gif",
    "Official Lua Documentation": "https://www.lua.org/images/lua-logo.gif",
    "Lua Users Wiki": "https://www.lua.org/images/lua-logo.gif",
    "MathWorks MATLAB Documentation": "https://www.mathworks.com/favicon.ico",
    "MATLAB Onramp": "https://www.mathworks.com/favicon.ico",
    "Official Haskell Documentation": "https://www.haskell.org/img/haskell-logo.svg",
    "Microsoft PowerShell Documentation": "https://learn.microsoft.com/favicon.ico",
    "PowerShell Gallery": "https://www.powershellgallery.com/Content/Images/Branding/packageDefaultIcon-50x50.png",
    "Zig Language Reference": "https://ziglang.org/img/zig-logo-dark.svg",
    "Ziglearn": "https://ziglang.org/img/zig-logo-dark.svg",
    "Zig Documentation — Advanced Language Features": "https://ziglang.org/img/zig-logo-dark.svg",
    "Zig Build System Documentation": "https://ziglang.org/img/zig-logo-dark.svg",
    "Using Zig as a C Compiler / Cross Linker": "https://ziglang.org/img/zig-logo-dark.svg",
    "Official Zig Documentation": "https://ziglang.org/img/zig-logo-dark.svg",
    "Zig Standard Library Docs": "https://ziglang.org/img/zig-logo-dark.svg",
    "Writing an OS in Zig (community guides)": "https://ziglang.org/img/zig-logo-dark.svg",
    "Solidity by Example": "https://soliditylang.org/images/logo.svg",
    "Solidity Language Documentation": "https://docs.soliditylang.org/en/latest/_images/logo.svg",
    "CryptoZombies": "https://cryptozombies.io/images/preview_image.png",
    "Ethereum Developer Documentation": "https://ethereum.org/images/eth-diamond-black.png",
    "Ethereum Developer Docs": "https://ethereum.org/images/eth-diamond-black.png",
    "Ethereum Smart Contract Security Best Practices": "https://ethereum.org/images/eth-diamond-black.png",
    "Ethernaut / Capture the Ether style challenges": "https://ethereum.org/images/eth-diamond-black.png",
    "Official Perl Documentation": "https://cdn.perl.org/perlweb/images/camel_head.png",
    "Perl Maven": "https://perlmaven.com/img/perl_maven_150x214.png",
    "Apple Objective-C Documentation": "https://developer.apple.com/news/images/og/apple-developer-og.png",
    "Apple Cocoa Documentation": "https://developer.apple.com/news/images/og/apple-developer-og.png",
    "Official Clojure Documentation": "https://clojure.org/images/clojure-logo-120b.png",
    "ClojureDocs": "https://clojuredocs.org/images/cd-icon.png",
    "The Rustonomicon": "https://www.rust-lang.org/static/images/rust-logo-blk.svg",
    "The Embedded Rust Book": "https://www.rust-lang.org/static/images/rust-logo-blk.svg",
    "Beej's Guide to C Programming": "https://beej.us/guide/bgc/img/book-cover.png",
    "x86 Instruction Reference": "https://www.felixcloutier.com/favicon.ico",
    "Fortran Standards / ISO references": "https://fortran-lang.org/assets/img/fortran-logo.png",
    "Fortran Discourse & Community Docs": "https://fortran-lang.org/assets/img/fortran-logo.png",
    "TypeScript Weekly": "https://www.typescriptlang.org/images/branding/logo-grouping.png",
    "Utility Types Reference": "https://www.typescriptlang.org/images/branding/logo-grouping.png",
    "Tackling TypeScript": "https://exploringjs.com/img/cover.jpg",
}


def load_json(path: Path, default):
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return default


def save_json(path: Path, data) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def slugify(title: str) -> str:
    s = title.lower()
    s = s.replace("&", " and ")
    s = s.replace("c++", "c-plus-plus").replace("c#", "c-sharp")
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"\s+", "-", s.strip())
    return s


def http_get(url: str) -> tuple[str, str]:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": UA, "Accept": "text/html,application/xhtml+xml", "Accept-Language": "en"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        charset = resp.headers.get_content_charset() or "utf-8"
        return resp.geturl(), resp.read().decode(charset, "replace")


def extract_og_image(page: str) -> str:
    for pat in (
        r'property=["\']og:image(?::url)?["\']\s+content=["\']([^"\']+)["\']',
        r'content=["\']([^"\']+)["\']\s+property=["\']og:image(?::url)?["\']',
        r'name=["\']twitter:image["\']\s+content=["\']([^"\']+)["\']',
    ):
        m = re.search(pat, page, flags=re.I)
        if m:
            return html_lib.unescape(m.group(1)).strip()
    return ""


def first_matching_image(page: str, host_substr: str) -> str:
    imgs = re.findall(r'https://[^"\']+\.(?:jpg|jpeg|png|webp)', page, flags=re.I)
    for img in imgs:
        if host_substr in img and "logo" not in img.lower() and "icon" not in img.lower():
            return html_lib.unescape(img)
    return ""


def cover_from_manning(title: str) -> str:
    slug = slugify(title)
    url = f"https://www.manning.com/books/{slug}"
    try:
        final, page = http_get(url)
    except Exception:
        return ""
    if "/books/" not in final:
        return ""
    # Prefer explicit product cover assets over social twitter.png
    m = re.search(
        r'https://images\.manning\.com/310/310/crop/book/[^"\']+',
        page,
    )
    if m:
        # Upgrade crop URL to a nicer portrait resize when possible
        path = m.group(0)
        upgraded = re.sub(
            r"https://images\.manning\.com/310/310/crop/",
            "https://images.manning.com/360/480/resize/",
            path,
        )
        return upgraded
    img = extract_og_image(page)
    if img and "twitter.png" not in img:
        return img
    return ""


def cover_from_nostarch(title: str) -> str:
    candidates = [
        f"https://nostarch.com/{slugify(title)}",
        f"https://nostarch.com/{slugify(title).replace('-', '')}",
    ]
    # Common No Starch aliases
    aliases = {
        "beyond-the-basic-stuff-with-python": "beyond-basic-stuff-python",
        "the-recursive-book-of-recursion": "recursive-book-recursion",
        "automate-the-boring-stuff-with-python": "automate-boring-stuff-python-3rd-edition",
        "python-crash-course": "python-crash-course-3rd-edition",
        "black-hat-python": "black-hat-python2e",
        "black-hat-go": "black-hat-go",
        "black-hat-rust": "black-hat-rust",
    }
    slug = slugify(title)
    if slug in aliases:
        candidates.insert(0, f"https://nostarch.com/{aliases[slug]}")
    for url in candidates:
        try:
            final, page = http_get(url)
        except Exception:
            continue
        if "nostarch.com" not in final:
            continue
        img = extract_og_image(page) or first_matching_image(page, "nostarch.com/sites/default/files")
        if img and "placeholder" not in img:
            return img
    return ""


def cover_from_leanpub(title: str) -> str:
    aliases = {
        "javascript-allong": "javascriptallongesix",
        "javascript-allongé": "javascriptallongesix",
        "you-dont-know-js-yet-series": "get-started",
        "zionomicon": "zionomicon",
        "scala-with-cats": "scala-with-cats",
        "functional-programming-for-mortals-with-scalaz": "fp-for-mortals",
        "clojurescript-unraveled": "clojurescript-unraveled",
        "black-hat-rust": "black-hat-rust",
        "black-hat-ruby": "black-hat-ruby",
        "effective-pandas-2": "effective-pandas",
        "swift-gems": "swiftgems",
        "swiftui-views-mastery": "swiftuiviewsmastery",
    }
    slug = slugify(title)
    keys = [aliases.get(slug, slug), slug.replace("-", "")]
    for key in keys:
        url = f"https://leanpub.com/{key}"
        try:
            final, page = http_get(url)
        except Exception:
            continue
        if "/404" in final or "Page not found" in page[:2000]:
            continue
        img = extract_og_image(page)
        if img and "leanpub" in img or "cloudfront" in img:
            return img
    return ""


def cover_from_pragprog(title: str) -> str:
    slug = slugify(title)
    url = f"https://pragprog.com/titles/{slug}/"
    try:
        final, page = http_get(url)
    except Exception:
        # try search
        search = "https://pragprog.com/search/?q=" + urllib.parse.quote(title)
        try:
            final, page = http_get(search)
        except Exception:
            return ""
        m = re.search(r'href="(https://pragprog.com/titles/[^"]+/)"', page)
        if not m:
            return ""
        try:
            final, page = http_get(m.group(1))
        except Exception:
            return ""
    img = extract_og_image(page) or first_matching_image(page, "pragprog.com")
    return img


def cover_from_oreilly(title: str) -> str:
    # O'Reilly search page often includes cover images.
    url = "https://www.oreilly.com/search/?q=" + urllib.parse.quote(title)
    try:
        _, page = http_get(url)
    except Exception:
        return ""
    # Look for cover images near the exact title
    for m in re.finditer(
        r'https://learning\.oreilly\.com/library/cover/[^"\']+',
        page,
    ):
        return html_lib.unescape(m.group(0))
    img = extract_og_image(page)
    if img and "oreilly" in img:
        return img
    return ""


def cover_from_packt(title: str) -> str:
    url = "https://www.packtpub.com/search?query=" + urllib.parse.quote(title)
    try:
        _, page = http_get(url)
    except Exception:
        return ""
    imgs = re.findall(r'https://[^"\']+packt[^"\']+\.(?:jpg|png|webp)', page, flags=re.I)
    for img in imgs:
        if "cover" in img.lower() or "products" in img.lower():
            return html_lib.unescape(img)
    return ""


def cover_from_isbnsearch_title(title: str) -> str:
    url = "https://isbnsearch.org/search?s=" + urllib.parse.quote(title)
    try:
        _, page = http_get(url)
    except Exception:
        return ""
    # Result cards include cover + title
    for m in re.finditer(
        r'https://images\.isbndb\.com/covers/\d+\.jpg',
        page,
    ):
        return m.group(0)
    return ""


def cover_from_google_books_html(title: str) -> str:
    url = "https://www.google.com/search?tbm=bks&q=" + urllib.parse.quote(f'"{title}"')
    try:
        _, page = http_get(url)
    except Exception:
        return ""
    m = re.search(
        r'https://books\.google\.[^"\']+/books/content\?[^"\']+',
        page,
    )
    if m:
        return html_lib.unescape(m.group(0)).replace("&amp;", "&")
    m = re.search(r'data-src=["\'](https://books\.google[^"\']+)["\']', page)
    if m:
        return html_lib.unescape(m.group(1)).replace("&amp;", "&")
    return ""


def fix_manning_social(url: str, title: str) -> str:
    if "social-images.manning.com" not in url and "twitter.png" not in url:
        return url
    fixed = cover_from_manning(title)
    return fixed or url


def lookup(book: dict) -> str:
    title = book["title"]
    if title in CURATED:
        return CURATED[title]

    for fn in (
        cover_from_manning,
        cover_from_nostarch,
        cover_from_leanpub,
        cover_from_pragprog,
        cover_from_oreilly,
        cover_from_packt,
        cover_from_isbnsearch_title,
        cover_from_google_books_html,
    ):
        try:
            url = fn(title)
        except Exception:
            url = ""
        if url:
            return url
        time.sleep(0.15)
    return ""


def main() -> None:
    books = load_json(BOOKS_PATH, [])
    cache = load_json(CACHE_PATH, {})

    # Fix bad Manning social images first
    fixed = 0
    for b in books:
        img = b.get("coverImage") or ""
        if "social-images.manning.com" in img or img.endswith("twitter.png"):
            new = fix_manning_social(img, b["title"])
            if new and new != img:
                b["coverImage"] = new
                cache[b["id"]] = new
                fixed += 1
                print(f"fixed manning: {b['title']} -> {new}")
    print(f"Manning fixes: {fixed}")

    pending = [b for b in books if not (b.get("coverImage") or "").strip()]
    print(f"Pending: {len(pending)}")

    found = missing = 0
    for i, book in enumerate(pending, 1):
        url = lookup(book)
        cache[book["id"]] = url
        if url:
            book["coverImage"] = url
            found += 1
            print(f"+ {book['title'][:70]} -> {url[:100]}")
        else:
            missing += 1
            print(f"- miss: {book['title']}")
        if i % 10 == 0 or i == len(pending):
            save_json(CACHE_PATH, cache)
            save_json(BOOKS_PATH, books)
            print(f"progress {i}/{len(pending)} found={found} missing={missing}")
        time.sleep(0.1)

    save_json(CACHE_PATH, cache)
    save_json(BOOKS_PATH, books)
    filled = sum(1 for b in books if (b.get("coverImage") or "").strip())
    print(f"Done. Covers filled: {filled}/{len(books)}")


if __name__ == "__main__":
    main()
