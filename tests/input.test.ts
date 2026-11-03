import { describe, expect, it } from "vitest";
import { checkUpload, extractUploadUrls } from "@/lib/upload-rules";
import { clientIp, enforceLimits, rateLimit } from "@/lib/rate-limit";
import { isBot, shouldCountView } from "@/lib/views";
import { authorInput, categoryInput, commentInput, contactInput, postInput, trackInput } from "@/lib/validation";

const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0, 0, 0, 0, 0]);
const mp3 = Buffer.concat([Buffer.from("ID3"), Buffer.alloc(13)]);

describe("checkUpload", () => {
  it("accepts real images and audio", () => {
    expect(checkUpload("cover.PNG", 1000, png)).toEqual({ ok: true, kind: "images", ext: ".png" });
    expect(checkUpload("song.mp3", 1000, mp3)).toEqual({ ok: true, kind: "audio", ext: ".mp3" });
  });

  it("rejects dangerous or disguised files", () => {
    expect(checkUpload("evil.html", 100, Buffer.from("<script>alert(1)</script>")).ok).toBe(false);
    expect(checkUpload("evil.svg", 100, Buffer.from("<svg onload=alert(1)>....")).ok).toBe(false);
    expect(checkUpload("fake.png", 100, Buffer.from("<html><body>hi</body></html>")).ok).toBe(false);
  });

  it("enforces size limits", () => {
    expect(checkUpload("big.png", 6 * 1024 * 1024, png).ok).toBe(false);
    expect(checkUpload("empty.png", 0, png).ok).toBe(false);
  });
});

describe("extractUploadUrls", () => {
  it("finds every local upload referenced in markdown", () => {
    const content = "![a](/uploads/images/a-1.jpg) text ![b](https://x.y/b.png) /uploads/audio/s.mp3";
    expect(extractUploadUrls("/uploads/images/cover.png", content, null)).toEqual([
      "/uploads/images/cover.png",
      "/uploads/images/a-1.jpg",
      "/uploads/audio/s.mp3",
    ]);
  });
});

describe("rateLimit", () => {
  it("blocks after the limit and resets after the window", () => {
    const key = `test:${Math.random()}`;
    const t0 = 1_000_000;
    expect(rateLimit(key, 2, 1000, t0).ok).toBe(true);
    expect(rateLimit(key, 2, 1000, t0 + 1).ok).toBe(true);
    expect(rateLimit(key, 2, 1000, t0 + 2).ok).toBe(false);
    expect(rateLimit(key, 2, 1000, t0 + 1001).ok).toBe(true);
  });
});

describe("validation", () => {
  const validPost = { title: "Hello", slug: "hello-world", content: "## Hi", categoryId: "c1" };

  it("accepts a minimal post and fills defaults", () => {
    const post = postInput.parse(validPost);
    expect(post).toMatchObject({ tags: [], featured: false, published: true, excerpt: "" });
  });

  it("rejects bad slugs, over-long titles and unsafe cover URLs", () => {
    expect(postInput.safeParse({ ...validPost, slug: "Hello World" }).success).toBe(false);
    expect(postInput.safeParse({ ...validPost, title: "x".repeat(192) }).success).toBe(false);
    expect(postInput.safeParse({ ...validPost, coverImage: "javascript:alert(1)" }).success).toBe(false);
  });

  it("only allows known category icons and hex colours", () => {
    expect(categoryInput.safeParse({ name: "A", slug: "a", icon: "Skull" }).success).toBe(false);
    expect(categoryInput.safeParse({ name: "A", slug: "a", color: "red" }).success).toBe(false);
  });

  it("requires the current password to set a new one", () => {
    const base = { name: "A", email: "a@b.co", avatar: "https://x.y/a.png" };
    expect(authorInput.safeParse({ ...base, newPassword: "new-password-1" }).success).toBe(false);
    expect(authorInput.safeParse({ ...base, newPassword: "new-password-1", currentPassword: "old" }).success).toBe(true);
    expect(authorInput.safeParse({ ...base, newPassword: "short", currentPassword: "old" }).success).toBe(false);
  });

  it("validates tracks and contact messages", () => {
    expect(trackInput.safeParse({ title: "T", artist: "A", audioUrl: "/uploads/audio/a.mp3", duration: null }).success).toBe(true);
    expect(trackInput.safeParse({ title: "T", artist: "A", audioUrl: "ftp://x/a.mp3" }).success).toBe(false);
    expect(contactInput.safeParse({ name: "N", email: "not-an-email", message: "long enough message" }).success).toBe(false);
    expect(contactInput.safeParse({ name: "N", email: "n@x.co", message: "too short" }).success).toBe(false);
  });
});

describe("commentInput", () => {
  it("accepts a normal comment and trims it", () => {
    const parsed = commentInput.parse({ name: " Budi ", email: "budi@example.com", content: "  Artikel bagus!  " });
    expect(parsed).toMatchObject({ name: "Budi", content: "Artikel bagus!" });
  });

  it("rejects empty, too long, or invalid input", () => {
    expect(commentInput.safeParse({ name: "Budi", email: "budi@example.com", content: " " }).success).toBe(false);
    expect(commentInput.safeParse({ name: "Budi", email: "budi@example.com", content: "x".repeat(2001) }).success).toBe(false);
    expect(commentInput.safeParse({ name: "Budi", email: "not-an-email", content: "Halo" }).success).toBe(false);
    expect(commentInput.safeParse({ name: "", email: "budi@example.com", content: "Halo" }).success).toBe(false);
  });
});

describe("clientIp / enforceLimits", () => {
  const req = (headers: Record<string, string>) => new Request("http://site.test/", { headers });

  it("uses the right-most forwarded hop, never the client-controlled left-most one", () => {
    expect(clientIp(req({ "x-forwarded-for": "6.6.6.6, 203.0.113.9" }), false)).toBe("203.0.113.9");
    expect(clientIp(req({}), false)).toBe("unknown");
  });

  it("trusts X-Real-IP only when TRUST_PROXY is on", () => {
    const headers = { "x-real-ip": "203.0.113.5", "x-forwarded-for": "6.6.6.6" };
    expect(clientIp(req(headers), true)).toBe("203.0.113.5");
    expect(clientIp(req(headers), false)).toBe("6.6.6.6");
  });

  it("blocks on the IP-independent rule even when every IP is new", () => {
    const now = 3_000_000;
    const results = Array.from({ length: 4 }, (_, i) =>
      enforceLimits(
        [
          { key: `t:ip:${i}`, limit: 5, windowMs: 1000 },
          { key: "t:global", limit: 3, windowMs: 1000 },
        ],
        now,
      ).ok,
    );
    expect(results).toEqual([true, true, true, false]);
  });
});

describe("view counting", () => {
  const browser = "Mozilla/5.0 (Windows NT 10.0) Chrome/130";

  it("ignores bots and empty user agents", () => {
    expect(isBot("Googlebot/2.1")).toBe(true);
    expect(isBot(null)).toBe(true);
    expect(isBot(browser)).toBe(false);
  });

  it("counts a visitor once per article per day", () => {
    expect(shouldCountView("post-x", "1.2.3.4", browser, 5_000)).toBe(true);
    expect(shouldCountView("post-x", "1.2.3.4", browser, 6_000)).toBe(false);
    expect(shouldCountView("post-y", "1.2.3.4", browser, 6_000)).toBe(true);
  });
});
