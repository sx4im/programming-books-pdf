#!/usr/bin/env node
/**
 * Validate book URLs in data/books.json.
 * - Reject placeholder / fake hosts (example.com, etc.)
 * - Prefer Google Drive for PDF books; allow a small docs allowlist for references
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const booksFile = path.join(__dirname, "../data/books.json");

const BLOCKED_HOSTS = [
  "example.com",
  "example.org",
  "example.net",
  "localhost",
  "127.0.0.1",
  "test.com",
  "placeholder.com",
  "domain.com",
  "yoursite.com",
  "link.com",
];

const ALLOWED_NON_DRIVE = [
  "docs.scala-lang.org",
  "doc.rust-lang.org",
  "docs.julialang.org",
  "dart.dev",
  "www.typescriptlang.org",
  "go.dev",
  "golang.org",
  "elixir-lang.org",
  "hexdocs.pm",
  "developer.mozilla.org",
  "kotlinlang.org",
  "docs.oracle.com",
  "learn.microsoft.com",
  "developer.apple.com",
  "www.php.net",
  "ruby-doc.org",
  "cran.r-project.org",
  "tldp.org",
  "www.gnu.org",
  "linuxcommand.org",
  "mywiki.wooledge.org",
  "www.shellcheck.net",
  "google.github.io",
  "r4ds.hadley.nz",
  "adv-r.hadley.nz",
  "r-pkgs.org",
  "ggplot2-book.org",
  "r-graphics.org",
  "rstudio-education.github.io",
  "csgillespie.github.io",
  "www.statlearning.com",
  "hastie.su.domains",
  "mastering-shiny.org",
  "www.tidytextmining.com",
  "otexts.com",
  "r.geocompx.org",
  "rc2e.com",
  "benlauwens.github.io",
  "en.wikibooks.org",
  "algorithmsbook.com",
  "juliadatascience.io",
  "github.com",
  "www.creativescala.org",
  "www.handsonscala.com",
  "scalawithcats.com",
  "www.scalawithcats.com",
  "zionomicon.com",
  "www.zionomicon.com",
  "underscore.io",
  "jeroenjanssens.com",
  "elixirschool.com",
  "www.erlang.org",
  "pages.vaadin.com",
  "frontendmasters.com",
  "basarat.gitbook.io",
  "typescript-weekly.com",
  "www.typescript-weekly.com",
  "play.kotlinlang.org",
  "open-std.org",
  "www.open-std.org",
  "pubs.opengroup.org",
  "automatetheboringstuff.com",
  "eloquentjavascript.net",
  "www.oreilly.com",
  "learning.oreilly.com",
  "www.wiley.com",
  "www.pearson.com",
  "www.manning.com",
  "www.packtpub.com",
  "books.google.com",
  "www.goodreads.com",
  "en.wikipedia.org",
  "www.amazon.com",
  "beej.us",
  "www.lurklurk.org",
  "phptherightway.com",
  "modern-sql.com",
  "docs.swift.org",
  "www.ruby-lang.org",
  "rubystyle.guide",
  "www.rdocumentation.org",
  "juliaacademy.com",
  // New languages (HTML/CSS, Lua, MATLAB, Assembly, Haskell, PowerShell, Zig, Solidity, Perl, Fortran, Objective-C, Clojure, Groovy, VBA)
  "caniuse.com",
  "every-layout.dev",
  "www.smashingmagazine.com",
  "www.lua.org",
  "lua-users.org",
  "craftinginterpreters.com",
  "www.mathworks.com",
  "matlabacademy.mathworks.com",
  "epubs.siam.org",
  "download-mirror.savannah.gnu.org",
  "www.intel.com",
  "developer.arm.com",
  "learnyouahaskell.com",
  "haskellbook.com",
  "book.realworldhaskell.org",
  "thinkingwithtypes.com",
  "www.haskell.org",
  "hoogle.haskell.org",
  "www.cambridge.org",
  "nostarch.com",
  "leanpub.com",
  "www.powershellgallery.com",
  "ziglang.org",
  "ziglearn.org",
  "zig.guide",
  "www.openmymind.net",
  "pedropark99.github.io",
  "solidity-by-example.org",
  "cryptozombies.io",
  "docs.soliditylang.org",
  "ethereum.org",
  "consensys.github.io",
  "ethernaut.openzeppelin.com",
  "perldoc.perl.org",
  "perlmaven.com",
  "www.modernperlbooks.com",
  "hop.perl.plover.com",
  "fortran-lang.org",
  "fortranwiki.org",
  "www.openmp.org",
  "clojure.org",
  "clojuredocs.org",
  "www.braveclojure.com",
  "pragprog.com",
  "groovy-lang.org",
  "docs.grails.org",
];

function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isBlocked(host) {
  if (!host) return true;
  return BLOCKED_HOSTS.some(
    (b) => host === b || host.endsWith(`.${b}`)
  );
}

function isDrive(host) {
  return (
    host === "drive.google.com" ||
    host === "docs.google.com" ||
    host.endsWith(".googleusercontent.com")
  );
}

function isAllowed(host) {
  if (isDrive(host)) return true;
  return ALLOWED_NON_DRIVE.some(
    (a) => host === a || host.endsWith(`.${a}`)
  );
}

function main() {
  const books = JSON.parse(fs.readFileSync(booksFile, "utf8"));
  const errors = [];

  for (const book of books) {
    const url = (book.driveUrl || "").trim();
    if (!url || url === "PDF_LINK" || url === "#" || url === "()") {
      errors.push(`${book.id}: missing or placeholder URL`);
      continue;
    }
    if (!/^https:\/\//i.test(url)) {
      errors.push(`${book.id}: URL must start with https:// → ${url}`);
      continue;
    }
    const host = hostOf(url);
    if (isBlocked(host)) {
      errors.push(
        `${book.id}: blocked placeholder host (${host}). Maintainers must use a real Google Drive PDF link, not example.com.`
      );
      continue;
    }
    if (!isAllowed(host)) {
      errors.push(
        `${book.id}: host not allowed (${host}). Use drive.google.com for PDFs (or an approved docs host).`
      );
    }
  }

  if (errors.length) {
    console.error(`Found ${errors.length} invalid book URL(s):\n`);
    for (const e of errors) console.error(` - ${e}`);
    console.error(
      "\nContributors suggest titles only. Maintainers attach valid https://drive.google.com/… links."
    );
    process.exit(1);
  }

  const driveCount = books.filter((b) =>
    isDrive(hostOf(b.driveUrl))
  ).length;
  console.log(
    `OK: ${books.length} books validated (${driveCount} Google Drive links).`
  );
}

main();
