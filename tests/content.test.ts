import { describe, expect, it } from "vitest";
import { createSlugger, parseToc, slugify } from "@/lib/slug";
import { estimateReadingTime, formatDate } from "@/lib/format";
import { isLocalUpload, isValidMediaUrl, shouldSkipOptimization } from "@/lib/media";

describe("slugify", () => {
  it("folds diacritics and strips punctuation", () => {
    expect(slugify("Virtù and Fortuna: the Age!")).toBe("virtu-and-fortuna-the-age");
    expect(slugify("  --Hello--  ")).toBe("hello");
  });

  it("creates unique ids for repeated headings", () => {
    const slug = createSlugger();
    expect([slug("Intro"), slug("Intro"), slug("Intro")]).toEqual(["intro", "intro-2", "intro-3"]);
  });
});

describe("parseToc", () => {
  it("collects h2/h3, ignores code fences and inline markdown", () => {
    const toc = parseToc(["## **Bold** heading", "text", "```", "## not a heading", "```", "### Sub [link](https://x.y)", "## Bold heading"].join("\n"));
    expect(toc).toEqual([
      { id: "bold-heading", title: "Bold heading", level: 2 },
      { id: "sub-link", title: "Sub link", level: 3 },
      { id: "bold-heading-2", title: "Bold heading", level: 2 },
    ]);
  });
});

describe("format", () => {
  it("formats dates in UTC so server and client agree", () => {
    expect(formatDate("2026-05-20T23:30:00Z")).toBe("May 20, 2026");
  });

  it("estimates reading time with a 1 minute minimum", () => {
    expect(estimateReadingTime("short")).toBe(1);
    expect(estimateReadingTime("word ".repeat(1000))).toBe(5);
  });
});

describe("media urls", () => {
  it("accepts local uploads and https only", () => {
    expect(isValidMediaUrl("/uploads/images/cover-1.jpg")).toBe(true);
    expect(isValidMediaUrl("https://example.com/a.png")).toBe(true);
    expect(isValidMediaUrl("http://example.com/a.png")).toBe(false);
    expect(isValidMediaUrl("javascript:alert(1)")).toBe(false);
    expect(isValidMediaUrl("/etc/passwd")).toBe(false);
  });

  it("never treats path traversal as a local upload", () => {
    expect(isLocalUpload("/uploads/images/..")).toBe(false);
    expect(isLocalUpload("/uploads/images/../../.env")).toBe(false);
  });

  it("skips the optimizer for unknown hosts and SVGs", () => {
    expect(shouldSkipOptimization("https://images.unsplash.com/photo-1")).toBe(false);
    expect(shouldSkipOptimization("https://cdn.example.com/a.jpg")).toBe(true);
    expect(shouldSkipOptimization("https://api.dicebear.com/8.x/avataaars/svg?seed=x")).toBe(true);
    expect(shouldSkipOptimization("/uploads/images/a.jpg")).toBe(false);
  });
});
