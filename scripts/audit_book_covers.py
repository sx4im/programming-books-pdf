#!/usr/bin/env python3
"""Audit catalog covers against Open Library / ISBN metadata.

Writes scripts/.cover_audit.json with per-book verdicts.
"""

from __future__ import annotations

import json
import re
import subprocess
import time
import urllib.parse
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOOKS_PATH = ROOT / "web" / "data" / "books.json"
OUT_PATH = ROOT / "scripts" / ".cover_audit.json"
UA = "FreeProgrammingBooksCoverAudit/1.0"
SKIP_EDITION = re.compile(
    r"online resource|official reference|official language", re.I
)
STOP = {
    "a",
    "an",
    "the",
    "of",
    "and",
    "in",
    "to",
    "for",
    "with",
    "on",
    "by",
    "from",
}


def http_get_json(url: str, retries: int = 4) -> dict | list:
    last = None
    for i in range(retries):
        try:
            proc = subprocess.run(
                [
                    "curl",
                    "-sS",
                    "-m",
                    "25",
                    "-A",
                    UA,
                    "-H",
                    "Accept: application/json",
                    url,
                ],
                capture_output=True,
                text=True,
                check=False,
            )
            if proc.returncode == 0 and proc.stdout.strip():
                return json.loads(proc.stdout)
            last = proc.stderr or proc.stdout[:200] or f"curl {proc.returncode}"
        except Exception as exc:  # noqa: BLE001
            last = exc
        time.sleep(1.2 * (i + 1))
    raise RuntimeError(f"GET failed {url}: {last}")


def normalize(text: str) -> str:
    text = (text or "").lower()
    text = text.replace("c++", "cpp").replace("c#", "csharp").replace("f#", "fsharp")
    text = text.replace("objective-c", "objectivec").replace("node.js", "nodejs")
    text = re.sub(r"[^\w\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def tokens(text: str) -> set[str]:
    return {w for w in normalize(text).split() if w and w not in STOP and len(w) > 1}


def title_overlap(a: str, b: str) -> float:
    aw, bw = tokens(a), tokens(b)
    if not aw:
        return 0.0
    return len(aw & bw) / len(aw)


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


def extract_nth(text: str) -> str | None:
    t = normalize(text)
    m = re.search(r"\b(\d+)\s*(st|nd|rd|th)?\s*edition\b", t)
    if m:
        return m.group(1)
    m = re.search(r"\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+edition\b", t)
    if m:
        words = {
            "first": "1",
            "second": "2",
            "third": "3",
            "fourth": "4",
            "fifth": "5",
            "sixth": "6",
            "seventh": "7",
            "eighth": "8",
            "ninth": "9",
            "tenth": "10",
        }
        return words[m.group(1)]
    m = re.search(r",\s*(\d+)\s*(st|nd|rd|th)?\b", t)
    if m:
        return m.group(1)
    return None


def extract_year(text: str) -> str | None:
    m = re.search(r"\b((?:19|20)\d{2})\b", text or "")
    return m.group(1) if m else None


def parse_cover(url: str) -> tuple[str, str]:
    url = (url or "").strip()
    if not url:
        return "empty", ""
    m = re.search(r"covers\.openlibrary\.org/b/id/(\d+)", url)
    if m:
        return "ol_id", m.group(1)
    m = re.search(r"covers\.openlibrary\.org/b/isbn/(\d{9,13}[Xx]?)", url)
    if m:
        return "ol_isbn", m.group(1)
    if "images.manning.com" in url or "manning.com" in url:
        return "manning", url
    if "goodreads.com" in url or "media-amazon.com" in url:
        return "goodreads", url
    if "isbndb.com" in url:
        return "isbndb", url
    if url.startswith("/covers/"):
        return "local", url
    host = urllib.parse.urlparse(url).netloc
    return "other", host


def chunks(items: list, n: int):
    for i in range(0, len(items), n):
        yield items[i : i + n]


def fetch_ol_by_cover_ids(cover_ids: list[str]) -> dict[str, dict]:
    out: dict[str, dict] = {}
    unique = list(dict.fromkeys(cover_ids))
    for group in chunks(unique, 20):
        q = " OR ".join(f"cover_i:{i}" for i in group)
        url = "https://openlibrary.org/search.json?" + urllib.parse.urlencode(
            {
                "q": q,
                "limit": max(len(group) * 2, 20),
                "fields": "key,title,subtitle,cover_i,first_publish_year,author_name,cover_edition_key,edition_count,isbn",
            }
        )
        data = http_get_json(url)
        for doc in data.get("docs") or []:
            cid = str(doc.get("cover_i") or "")
            if cid and cid not in out:
                out[cid] = doc
        missing = [i for i in group if i not in out]
        # fallback one-by-one for misses
        for cid in missing:
            url = "https://openlibrary.org/search.json?" + urllib.parse.urlencode(
                {
                    "q": f"cover_i:{cid}",
                    "limit": 1,
                    "fields": "key,title,subtitle,cover_i,first_publish_year,author_name,cover_edition_key,edition_count,isbn",
                }
            )
            try:
                data = http_get_json(url)
            except Exception:
                continue
            docs = data.get("docs") or []
            if docs:
                out[cid] = docs[0]
        time.sleep(0.2)
        print(f"  ol covers {len(out)}/{len(unique)}", flush=True)
    return out


def fetch_editions(olids: list[str]) -> dict[str, dict]:
    out: dict[str, dict] = {}
    unique = [x for x in dict.fromkeys(olids) if x]
    for group in chunks(unique, 20):
        bib = ",".join(f"OLID:{x}" for x in group)
        url = "https://openlibrary.org/api/books?" + urllib.parse.urlencode(
            {"bibkeys": bib, "format": "json", "jscmd": "details"}
        )
        try:
            data = http_get_json(url)
        except Exception as exc:  # noqa: BLE001
            print("  edition batch fail", exc)
            continue
        for key, val in (data or {}).items():
            olid = key.replace("OLID:", "")
            out[olid] = val
        time.sleep(0.15)
        print(f"  editions {len(out)}/{len(unique)}", flush=True)
    return out


def fetch_isbn_meta(isbns: list[str]) -> dict[str, dict]:
    out: dict[str, dict] = {}
    unique = list(dict.fromkeys(isbns))
    for isbn in unique:
        url = f"https://openlibrary.org/isbn/{isbn}.json"
        try:
            data = http_get_json(url, retries=2)
            out[isbn] = data if isinstance(data, dict) else {}
        except Exception:
            # search fallback
            try:
                data = http_get_json(
                    "https://openlibrary.org/search.json?"
                    + urllib.parse.urlencode({"isbn": isbn, "limit": 1})
                )
                docs = data.get("docs") or []
                if docs:
                    out[isbn] = docs[0]
            except Exception:
                out[isbn] = {}
        time.sleep(0.12)
    print(f"  isbn meta {sum(1 for v in out.values() if v)}/{len(unique)}", flush=True)
    return out


def edition_fields(edition: dict | None) -> dict:
    if not edition:
        return {}
    # jscmd=details wraps payload
    details = edition.get("details") if "details" in edition else edition
    if not isinstance(details, dict):
        details = edition
    publishers = details.get("publishers") or []
    pub_names = []
    for p in publishers:
        if isinstance(p, dict):
            pub_names.append(p.get("name") or "")
        else:
            pub_names.append(str(p))
    return {
        "title": details.get("title") or edition.get("title") or "",
        "subtitle": details.get("subtitle") or "",
        "publish_date": details.get("publish_date") or "",
        "edition_name": details.get("edition_name") or "",
        "publishers": " ".join(pub_names),
    }


def ol_blob(doc: dict, edition: dict | None) -> str:
    ed = edition_fields(edition)
    # Prefer edition-specific fields first so year/nth extraction hits the cover edition.
    parts = [
        ed.get("title") or "",
        ed.get("subtitle") or "",
        ed.get("edition_name") or "",
        ed.get("publish_date") or "",
        ed.get("publishers") or "",
        doc.get("title") or "",
        doc.get("subtitle") or "",
        " ".join(doc.get("author_name") or []),
        str(doc.get("first_publish_year") or ""),
    ]
    return " ".join(str(p) for p in parts if p)


def verdict_for(
    book: dict,
    source: str,
    meta_title: str,
    meta_blob: str,
    first_year: str | None,
) -> dict:
    title = book.get("title") or ""
    edition = book.get("edition") or ""
    kind, value = edition_info(edition)
    overlap = title_overlap(title, meta_title) if meta_title else 0.0
    # also try blob
    overlap_blob = title_overlap(title, meta_blob) if meta_blob else 0.0
    overlap = max(overlap, overlap_blob)

    meta_nth = extract_nth(meta_blob) or extract_nth(meta_title)
    meta_year = extract_year(meta_blob) or first_year

    status = "ok"
    reasons: list[str] = []

    if SKIP_EDITION.search(edition):
        return {
            "status": "skip_docs",
            "reasons": ["online/official resource"],
            "overlap": round(overlap, 3),
            "meta_title": meta_title,
            "meta_nth": meta_nth,
            "meta_year": meta_year,
            "catalog_kind": kind,
            "catalog_value": value,
            "source": source,
        }

    if not meta_title:
        status = "unknown"
        reasons.append("no metadata for cover")
    elif overlap < 0.45:
        status = "wrong_book"
        reasons.append(f"title overlap {overlap:.2f} vs {meta_title!r}")
    else:
        if kind == "nth" and value:
            if meta_nth:
                if meta_nth != value:
                    # 1st-only books listed as later edition, or vice versa
                    if value not in {"1"} or meta_nth not in {"1"}:
                        status = "wrong_edition"
                        reasons.append(
                            f"catalog {ordinal(value)} vs cover {ordinal(meta_nth)}"
                        )
            else:
                # no explicit edition on cover metadata
                if value not in {"1"}:
                    # Heuristic: old first_publish_year strongly suggests old cover
                    # when catalog wants 2nd+ edition.
                    year_i = int(first_year) if first_year and first_year.isdigit() else None
                    expected_min = {
                        "2": 2008,
                        "3": 2014,
                        "4": 2016,
                        "5": 2018,
                        "6": 2018,
                        "7": 2019,
                        "8": 2020,
                        "9": 2021,
                        "10": 2022,
                        "11": 2022,
                        "12": 2023,
                        "13": 2023,
                    }.get(value)
                    if year_i and expected_min and year_i < expected_min - 8:
                        status = "likely_old_edition"
                        reasons.append(
                            f"catalog {ordinal(value)} edition; cover metadata has no edition token and first_publish_year={year_i}"
                        )
                    elif year_i and value not in {"1"} and year_i <= 2012 and int(value) >= 3:
                        status = "likely_old_edition"
                        reasons.append(
                            f"catalog {ordinal(value)} edition; cover year {year_i} looks like an early edition"
                        )
                    else:
                        status = "unconfirmed_edition"
                        reasons.append(
                            f"catalog {ordinal(value)} edition; cover has no edition token (year={first_year})"
                        )
        elif kind == "year" and value:
            if meta_year and meta_year != value:
                # allow +/- 1 year
                try:
                    if abs(int(meta_year) - int(value)) >= 2:
                        status = "wrong_edition"
                        reasons.append(f"catalog year {value} vs cover {meta_year}")
                except ValueError:
                    pass

    if not reasons and status == "ok":
        reasons.append("title matches" + (f"; edition {value}" if value else ""))

    return {
        "status": status,
        "reasons": reasons,
        "overlap": round(overlap, 3),
        "meta_title": meta_title,
        "meta_nth": meta_nth,
        "meta_year": meta_year,
        "catalog_kind": kind,
        "catalog_value": value,
        "source": source,
    }


def manning_title_from_url(url: str) -> str:
    # https://images.manning.com/.../harms.png  — filename is not always title
    return ""


def main() -> None:
    books = json.loads(BOOKS_PATH.read_text(encoding="utf-8"))
    ol_ids: list[str] = []
    isbns: list[str] = []
    by_id = {}
    parsed = {}
    for b in books:
        src, val = parse_cover(b.get("coverImage") or "")
        parsed[b["id"]] = (src, val)
        if src == "ol_id":
            ol_ids.append(val)
        elif src == "ol_isbn":
            isbns.append(val)
        by_id[b["id"]] = b

    print(f"Books {len(books)}; OL ids {len(set(ol_ids))}; OL isbn {len(set(isbns))}", flush=True)
    print("Fetching Open Library works for cover ids...", flush=True)
    ol_docs = fetch_ol_by_cover_ids(ol_ids)
    olids = [
        (doc.get("cover_edition_key") or "")
        for doc in ol_docs.values()
        if doc.get("cover_edition_key")
    ]
    print("Fetching cover editions...", flush=True)
    editions = fetch_editions(olids)
    print("Fetching ISBN metadata...", flush=True)
    isbn_meta = fetch_isbn_meta(isbns)

    results = []
    for b in books:
        src, val = parsed[b["id"]]
        edition = b.get("edition") or ""
        cover = b.get("coverImage") or ""
        rec = {
            "id": b["id"],
            "title": b.get("title"),
            "edition": edition,
            "language": b.get("language"),
            "coverImage": cover,
            "source": src,
        }
        if SKIP_EDITION.search(edition) or src == "local":
            rec.update(
                verdict_for(b, src, b.get("title") or "", "", None)
            )
            rec["status"] = "skip_docs"
            rec["reasons"] = ["docs/reference cover"]
            results.append(rec)
            continue

        meta_title = ""
        meta_blob = ""
        first_year = None
        edition_doc = None
        if src == "ol_id":
            doc = ol_docs.get(val) or {}
            meta_title = " ".join(
                x for x in [doc.get("title") or "", doc.get("subtitle") or ""] if x
            )
            first_year = str(doc.get("first_publish_year") or "") or None
            edition_doc = editions.get(doc.get("cover_edition_key") or "")
            edf = edition_fields(edition_doc)
            meta_blob = ol_blob(doc, edition_doc)
            if edf.get("title"):
                meta_title = " ".join(
                    x
                    for x in [edf.get("title") or "", edf.get("subtitle") or "", edf.get("edition_name") or ""]
                    if x
                ) or meta_title
            first_year = extract_year(edf.get("publish_date") or "") or first_year
        elif src == "ol_isbn":
            doc = isbn_meta.get(val) or {}
            meta_title = " ".join(
                x
                for x in [
                    doc.get("title") or "",
                    doc.get("subtitle") or "",
                ]
                if x
            )
            first_year = extract_year(str(doc.get("publish_date") or doc.get("first_publish_year") or ""))
            meta_blob = ol_blob(doc, None) if doc else val
        elif src == "manning":
            # Filename sometimes is author; keep unknown unless title overlap via slug
            rec.update(
                {
                    "status": "unconfirmed_publisher",
                    "reasons": ["manning CDN — not reverse-looked-up"],
                    "overlap": 0,
                    "meta_title": "",
                    "meta_nth": None,
                    "meta_year": None,
                    "catalog_kind": edition_info(edition)[0],
                    "catalog_value": edition_info(edition)[1],
                    "source": src,
                }
            )
            results.append(rec)
            continue
        elif src in {"goodreads", "isbndb", "other"}:
            rec.update(
                {
                    "status": "unconfirmed_publisher",
                    "reasons": [f"{src} cover — not reverse-looked-up"],
                    "overlap": 0,
                    "meta_title": "",
                    "meta_nth": None,
                    "meta_year": None,
                    "catalog_kind": edition_info(edition)[0],
                    "catalog_value": edition_info(edition)[1],
                    "source": src,
                }
            )
            results.append(rec)
            continue
        else:
            rec.update(
                verdict_for(b, src, "", "", None)
            )
            results.append(rec)
            continue

        rec.update(verdict_for(b, src, meta_title, meta_blob, first_year))
        results.append(rec)

    counts = Counter(r["status"] for r in results)
    summary = {
        "counts": dict(counts),
        "total": len(results),
        "wrong": [r for r in results if r["status"] in {"wrong_book", "wrong_edition"}],
        "likely_old": [r for r in results if r["status"] == "likely_old_edition"],
        "unconfirmed_edition": [
            r for r in results if r["status"] == "unconfirmed_edition"
        ],
        "all": results,
    }
    OUT_PATH.write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n")
    print("STATUS COUNTS:", dict(counts))
    print(f"Wrote {OUT_PATH}")
    print("\n=== WRONG BOOK ===")
    for r in summary["wrong"]:
        if r["status"] != "wrong_book":
            continue
        print(f"- {r['title']} [{r['edition']}] -> {r.get('meta_title')} | {r['reasons']}")
    print("\n=== WRONG EDITION ===")
    for r in summary["wrong"]:
        if r["status"] != "wrong_edition":
            continue
        print(
            f"- {r['title']} [{r['edition']}] cover={r.get('meta_title')} "
            f"nth={r.get('meta_nth')} year={r.get('meta_year')} | {r['reasons']}"
        )
    print("\n=== LIKELY OLD EDITION ===")
    for r in summary["likely_old"]:
        print(
            f"- {r['title']} [{r['edition']}] cover={r.get('meta_title')} "
            f"year={r.get('meta_year')} | {r['reasons']}"
        )


if __name__ == "__main__":
    main()
