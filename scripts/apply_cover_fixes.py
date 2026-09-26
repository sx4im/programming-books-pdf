#!/usr/bin/env python3
"""Apply high-confidence cover replacements for wrong-edition / wrong-book entries.

Uses a small ISBN override map plus Open Library work-editions matching.
"""

from __future__ import annotations

import json
import re
import subprocess
import time
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOOKS_PATH = ROOT / "web" / "data" / "books.json"
AUDIT_PATH = ROOT / "scripts" / ".cover_audit.json"
PLAN_PATH = ROOT / "scripts" / ".cover_fix_plan.json"
UA = "FreeProgrammingBooksCoverAudit/1.0"
OL_ISBN = "https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"
OL_ID = "https://covers.openlibrary.org/b/id/{id}-L.jpg"

# Visually confirmed mismatches with working Open Library ISBN covers.
ISBN_OVERRIDES = {
    "python-head-first-python": "9781492051299",  # 3rd, 2023
    "python-fluent-python": "9781492056355",  # 2nd
    "python-python-for-data-analysis": "9781098104030",  # 3rd
    "python-python-data-science-handbook": "9781098121228",  # try 2e
    "java-head-first-java": "9781491910771",  # 3rd, 2022
    "c-c-programming-a-modern-approach": "9780393979503",  # 2nd (King)
    "cpp-a-tour-of-c": "9780136816485",  # 3rd
    "cpp-the-c-programming-language": "9780321563842",  # 4th
    "javascript-learning-javascript-design-patterns": "9781098139872",  # 2nd
    "python-deep-learning-with-python": "9781617296864",  # latest (2nd; catalog says 3rd)
    "csharp-c-in-depth": "9781617294532",  # 4th
    "c-extreme-c-taking-the-c-language-to-its-limits": "9781789341111",  # Packt Extreme C
    "htmlcss-css-the-definitive-guide": "9781449393199",  # fallback; 5e ISBN may 404
    "perl-learning-perl": "9781492094951",
    "python-introducing-python-modern-computing-in-simple-packages": "9781098174408",
    "python-effective-python-125-specific-ways-to-write-better-python": "9780138173661",
    "javascript-javascript-for-data-science": "9780367426453",
    "cpp-starting-out-with-c-from-control-structures-through-objects": "9780134498379",
    "csharp-head-first-c": "9781098141776",
    "ruby-ruby-on-rails-tutorial": "9780138045746",
    "scala-programming-in-scala": "9780997141665",
    "java-effective-java": None,  # visually confirmed 3rd edition — keep
}

# Completely wrong non-book images → shared reference art.
FORCE_REFERENCE = {
    "c-c23-standard-iso-iec-9899-2024",  # 1921 highway-materials bulletin
}

SKIP_STATUSES = {"skip_docs", "ok", "unconfirmed_publisher"}
REFERENCE_SRC = "/covers/reference.svg"


def curl_json(url: str, retries: int = 3) -> dict:
    last = None
    for i in range(retries):
        proc = subprocess.run(
            ["curl", "-sS", "-m", "22", "-A", UA, "-H", "Accept: application/json", url],
            capture_output=True,
            text=True,
            check=False,
        )
        if proc.returncode == 0 and proc.stdout.strip().startswith(("{", "[")):
            try:
                return json.loads(proc.stdout)
            except json.JSONDecodeError as exc:
                last = exc
        else:
            last = proc.stderr or proc.returncode
        time.sleep(0.7 * (i + 1))
    return {}


def cover_exists(url: str) -> bool:
    check = url + ("&" if "?" in url else "?") + "default=false"
    proc = subprocess.run(
        ["curl", "-sS", "-o", "/dev/null", "-w", "%{http_code}", "-m", "12", "-A", UA, check],
        capture_output=True,
        text=True,
        check=False,
    )
    code = (proc.stdout or "").strip()
    return code in {"200", "301", "302"}


def normalize(text: str) -> str:
    text = (text or "").lower()
    text = text.replace("c++", "cpp").replace("c#", "csharp")
    text = re.sub(r"[^\w\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def tokens(text: str) -> set[str]:
    stop = {"a", "an", "the", "of", "and", "in", "to", "for", "with", "on", "by"}
    return {w for w in normalize(text).split() if w not in stop and len(w) > 1}


def overlap(a: str, b: str) -> float:
    aw = tokens(a)
    if not aw:
        return 0.0
    return len(aw & tokens(b)) / len(aw)


def edition_info(edition: str) -> tuple[str | None, str | None]:
    ed = edition or ""
    m = re.search(r"(\d+)\s*(st|nd|rd|th)?\s*edition", ed, re.I)
    if m:
        return "nth", m.group(1)
    if re.search(r"\bfirst\b", ed, re.I) and re.search(r"\bedition\b", ed, re.I):
        return "nth", "1"
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


def edition_in_text(text: str, kind: str | None, value: str | None) -> bool:
    if not kind or not value:
        return False
    t = normalize(text)
    if kind == "nth":
        ord_ = ordinal(value)
        word = {
            "1": "first",
            "2": "second",
            "3": "third",
            "4": "fourth",
            "5": "fifth",
            "6": "sixth",
            "7": "seventh",
            "8": "eighth",
            "9": "ninth",
            "10": "tenth",
            "13": "thirteenth",
        }.get(value)
        pats = [
            rf"\b{re.escape(value)}\s*edition\b",
            rf"\b{re.escape(ord_)}\s*edition\b",
            rf"\b{re.escape(ord_)}\b",
        ]
        if word:
            pats.append(rf"\b{word}\s+edition\b")
        return any(re.search(p, t) for p in pats)
    if kind == "year":
        return bool(re.search(rf"\b{re.escape(value)}\b", t))
    return False


def parse_year(text: str) -> int | None:
    m = re.search(r"\b((?:19|20)\d{2})\b", text or "")
    return int(m.group(1)) if m else None


def search_work(title: str) -> dict | None:
    url = "https://openlibrary.org/search.json?" + urllib.parse.urlencode(
        {
            "title": title.split(":")[0].strip(),
            "limit": 8,
            "fields": "key,title,subtitle,cover_i,edition_count,cover_edition_key,first_publish_year",
        }
    )
    data = curl_json(url)
    best, best_ov = None, 0.0
    for doc in data.get("docs") or []:
        dt = " ".join(x for x in [doc.get("title") or "", doc.get("subtitle") or ""] if x)
        ov = overlap(title, dt)
        if ov > best_ov:
            best_ov, best = ov, doc
    return best if best_ov >= 0.5 else None


def pick_from_editions(book: dict) -> tuple[str, str]:
    kind, value = edition_info(book.get("edition") or "")
    work = search_work(book["title"])
    if not work or not work.get("key"):
        return "", "no-work"
    eds = curl_json(f"https://openlibrary.org{work['key']}/editions.json?limit=40")
    entries = eds.get("entries") or []
    ranked: list[tuple[float, str, str]] = []
    for e in entries:
        etitle = e.get("title") or ""
        blob = " ".join(
            str(x)
            for x in [
                etitle,
                e.get("subtitle") or "",
                e.get("edition_name") or "",
                e.get("publish_date") or "",
            ]
            if x
        )
        ov = overlap(book["title"], etitle)
        if ov < 0.45:
            continue
        covers = [c for c in (e.get("covers") or []) if isinstance(c, int) and c > 0]
        isbn = None
        for field in ("isbn_13", "isbn_10"):
            vals = e.get(field) or []
            if vals:
                isbn = re.sub(r"[^0-9Xx]", "", str(vals[0]))
                break
        url = OL_ID.format(id=covers[0]) if covers else (OL_ISBN.format(isbn=isbn) if isbn else "")
        if not url:
            continue
        score = ov * 5
        if edition_in_text(blob, kind, value):
            score += 20
        y = parse_year(str(e.get("publish_date") or ""))
        if kind == "nth" and value and y:
            # later numbered editions tend to be newer
            want = int(value)
            if want >= 3 and y >= 2018:
                score += 2
            if want >= 2 and y >= 2016:
                score += 1
        ranked.append((score, url, blob[:80]))
    if not ranked:
        return "", "no-edition-cover"
    ranked.sort(key=lambda x: x[0], reverse=True)
    best_score, url, blob = ranked[0]
    if kind in {"nth", "year"} and value not in {None, "1"}:
        if best_score < 20:
            return "", f"no-edition-match ({blob})"
    return url, f"editions:{blob}"


def resolve(book: dict) -> dict:
    bid = book["id"]
    old = book.get("coverImage") or ""
    if bid in FORCE_REFERENCE:
        return {"id": bid, "new": REFERENCE_SRC, "reason": "force-reference", "changed": old != REFERENCE_SRC}
    if bid in ISBN_OVERRIDES:
        isbn = ISBN_OVERRIDES[bid]
        if isbn is None:
            return {"id": bid, "new": old, "reason": "keep-visual-ok", "changed": False}
        url = OL_ISBN.format(isbn=isbn)
        if cover_exists(url):
            return {"id": bid, "new": url, "reason": f"isbn:{isbn}", "changed": url != old}
        return {"id": bid, "new": old, "reason": f"isbn-missing:{isbn}", "changed": False}
    url, reason = pick_from_editions(book)
    if url and url != old:
        # don't replace with same ol id via isbn
        return {"id": bid, "new": url, "reason": reason, "changed": True}
    return {"id": bid, "new": old, "reason": reason or "unchanged", "changed": False}


def main() -> None:
    books = json.loads(BOOKS_PATH.read_text(encoding="utf-8"))
    audit = json.loads(AUDIT_PATH.read_text(encoding="utf-8"))
    status_by_id = {r["id"]: r["status"] for r in audit["all"]}
    # Always try ISBN overrides even if marked ok
    override_ids = set(ISBN_OVERRIDES) | set(FORCE_REFERENCE)
    candidates = [
        b
        for b in books
        if b["id"] in override_ids
        or status_by_id.get(b["id"]) in {
            "wrong_book",
            "wrong_edition",
            "likely_old_edition",
            "unconfirmed_edition",
            "unknown",
        }
    ]
    print(f"Candidates {len(candidates)}", flush=True)
    results = []
    updates = {}
    with ThreadPoolExecutor(max_workers=4) as pool:
        futs = {pool.submit(resolve, b): b for b in candidates}
        done = 0
        for fut in as_completed(futs):
            book = futs[fut]
            try:
                rec = fut.result()
            except Exception as exc:  # noqa: BLE001
                rec = {"id": book["id"], "new": book.get("coverImage"), "reason": str(exc), "changed": False}
            rec["title"] = book["title"]
            rec["edition"] = book.get("edition")
            rec["old"] = book.get("coverImage")
            rec["status"] = status_by_id.get(book["id"])
            results.append(rec)
            if rec["changed"] and rec.get("new"):
                updates[book["id"]] = rec["new"]
                print(
                    f"+ {book['title'][:50]} [{book.get('edition')}] {rec['reason']}\n"
                    f"   -> {rec['new'][:80]}",
                    flush=True,
                )
            done += 1
            if done % 15 == 0:
                print(f"progress {done}/{len(candidates)} updates={len(updates)}", flush=True)

    changed = 0
    for b in books:
        if b["id"] in updates:
            b["coverImage"] = updates[b["id"]]
            changed += 1
    BOOKS_PATH.write_text(json.dumps(books, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    PLAN_PATH.write_text(
        json.dumps(
            {"changed": changed, "updates": updates, "results": results},
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {changed} covers to books.json", flush=True)


if __name__ == "__main__":
    main()
