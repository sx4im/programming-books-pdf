#!/usr/bin/env node
/**
 * Import books from ../docs/*.md into data/books.json.
 * Preserves existing author and coverImage values when ids match.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const docsDir = path.join(root, "docs");
const outFile = path.join(__dirname, "../data/books.json");

const CATEGORY_FROM_HEADING = {
  "for beginners": "beginner",
  "for intermediate developers": "intermediate",
  "for advanced programmers": "advanced",
  "for specialized fields": "specialized",
  "comprehensive references": "references",
};

const LANG_FILES = [
  "python",
  "javascript",
  "java",
  "csharp",
  "c",
  "cpp",
  "typescript",
  "go",
  "rust",
  "php",
  "kotlin",
  "sql",
  "swift",
  "dart",
  "shell",
  "r",
  "htmlcss",
  "lua",
  "matlab",
  "assembly",
  "haskell",
  "powershell",
  "zig",
  "solidity",
  "perl",
  "fortran",
  "objectivec",
  "clojure",
  "groovy",
  "vba",
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function loadExisting() {
  if (!fs.existsSync(outFile)) return new Map();
  try {
    const arr = JSON.parse(fs.readFileSync(outFile, "utf8"));
    return new Map(arr.map((b) => [b.id, b]));
  } catch {
    return new Map();
  }
}

function parseDoc(language, text) {
  const existing = arguments.length > 2 ? arguments[2] : new Map();
  const books = [];
  let category = "beginner";
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      const key = h2[1].trim().toLowerCase().replace(/\s+/g, " ");
      if (CATEGORY_FROM_HEADING[key]) category = CATEGORY_FROM_HEADING[key];
      continue;
    }

    const m = line.match(/^- \[\*\*(.+?)\*\*\]\((.+?)\)(?:\s*\((.+)\))?/);
    if (!m) continue;

    const title = m[1].trim();
    const driveUrl = m[2].trim();
    let edition = "";
    if (m[3]) {
      edition = m[3].replace(/^\*|\*$/g, "").trim();
    }

    const id = `${language}-${slugify(title)}`;
    const prev = existing.get(id);

    books.push({
      id,
      title,
      author: prev?.author ?? "",
      language,
      category,
      edition,
      driveUrl,
      coverImage: prev?.coverImage ?? "",
    });
  }

  return books;
}

function main() {
  const existing = loadExisting();
  const all = [];

  for (const lang of LANG_FILES) {
    const file = path.join(docsDir, `${lang}.md`);
    if (!fs.existsSync(file)) {
      console.warn(`skip missing ${file}`);
      continue;
    }
    const text = fs.readFileSync(file, "utf8");
    const books = parseDoc(lang, text, existing);
    console.log(`${lang}: ${books.length}`);
    all.push(...books);
  }

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(all, null, 2) + "\n");
  console.log(`Wrote ${all.length} books → ${path.relative(root, outFile)}`);
}

main();
