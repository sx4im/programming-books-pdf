#!/usr/bin/env python3
"""Prefer Open Library covers that match each book's listed edition."""

from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOOKS_PATH = ROOT / "web" / "data" / "books.json"
UA = "FreeProgrammingBooksCoverBot/1.1 (edition rematch)"
COVER_TMPL = "https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
MAX_WORKERS = 5
PAUSE = 0.12


def normalize(text: str) -> str:
    text = text.lower()
    text = text.replace("c++", "cpp").replace("c#", "csharp")
    text = text.replace("javascript", "java script").replace("typescript", "type script")
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text.replace("java script", "javascript").replace("type script", "typescript")


def edition_number(edition: str) -> str | None:
    ed = (edition or "").lower()
    m = re.search(r"(\d+)\s*(st|nd|rd|th)?\s*edition", ed)
    if m:
        return m.group(1)
    m = re.search(r"\b(19|20)\d{2}\b", ed)
    if m:
        return m.group(0)
    return None


def http_get_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def search(title: str, edition: str) -> list[dict]:
    queries = [title]
    num = edition_number(edition)
    if num and "edition" in (edition or "").lower():
        queries.append(f"{title} {num} edition")
        queries.append(f"{title} {num}nd edition" if num == "2" else f"{title} {num}th edition")
        if num == "1":
            queries.append(f"{title} 1st edition")
        elif num == "2":
            queries.append(f"{title} 2nd edition")
        elif num == "3":
            queries.append(f"{title} 3rd edition")
        else:
            queries.append(f"{title} {num}th edition")
    core = re.split(r"[:–—|(]", title, maxsplit=1)[0].strip()
    if core and core not in queries:
        queries.append(core)

    docs: list[dict] = []
    seen = set()
    for q in queries:
        url = "https://openlibrary.org/search.json?" + urllib.parse.urlencode(
            {"q": q, "limit": 15}
        )
        try:
            data = http_get_json(url)
        except Exception:
            time.sleep(0.4)
            continue
        for doc in data.get("docs") or []:
            key = doc.get("key") or doc.get("cover_i")
            if key in seen:
                continue
            seen.add(key)
            docs.append(doc)
        time.sleep(PAUSE)
    return docs


def title_score(doc_title: str, book_title: str) -> float:
    a = set(normalize(book_title).split())
    b = set(normalize(doc_title).split())
    if not a:
        return 0.0
    return len(a & b) / len(a)


def pick_cover(docs: list[dict], book_title: str, edition: str) -> tuple[str, bool]:
    """Return (cover_url, edition_matched)."""
    num = edition_number(edition)
    ranked: list[tuple[float, dict]] = []
    for doc in docs:
        if not doc.get("cover_i"):
            continue
        score = title_score(doc.get("title") or "", book_title)
        if score < 0.5:
            continue
        doc_title = normalize(doc.get("title") or "")
        ed_bonus = 0.0
        if num:
            # Match "3rd edition", "3 edition", ", 3rd", etc.
            if re.search(rf"\b{re.escape(num)}(st|nd|rd|th)?\s*edition\b", doc_title):
                ed_bonus = 2.0
            elif re.search(rf",\s*{re.escape(num)}(st|nd|rd|th)?\b", doc_title):
                ed_bonus = 1.5
            elif num in doc_title and "edition" in doc_title:
                ed_bonus = 1.0
        ranked.append((score + ed_bonus + min(int(doc.get("edition_count") or 0), 10) * 0.01, doc))

    if not ranked:
        return "", False
    ranked.sort(key=lambda x: x[0], reverse=True)
    best_score, best = ranked[0]
    url = COVER_TMPL.format(cover_id=int(best["cover_i"]))
    matched = best_score >= 1.5  # title overlap + edition bonus
    return url, matched


def current_cover_id(url: str) -> str | None:
    m = re.search(r"/b/id/(\d+)-", url or "")
    return m.group(1) if m else None


def process(book: dict) -> tuple[str, str, str]:
    """Returns (id, new_url_or_empty, reason)."""
    edition = book.get("edition") or ""
    num = edition_number(edition)
    # Only rematch numbered / year editions (skip Online Resource, etc.)
    if not num:
        return book["id"], "", "skip"
    if "online" in edition.lower() or "official" in edition.lower():
        return book["id"], "", "skip"

    docs = search(book["title"], edition)
    url, matched = pick_cover(docs, book["title"], edition)
    if not url:
        return book["id"], "", "miss"
    old_id = current_cover_id(book.get("coverImage") or "")
    new_id = current_cover_id(url)
    if old_id and new_id and old_id == new_id:
        return book["id"], "", "same"
    if matched or not old_id:
        return book["id"], url, "update" if matched else "fill"
    # If not clearly edition-matched, still update when title is strong and
    # current cover is Open Library (prefer fresher ranked result).
    if (book.get("coverImage") or "").startswith("https://covers.openlibrary.org/") and new_id:
        # Only replace when the winning doc title includes the edition token
        return book["id"], url if matched else "", "keep"
    return book["id"], "", "keep"


def main() -> None:
    books = json.loads(BOOKS_PATH.read_text(encoding="utf-8"))
    candidates = [
        b
        for b in books
        if edition_number(b.get("edition") or "")
        and "online" not in (b.get("edition") or "").lower()
    ]
    print(f"Candidates: {len(candidates)}")

    updates: dict[str, str] = {}
    stats = {"update": 0, "same": 0, "miss": 0, "skip": 0, "keep": 0, "fill": 0}

    def worker(book: dict):
        time.sleep(PAUSE)
        return process(book)

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(worker, b): b for b in candidates}
        done = 0
        for fut in as_completed(futures):
            book = futures[fut]
            try:
                book_id, url, reason = fut.result()
            except Exception as exc:  # noqa: BLE001
                print(f"error {book['id']}: {exc}")
                book_id, url, reason = book["id"], "", "miss"
            stats[reason] = stats.get(reason, 0) + 1
            if url:
                updates[book_id] = url
                print(f"+ {book['title'][:55]} [{book.get('edition')}] -> {url}")
            done += 1
            if done % 25 == 0:
                print(f"progress {done}/{len(candidates)} updates={len(updates)} {stats}")

    changed = 0
    for b in books:
        if b["id"] in updates:
            b["coverImage"] = updates[b["id"]]
            changed += 1

    BOOKS_PATH.write_text(json.dumps(books, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Done. Updated {changed} covers. Stats={stats}")


if __name__ == "__main__":
    main()
