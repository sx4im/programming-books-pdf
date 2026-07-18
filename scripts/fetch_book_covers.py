#!/usr/bin/env python3
"""Fill coverImage URLs in web/data/books.json via Open Library search."""

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
CACHE_PATH = ROOT / "scripts" / ".cover_cache.json"
UA = "FreeProgrammingBooksCoverBot/1.0 (github.com/EbookFoundation; cover lookup)"
COVER_ID_TMPL = "https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
COVER_ISBN_TMPL = "https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"
MAX_WORKERS = 5
REQUEST_PAUSE = 0.15


def load_json(path: Path, default):
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return default


def save_json(path: Path, data) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def normalize(text: str) -> str:
    text = text.lower()
    # Common programming-title normalizations
    repl = {
        "c++": "cpp",
        "c#": "csharp",
        "f#": "fsharp",
        "javascript": "java script",
        "typescript": "type script",
        "objective-c": "objective c",
        "node.js": "nodejs",
        "node js": "nodejs",
        ".net": "dotnet",
        "asp.net": "aspnet",
    }
    for a, b in repl.items():
        text = text.replace(a, b)
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    # Collapse java script -> javascript for comparison consistency after split words
    text = text.replace("java script", "javascript")
    text = text.replace("type script", "typescript")
    return text


def title_core(title: str) -> str:
    # Drop subtitle / series noise.
    t = re.split(r"[:–—|(]", title, maxsplit=1)[0]
    t = re.sub(
        r"\b(series|volume|vol\.?|part|edition|ed\.?)\b.*$",
        "",
        t,
        flags=re.I,
    )
    return normalize(t).strip()


def edition_tokens(edition: str) -> set[str]:
    ed = normalize(edition or "")
    tokens: set[str] = set()
    m = re.search(r"(\d+)\s*(st|nd|rd|th)?\s*edition", ed)
    if m:
        tokens.add(f"{m.group(1)} edition")
    year = re.search(r"\b(19|20)\d{2}\b", ed)
    if year:
        tokens.add(year.group(0))
    return tokens


def http_get_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def cover_exists(url: str) -> bool:
    # Open Library returns 404 when default=false and cover missing.
    check = url + ("&" if "?" in url else "?") + "default=false"
    req = urllib.request.Request(check, method="HEAD", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return 200 <= resp.status < 400
    except urllib.error.HTTPError as exc:
        return exc.code != 404
    except Exception:  # noqa: BLE001
        return False


def search_openlibrary(query: str, mode: str = "q") -> list[dict]:
    params = urllib.parse.urlencode({mode: query, "limit": 20})
    url = f"https://openlibrary.org/search.json?{params}"
    data = http_get_json(url)
    return data.get("docs") or []


def word_overlap(a: str, b: str) -> float:
    aw = set(a.split())
    bw = set(b.split())
    if not aw or not bw:
        return 0.0
    return len(aw & bw) / max(len(aw), 1)


def score_doc(doc: dict, book_title: str, edition: str, require_cover: bool = True) -> int:
    if require_cover and not doc.get("cover_i"):
        return -1
    score = 5
    doc_title = doc.get("title") or ""
    nt = normalize(book_title)
    nd = normalize(doc_title)
    tc = title_core(book_title)
    dc = title_core(doc_title)

    if nd == nt or dc == tc:
        score += 60
    elif tc and (tc in nd or nd in nt or dc in nt):
        score += 40
    else:
        overlap = max(word_overlap(tc, dc), word_overlap(nt, nd))
        if overlap < 0.45:
            return -1
        score += int(overlap * 30)

    # Penalize clearly unrelated programming-adjacent collisions a bit less harshly
    # but drop obvious fiction false positives when query is technical.
    fiction_markers = ("sherlock", "tale of two", "harry potter", "pride and prejudice")
    if any(m in nd for m in fiction_markers):
        return -1

    ed_tokens = edition_tokens(edition)
    for tok in ed_tokens:
        if tok and tok in nd:
            score += 20
            break

    score += min(int(doc.get("edition_count") or 0), 25) // 5
    if doc.get("cover_i"):
        score += 5
    return score


def isbn_candidates(doc: dict) -> list[str]:
    out: list[str] = []
    for key in ("isbn",):
        vals = doc.get(key) or []
        if isinstance(vals, list):
            for v in vals:
                s = re.sub(r"[^0-9Xx]", "", str(v))
                if len(s) in (10, 13):
                    out.append(s)
    # Prefer ISBN-13
    out.sort(key=lambda x: (0 if len(x) == 13 else 1, x))
    # unique preserve order
    seen = set()
    uniq = []
    for x in out:
        if x not in seen:
            seen.add(x)
            uniq.append(x)
    return uniq[:6]


def pick_cover_url(docs: list[dict], book_title: str, edition: str) -> str:
    ranked = sorted(
        ((score_doc(d, book_title, edition, require_cover=False), d) for d in docs),
        key=lambda x: x[0],
        reverse=True,
    )
    for score, doc in ranked:
        if score < 0:
            continue
        cover_i = doc.get("cover_i")
        if cover_i:
            return COVER_ID_TMPL.format(cover_id=int(cover_i))
        # Fallback: ISBN cover endpoint
        for isbn in isbn_candidates(doc):
            url = COVER_ISBN_TMPL.format(isbn=isbn)
            if cover_exists(url):
                return url
    return ""


def query_variants(title: str) -> list[str]:
    variants = [title]
    core = re.split(r"[:–—|(]", title, maxsplit=1)[0].strip()
    if core and core not in variants:
        variants.append(core)
    # Strip trailing Series / Handbook noise
    stripped = re.sub(r"\b(Series|Collection)\b", "", core, flags=re.I).strip(" -")
    if stripped and stripped not in variants:
        variants.append(stripped)
    # Soft punctuation cleanup
    soft = re.sub(r"[^\w\s+#.+]", " ", core)
    soft = re.sub(r"\s+", " ", soft).strip()
    if soft and soft not in variants:
        variants.append(soft)
    return variants


def lookup_cover(book: dict) -> str:
    title = book["title"]
    edition = book.get("edition") or ""

    for q in query_variants(title):
        for mode in ("q", "title"):
            try:
                docs = search_openlibrary(q, mode=mode)
            except Exception as exc:  # noqa: BLE001
                print(f"  warn: search failed for {book['id']!r} ({mode}): {exc}")
                time.sleep(0.6)
                continue
            url = pick_cover_url(docs, title, edition)
            if url:
                return url
            time.sleep(REQUEST_PAUSE)
    return ""


def main() -> None:
    books = load_json(BOOKS_PATH, [])
    cache = load_json(CACHE_PATH, {})

    # Retry previously empty cache entries.
    pending = [b for b in books if not (b.get("coverImage") or "").strip()]
    for b in pending:
        cache.pop(b["id"], None)

    print(f"Books total: {len(books)}")
    print(f"Pending lookups: {len(pending)}")

    done = 0
    found = 0
    missing = 0

    def worker(book: dict) -> tuple[str, str]:
        time.sleep(REQUEST_PAUSE)
        return book["id"], lookup_cover(book)

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(worker, b): b for b in pending}
        for fut in as_completed(futures):
            book = futures[fut]
            try:
                book_id, url = fut.result()
            except Exception as exc:  # noqa: BLE001
                print(f"error: {book['id']}: {exc}")
                book_id, url = book["id"], ""
            cache[book_id] = url
            if url:
                book["coverImage"] = url
                found += 1
            else:
                missing += 1
            done += 1
            if done % 20 == 0 or done == len(pending):
                save_json(CACHE_PATH, cache)
                save_json(BOOKS_PATH, books)
                print(f"progress {done}/{len(pending)} found={found} missing={missing}")

    save_json(CACHE_PATH, cache)
    save_json(BOOKS_PATH, books)
    filled = sum(1 for b in books if (b.get("coverImage") or "").strip())
    print(f"Done. Covers filled: {filled}/{len(books)}")


if __name__ == "__main__":
    main()
