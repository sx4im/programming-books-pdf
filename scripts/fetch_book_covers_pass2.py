#!/usr/bin/env python3
"""Second pass: fill remaining coverImage values via ISBN + Goodreads/ISBNdb."""

from __future__ import annotations

import html as html_lib
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOOKS_PATH = ROOT / "web" / "data" / "books.json"
CACHE_PATH = ROOT / "scripts" / ".cover_cache.json"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)
OL_UA = "FreeProgrammingBooksCoverBot/1.0 (cover lookup; second pass)"
MAX_WORKERS = 4
PAUSE = 0.25


def load_json(path: Path, default):
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return default


def save_json(path: Path, data) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def normalize(text: str) -> str:
    text = text.lower()
    text = text.replace("c++", "cpp").replace("c#", "csharp")
    text = text.replace("javascript", "java script").replace("typescript", "type script")
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text.replace("java script", "javascript").replace("type script", "typescript")


def title_core(title: str) -> str:
    t = re.split(r"[:–—|(]", title, maxsplit=1)[0]
    t = re.sub(r"\b(series|collection)\b", "", t, flags=re.I)
    return normalize(t).strip()


def http_get(url: str, ua: str = UA, timeout: int = 30) -> tuple[str, str]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": ua,
            "Accept": "text/html,application/json;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        charset = resp.headers.get_content_charset() or "utf-8"
        return resp.geturl(), resp.read().decode(charset, "replace")


def http_get_json(url: str) -> dict:
    final, body = http_get(url, ua=OL_UA)
    return json.loads(body)


def og_image(page: str) -> str:
    m = re.search(
        r'property=["\']og:image["\']\s+content=["\']([^"\']+)["\']',
        page,
        flags=re.I,
    )
    if not m:
        m = re.search(
            r'content=["\']([^"\']+)["\']\s+property=["\']og:image["\']',
            page,
            flags=re.I,
        )
    if not m:
        return ""
    return html_lib.unescape(m.group(1)).strip()


def word_overlap(a: str, b: str) -> float:
    aw, bw = set(a.split()), set(b.split())
    if not aw:
        return 0.0
    return len(aw & bw) / len(aw)


def score_title(candidate: str, wanted: str) -> float:
    return max(
        word_overlap(title_core(wanted), title_core(candidate)),
        word_overlap(normalize(wanted), normalize(candidate)),
    )


def ol_isbns_for_title(title: str) -> list[str]:
    isbns: list[str] = []
    queries = [title, re.split(r"[:–—|(]", title, maxsplit=1)[0].strip()]
    seen_q = set()
    for q in queries:
        if not q or q in seen_q:
            continue
        seen_q.add(q)
        try:
            data = http_get_json(
                "https://openlibrary.org/search.json?"
                + urllib.parse.urlencode({"q": q, "limit": 8})
            )
        except Exception:
            continue
        docs = data.get("docs") or []
        ranked = sorted(
            docs,
            key=lambda d: score_title(d.get("title") or "", title),
            reverse=True,
        )
        for doc in ranked[:3]:
            if score_title(doc.get("title") or "", title) < 0.45:
                continue
            for isbn in doc.get("isbn") or []:
                clean = re.sub(r"[^0-9Xx]", "", str(isbn))
                if len(clean) in (10, 13):
                    isbns.append(clean)
            key = doc.get("key")
            if key and key.startswith("/works/"):
                try:
                    editions = http_get_json(
                        f"https://openlibrary.org{key}/editions.json?limit=12"
                    )
                except Exception:
                    editions = {}
                for entry in editions.get("entries") or []:
                    for field in ("isbn_13", "isbn_10"):
                        for isbn in entry.get(field) or []:
                            clean = re.sub(r"[^0-9Xx]", "", str(isbn))
                            if len(clean) in (10, 13):
                                isbns.append(clean)
        time.sleep(PAUSE)
    # unique, prefer isbn13
    uniq: list[str] = []
    seen = set()
    for isbn in sorted(isbns, key=lambda x: (0 if len(x) == 13 else 1, x)):
        if isbn not in seen:
            seen.add(isbn)
            uniq.append(isbn)
    return uniq[:8]


def cover_from_goodreads_isbn(isbn: str) -> str:
    url = f"https://www.goodreads.com/book/isbn/{isbn}"
    try:
        final, page = http_get(url)
    except Exception:
        return ""
    if "verify" in final or "captcha" in final.lower():
        return ""
    img = og_image(page)
    if not img:
        return ""
    # Ignore site-wide fallback logos
    low = img.lower()
    if "goodreads_logo" in low or "facebook_default" in low:
        return ""
    if "/books/" not in low and "images/i/" not in low and "photo.goodreads" not in low:
        # still accept amazon media book images
        if "media-amazon.com" not in low and "ssl-images-amazon.com" not in low:
            return ""
    return img


def cover_from_isbnsearch(isbn: str) -> str:
    url = f"https://isbnsearch.org/isbn/{isbn}"
    try:
        _, page = http_get(url)
    except Exception:
        return ""
    m = re.search(r'https://images\.isbndb\.com/covers/\d+\.jpg', page)
    return m.group(0) if m else ""


def cover_from_google_books_page(isbn: str) -> str:
    url = f"https://books.google.com/books?vid=ISBN{isbn}&printsec=frontcover"
    try:
        _, page = http_get(url)
    except Exception:
        return ""
    img = og_image(page)
    if not img:
        return ""
    # Prefer non-tokenized publisher content URL if present
    m = re.search(
        r'https://books\.google\.com/books/publisher/content\?[^"\']+',
        page,
    )
    if m:
        return html_lib.unescape(m.group(0)).split("&amp;")[0] if False else html_lib.unescape(m.group(0))
    return img


def cover_from_goodreads_search(title: str) -> str:
    url = "https://www.goodreads.com/search?q=" + urllib.parse.quote(title)
    try:
        _, page = http_get(url)
    except Exception:
        return ""
    # Result rows include book title links and cover images.
    # Example: <a title="Quarkus in Action" ...> / <img src="https://i.gr-assets.com/...">
    pattern = re.compile(
        r'class="bookTitle"[^>]*>\s*([^<]+?)\s*</a>.*?'
        r'(?:src|data-src)=["\'](https://[^"\']+(?:goodreads|gr-assets|media-amazon)[^"\']+)["\']',
        flags=re.I | re.S,
    )
    # Simpler: find book covers near title text
    # Goodreads search often has: <img alt="Quarkus in Action" src="...">
    for m in re.finditer(
        r'<img[^>]+alt=["\']([^"\']+)["\'][^>]+src=["\'](https://[^"\']+)["\']',
        page,
        flags=re.I,
    ):
        alt, src = m.group(1), m.group(2)
        if score_title(alt, title) >= 0.55 and ("books" in src or "gr-assets" in src or "goodreads" in src or "media-amazon" in src):
            return html_lib.unescape(src)
    for m in re.finditer(
        r'<img[^>]+src=["\'](https://[^"\']+)["\'][^>]+alt=["\']([^"\']+)["\']',
        page,
        flags=re.I,
    ):
        src, alt = m.group(1), m.group(2)
        if score_title(alt, title) >= 0.55 and ("books" in src or "gr-assets" in src or "goodreads" in src or "media-amazon" in src):
            return html_lib.unescape(src)
    return ""


def cover_from_manning(title: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", title.lower())
    slug = re.sub(r"\s+", "-", slug.strip())
    url = f"https://www.manning.com/books/{slug}"
    try:
        final, page = http_get(url)
    except urllib.error.HTTPError:
        return ""
    except Exception:
        return ""
    if "/books/" not in final:
        return ""
    img = og_image(page)
    if img and "manning.com" in img:
        return img
    return ""


def lookup_cover(book: dict) -> str:
    title = book["title"]

    # Publisher shortcut for Manning-style titles
    manning = cover_from_manning(title)
    if manning:
        return manning

    isbns = ol_isbns_for_title(title)
    for isbn in isbns:
        for fn in (cover_from_goodreads_isbn, cover_from_isbnsearch, cover_from_google_books_page):
            try:
                url = fn(isbn)
            except Exception:
                url = ""
            if url:
                return url
            time.sleep(PAUSE)

    # Title search fallback
    try:
        url = cover_from_goodreads_search(title)
    except Exception:
        url = ""
    return url or ""


def main() -> None:
    books = load_json(BOOKS_PATH, [])
    cache = load_json(CACHE_PATH, {})
    pending = [b for b in books if not (b.get("coverImage") or "").strip()]
    print(f"Pending: {len(pending)}")

    done = found = missing = 0

    def worker(book: dict) -> tuple[str, str]:
        time.sleep(PAUSE)
        return book["id"], lookup_cover(book)

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(worker, b): b for b in pending}
        for fut in as_completed(futures):
            book = futures[fut]
            try:
                book_id, url = fut.result()
            except Exception as exc:  # noqa: BLE001
                print(f"error {book['id']}: {exc}")
                book_id, url = book["id"], ""
            cache[book_id] = url
            if url:
                book["coverImage"] = url
                found += 1
                print(f"  + {book['title'][:60]} -> {url[:80]}")
            else:
                missing += 1
            done += 1
            if done % 10 == 0 or done == len(pending):
                save_json(CACHE_PATH, cache)
                save_json(BOOKS_PATH, books)
                print(f"progress {done}/{len(pending)} found={found} missing={missing}")

    save_json(CACHE_PATH, cache)
    save_json(BOOKS_PATH, books)
    filled = sum(1 for b in books if (b.get("coverImage") or "").strip())
    print(f"Done. Covers filled: {filled}/{len(books)}")


if __name__ == "__main__":
    main()
