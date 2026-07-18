#!/usr/bin/env python3
"""Strict edition-aware cover rematch for numbered/year editions."""

from __future__ import annotations

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
UA = "FreeProgrammingBooksCoverBot/2.0 (strict edition rematch)"
OL_COVER = "https://covers.openlibrary.org/b/id/{id}-L.jpg"
OL_ISBN = "https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"
MAX_WORKERS = 5
PAUSE = 0.15

# Skip true online docs — they use the reference SVG.
SKIP_EDITION = re.compile(
    r"online resource|official reference|official language", re.I
)


def load_books() -> list[dict]:
    return json.loads(BOOKS_PATH.read_text(encoding="utf-8"))


def save_books(books: list[dict]) -> None:
    BOOKS_PATH.write_text(
        json.dumps(books, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )


def normalize(text: str) -> str:
    text = text.lower()
    text = text.replace("c++", "cpp").replace("c#", "csharp")
    text = re.sub(r"[^\w\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def edition_info(edition: str) -> tuple[str | None, str | None]:
    """Return (kind, value) where kind is 'nth' or 'year'."""
    ed = edition or ""
    m = re.search(r"(\d+)\s*(st|nd|rd|th)?\s*edition", ed, re.I)
    if m:
        return "nth", m.group(1)
    m = re.search(r"\b((?:19|20)\d{2})\b", ed)
    if m:
        return "year", m.group(1)
    return None, None


def ordinal(n: str) -> str:
    num = int(n)
    if 10 <= num % 100 <= 20:
        suf = "th"
    else:
        suf = {1: "st", 2: "nd", 3: "rd"}.get(num % 10, "th")
    return f"{num}{suf}"


def http_get_json(url: str) -> dict:
    req = urllib.request.Request(
        url, headers={"User-Agent": UA, "Accept": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_get(url: str) -> tuple[str, str]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        charset = resp.headers.get_content_charset() or "utf-8"
        return resp.geturl(), resp.read().decode(charset, "replace")


def cover_exists(url: str) -> bool:
    check = url + ("&" if "?" in url else "?") + "default=false"
    req = urllib.request.Request(check, method="HEAD", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return 200 <= resp.status < 400
    except urllib.error.HTTPError as exc:
        return exc.code != 404
    except Exception:
        return False


def title_overlap(a: str, b: str) -> float:
    aw, bw = set(normalize(a).split()), set(normalize(b).split())
    if not aw:
        return 0.0
    return len(aw & bw) / len(aw)


def edition_in_text(text: str, kind: str, value: str) -> bool:
    t = normalize(text)
    if kind == "nth":
        ord_ = ordinal(value)
        patterns = [
            rf"\b{re.escape(value)}\s*edition\b",
            rf"\b{re.escape(ord_)}\s*edition\b",
            rf"\b{re.escape(ord_)}\b",
            rf",\s*{re.escape(value)}\b",
        ]
        return any(re.search(p, t) for p in patterns)
    if kind == "year":
        return bool(re.search(rf"\b{re.escape(value)}\b", t))
    return False


def search_ol(query: str) -> list[dict]:
    url = "https://openlibrary.org/search.json?" + urllib.parse.urlencode(
        {"q": query, "limit": 20}
    )
    try:
        return http_get_json(url).get("docs") or []
    except Exception:
        return []


def pick_ol_cover(book: dict, kind: str, value: str) -> str:
    title = book["title"]
    queries = [
        f"{title} {ordinal(value)} edition" if kind == "nth" else f"{title} {value}",
        f"{title} {value} edition" if kind == "nth" else title,
        title,
    ]
    # de-dupe
    seen_q = set()
    docs: list[dict] = []
    seen_keys = set()
    for q in queries:
        if q in seen_q:
            continue
        seen_q.add(q)
        for doc in search_ol(q):
            key = doc.get("key") or str(doc.get("cover_i"))
            if key in seen_keys:
                continue
            seen_keys.add(key)
            docs.append(doc)
        time.sleep(PAUSE)

    best_url = ""
    best_score = -1.0
    for doc in docs:
        doc_title = doc.get("title") or ""
        overlap = title_overlap(title, doc_title)
        if overlap < 0.55:
            continue
        ed_hit = edition_in_text(doc_title, kind, value)
        # Also check subtitle-ish fields
        if not ed_hit:
            blob = " ".join(
                [
                    doc_title,
                    str(doc.get("subtitle") or ""),
                    " ".join(str(x) for x in (doc.get("isbn") or [])[:1]),
                ]
            )
            ed_hit = edition_in_text(blob, kind, value)

        score = overlap * 10
        if ed_hit:
            score += 25
        else:
            # Without an explicit edition signal, skip — avoid wrong editions.
            continue

        cover_i = doc.get("cover_i")
        url = ""
        if cover_i:
            url = OL_COVER.format(id=int(cover_i))
        else:
            for isbn in doc.get("isbn") or []:
                clean = re.sub(r"[^0-9Xx]", "", str(isbn))
                if len(clean) in (10, 13):
                    candidate = OL_ISBN.format(isbn=clean)
                    if cover_exists(candidate):
                        url = candidate
                        break
        if not url:
            continue
        if score > best_score:
            best_score = score
            best_url = url
    return best_url


def pick_goodreads_isbn_cover(book: dict, kind: str, value: str) -> str:
    """Fallback: Open Library editions → ISBN → Goodreads og:image."""
    title = book["title"]
    q = f"{title} {ordinal(value)} edition" if kind == "nth" else f"{title} {value}"
    docs = search_ol(q) or search_ol(title)
    time.sleep(PAUSE)
    isbns: list[str] = []
    for doc in docs[:5]:
        if title_overlap(title, doc.get("title") or "") < 0.5:
            continue
        for isbn in doc.get("isbn") or []:
            clean = re.sub(r"[^0-9Xx]", "", str(isbn))
            if len(clean) in (10, 13):
                isbns.append(clean)
        key = doc.get("key")
        if key and str(key).startswith("/works/"):
            try:
                editions = http_get_json(
                    f"https://openlibrary.org{key}/editions.json?limit=15"
                )
            except Exception:
                editions = {}
            for entry in editions.get("entries") or []:
                ed_title = entry.get("title") or ""
                ed_name = entry.get("edition_name") or ""
                blob = f"{ed_title} {ed_name} {entry.get('publish_date') or ''}"
                if not edition_in_text(blob, kind, value) and kind == "nth":
                    # still collect if edition_name matches
                    if not edition_in_text(ed_name, kind, value):
                        continue
                for field in ("isbn_13", "isbn_10"):
                    for isbn in entry.get(field) or []:
                        clean = re.sub(r"[^0-9Xx]", "", str(isbn))
                        if len(clean) in (10, 13):
                            isbns.append(clean)
            time.sleep(PAUSE)

    # unique prefer isbn13
    uniq = []
    seen = set()
    for isbn in sorted(isbns, key=lambda x: (0 if len(x) == 13 else 1, x)):
        if isbn not in seen:
            seen.add(isbn)
            uniq.append(isbn)

    for isbn in uniq[:6]:
        try:
            final, page = http_get(f"https://www.goodreads.com/book/isbn/{isbn}")
        except Exception:
            continue
        if "captcha" in final.lower() or "verify" in final.lower():
            continue
        m = re.search(
            r'property=["\']og:image["\']\s+content=["\']([^"\']+)["\']',
            page,
            flags=re.I,
        )
        if not m:
            continue
        img = m.group(1).replace("&amp;", "&")
        if "goodreads_wide" in img or "facebook/goodreads" in img:
            continue
        if "books/" in img or "media-amazon.com" in img or "gr-assets" in img:
            # Prefer when page text mentions edition
            if kind == "nth" and not edition_in_text(page[:8000], kind, value):
                # still accept if title overlap on og:title
                mt = re.search(
                    r'property=["\']og:title["\']\s+content=["\']([^"\']+)["\']',
                    page,
                    flags=re.I,
                )
                if mt and edition_in_text(mt.group(1), kind, value):
                    return img
                if mt and title_overlap(title, mt.group(1)) >= 0.6:
                    return img
                continue
            return img
        time.sleep(PAUSE)
    return ""


def pick_manning(book: dict) -> str:
    slug = re.sub(r"[^\w\s-]", "", book["title"].lower())
    slug = re.sub(r"\s+", "-", slug.strip())
    # common substitutions
    slug = slug.replace("c++", "c-plus-plus").replace("c#", "c-sharp")
    try:
        final, page = http_get(f"https://www.manning.com/books/{slug}")
    except Exception:
        return ""
    if "/books/" not in final:
        return ""
    m = re.search(r"https://images\.manning\.com/310/310/crop/book/[^\"']+", page)
    if m:
        return m.group(0).replace(
            "https://images.manning.com/310/310/crop/",
            "https://images.manning.com/360/480/resize/",
        )
    m = re.search(
        r'property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', page, flags=re.I
    )
    if m and "twitter.png" not in m.group(1):
        return m.group(1)
    return ""


def lookup(book: dict) -> tuple[str, str]:
    edition = book.get("edition") or ""
    if SKIP_EDITION.search(edition):
        return "", "skip-docs"
    kind, value = edition_info(edition)
    if not kind or not value:
        return "", "skip"
    # Years used as edition labels like 2025 Edition — try, but weaker
    if kind == "year" and int(value) >= 1900:
        pass

    url = pick_ol_cover(book, kind, value)
    if url:
        return url, "ol"

    url = pick_manning(book)
    if url:
        return url, "manning"

    url = pick_goodreads_isbn_cover(book, kind, value)
    if url:
        return url, "goodreads"

    return "", "miss"


def main() -> None:
    books = load_books()
    candidates = []
    for b in books:
        ed = b.get("edition") or ""
        if SKIP_EDITION.search(ed):
            continue
        kind, value = edition_info(ed)
        if not kind:
            continue
        # Focus on nth editions + recent year editions
        if kind == "year" and not re.search(r"edition", ed, re.I):
            continue
        candidates.append(b)

    print(f"Candidates: {len(candidates)}")
    updates: dict[str, str] = {}
    stats = {"ol": 0, "goodreads": 0, "manning": 0, "miss": 0, "skip": 0, "skip-docs": 0, "same": 0}

    def worker(book: dict):
        time.sleep(PAUSE)
        return book["id"], *lookup(book), book.get("coverImage") or ""

    done = 0
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(worker, b): b for b in candidates}
        for fut in as_completed(futures):
            book = futures[fut]
            try:
                bid, url, source, old = fut.result()
            except Exception as exc:  # noqa: BLE001
                print(f"error {book['id']}: {exc}")
                bid, url, source, old = book["id"], "", "miss", ""
            stats[source] = stats.get(source, 0) + 1
            if url:
                if url == old:
                    stats["same"] = stats.get("same", 0) + 1
                else:
                    updates[bid] = url
                    print(
                        f"+ [{source}] {book['title'][:48]} ({book.get('edition')}) "
                        f"\n    {old[:70]}\n -> {url[:70]}"
                    )
            done += 1
            if done % 25 == 0:
                print(f"progress {done}/{len(candidates)} updates={len(updates)} {stats}")
                # checkpoint
                for b in books:
                    if b["id"] in updates:
                        b["coverImage"] = updates[b["id"]]
                save_books(books)

    for b in books:
        if b["id"] in updates:
            b["coverImage"] = updates[b["id"]]
    save_books(books)
    print(f"Done. Updated {len(updates)}. Stats={stats}")


if __name__ == "__main__":
    main()
