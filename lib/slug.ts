import type { TocItem } from "./types";

/** "Virtù & Fortuna!" -> "virtu-fortuna" (diacritics folded, ASCII only). */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Returns a function that produces unique slugs in call order
 * ("intro", "intro-2", ...). The table of contents and the article
 * renderer must both walk headings in document order with their own
 * slugger so their anchor ids match.
 */
export function createSlugger() {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = slugify(text) || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };
}

const HEADING = /^(#{2,3})\s+(.+?)\s*#*\s*$/;

/** Markdown inline syntax that should not appear in a TOC label. */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__|\*|_|`)/g, "");
}

export function parseToc(content: string): TocItem[] {
  const slug = createSlugger();
  const toc: TocItem[] = [];
  let inFence = false;

  for (const line of content.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = HEADING.exec(line);
    if (match) {
      const title = stripInlineMarkdown(match[2]);
      toc.push({ id: slug(title), title, level: match[1].length });
    }
  }
  return toc;
}
