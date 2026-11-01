import { describe, expect, it } from "vitest";
import { checkUpload, extractUploadUrls } from "@/lib/upload-rules";
import { rateLimit } from "@/lib/rate-limit";
import { authorInput, categoryInput, contactInput, postInput, trackInput } from "@/lib/validation";

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
