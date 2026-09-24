#!/usr/bin/env node
/**
 * Copy lint. Turns the written rules for this site into a check that can run on every change.
 * Sources: the build brief (section 10 and the exclusions), a review of her current site, and the house style.
 *
 *   npm run lint:copy
 *
 * Scans src/ and README.md. Exits 1 if anything is found.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN = [join(ROOT, "src"), join(ROOT, "README.md")];
const EXT = new Set([".ts", ".tsx", ".css", ".md", ".mdx"]);

/*
  Names that must never appear in the copy (competitors, and clients who have not agreed to be named)
  are kept out of the repository: one regular expression per line in scripts/copy-lint.private.txt,
  which git ignores. Without that file the names rule is skipped.
*/
const privateNames = (() => {
  try {
    return readFileSync(new URL("./copy-lint.private.txt", import.meta.url), "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
  } catch {
    return [];
  }
})();

const rules = [
  // Punctuation
  { name: "em dash", re: /—/g, why: "No em dashes anywhere." },
  { name: "en dash", re: /–/g, why: "En dashes only for numeric ranges. Use a hyphen or rewrite." },

  // Banned words and phrases (brief section 10, plus the September 2026 house list)
  {
    name: "banned word",
    re: /\b(delve|tapestry|groundbreaking|vibrant|nestled|synergy|seamless(?:ly)?|leverag(?:e|es|ing)|robust|cutting-edge|streamline|holistic|intricate|unparalleled|elevate|unlock|boasts|furthermore|moreover|additionally)\b/gi,
    why: "On the banned word list.",
  },
  {
    name: "banned phrase",
    re: /(testament to|pivotal moment|at its core|serves as|harness the power of|in today's fast-paced world|the journey|navigate the complexities|in essence)/gi,
    why: "On the banned phrase list.",
  },

  // Positioning: what she is not called
  { name: "life coach", re: /life[- ]coach/gi, why: "Reads rootless to a Sanatani audience. Never use." },
  { name: "astrologer as her title", re: /\bastrologer\b/gi, why: "Not her title. Describe what she practises instead." },
  { name: "abundance", re: /\babundance\b/gi, why: "Name the four areas as she does: Health, Relationship, Career, Money." },
  { name: "book title as a line", re: /change your mind,? transform your life/gi, why: "Her book's title. Use it only as the title (bookTitle in src/content/about.ts)." },
  { name: "outdated figures", re: /(12,000|12000\+|1,200\+|1200\+|more than 1,200|\b21\+|4\+ countries)/g, why: "Use the current figures: 15+ years, 10,000+ clients, 5+ countries (confirmed 24 Sept 2026)." },

  // Expressly excluded features
  { name: "tarot", re: /\btarot\b/gi, why: "She asked for tarot to be removed everywhere." },
  { name: "horoscope", re: /\bhoroscope\b/gi, why: "Excluded feature." },
  { name: "shop or store", re: /\b(add to cart|buy now|checkout|webshop|online store)\b/gi, why: "No shop." },
  { name: "urgency device", re: /(only \d+ (spots?|seats?) (left|remaining)|limited time|hurry|countdown|last chance)/gi, why: "No urgency devices." },

  // Names that must not appear on the site (listed privately, see privateNames above)
  ...(privateNames.length
    ? [{ name: "competitor or client name", re: new RegExp(`(${privateNames.join("|")})`, "gi"), why: "Never name a competitor or an unconsented client." }]
    : []),
  { name: "unverified credential", re: /(\bph\.?d\b|skill ministry|guinness)/gi, why: "Unverified. Do not publish." },

  // Structures the house style rules out
  { name: "not-just sandwich", re: /(isn't just|is not just|it's not just|it is not just|aren't just|not just .{1,40}, (it's|it is|but))/gi, why: "Banned structure." },
  { name: "abstract-noun opener", re: /(?:heading|h1|h2|title):\s*["'`](Clarity|Power|Transformation|Blessings|Journey)\b/g, why: "Never open with an abstract noun." },
];

function walk(path, out = []) {
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const name of readdirSync(path)) {
      if (name === "node_modules" || name === ".next" || name === "fonts") continue;
      walk(join(path, name), out);
    }
  } else if (EXT.has(extname(path))) {
    out.push(path);
  }
  return out;
}

const files = SCAN.flatMap((p) => {
  try {
    return walk(p);
  } catch {
    return [];
  }
});

let hits = 0;
for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    // A reviewed exception is marked on the line above: // copy-lint-allow: <reason>
    if (index > 0 && lines[index - 1].includes("copy-lint-allow")) return;
    for (const rule of rules) {
      rule.re.lastIndex = 0;
      const match = rule.re.exec(line);
      if (match) {
        hits += 1;
        console.log(`${relative(ROOT, file)}:${index + 1}  [${rule.name}] "${match[0]}"  ${rule.why}`);
      }
    }
  });
}

if (hits === 0) {
  console.log(`Copy lint: clean (${files.length} files, ${rules.length} rules).`);
} else {
  console.log(`\nCopy lint: ${hits} finding${hits === 1 ? "" : "s"}.`);
  process.exit(1);
}
