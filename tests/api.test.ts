import { beforeEach, describe, expect, it, vi } from "vitest";

// ---- Mocks: no database, no Next.js request context -------------------------
const db = vi.hoisted(() => ({
  post: { findFirst: vi.fn(), findUniqueOrThrow: vi.fn(), update: vi.fn(), count: vi.fn() },
  category: { delete: vi.fn() },
  comment: { create: vi.fn() },
  author: { findUnique: vi.fn(), count: vi.fn() },
  track: { count: vi.fn() },
}));
const session = vi.hoisted(() => ({ getSessionUser: vi.fn(), startSession: vi.fn() }));

vi.mock("@/lib/db", () => ({ prisma: db }));
vi.mock("@/lib/auth/session", () => session);
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/uploads", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/uploads")>()),
  removeUnusedUploads: vi.fn(),
}));

import { isSameOrigin, requireAdmin } from "@/lib/api";
import { isReferenced } from "@/lib/uploads";
import { POST as postComment } from "@/app/api/posts/[slug]/comments/route";
import { DELETE as deleteCategory } from "@/app/api/admin/categories/[id]/route";
import { PUT as updatePost } from "@/app/api/admin/posts/[id]/route";
import { POST as login } from "@/app/api/admin/login/route";

const ADMIN = { id: "author-1", name: "Admin", email: "admin@example.com", avatar: "/a.png" };
let ipCounter = 0;
/** A fresh fake client IP per request so per-IP limits never interfere between tests. */
const freshIp = () => `198.51.100.${++ipCounter % 250}-${ipCounter}`;

function jsonRequest(url: string, method: string, body: unknown, headers: Record<string, string> = {}) {
  return new Request(url, {
    method,
    headers: { "Content-Type": "application/json", "X-Forwarded-For": freshIp(), ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}
const ctx = <T extends Record<string, string>>(params: T) => ({ params: Promise.resolve(params) });

beforeEach(() => {
  vi.clearAllMocks();
  session.getSessionUser.mockResolvedValue(ADMIN);
});

describe("requireAdmin (authorization)", () => {
  it("rejects requests without a session", async () => {
    session.getSessionUser.mockResolvedValue(null);
    await expect(requireAdmin(new Request("http://site.test/api/admin/posts"))).rejects.toMatchObject({ status: 401 });
  });

  it("rejects cross-origin and opaque ('null') origins on writes", async () => {
    const write = (origin: string) => new Request("http://site.test/api/admin/posts", { method: "POST", headers: { origin } });
    await expect(requireAdmin(write("http://evil.test"))).rejects.toMatchObject({ status: 403 });
    await expect(requireAdmin(write("null"))).rejects.toMatchObject({ status: 403 });
  });

  it("accepts same-origin writes from a logged-in admin", async () => {
    const req = new Request("http://site.test/api/admin/posts", { method: "POST", headers: { origin: "http://site.test" } });
    await expect(requireAdmin(req)).resolves.toEqual(ADMIN);
  });

  it("isSameOrigin never throws on garbage", () => {
    expect(isSameOrigin("not a url", "http://site.test/")).toBe(false);
  });
});

describe("POST /api/posts/[slug]/comments", () => {
  const url = "http://site.test/api/posts/hello/comments";
  const valid = { name: "Budi", email: "budi@example.com", content: "Tulisan yang bagus!" };

  it("404s for unknown or unpublished articles", async () => {
    db.post.findFirst.mockResolvedValue(null);
    const res = await postComment(jsonRequest(url, "POST", valid), ctx({ slug: "hello" }));
    expect(res.status).toBe(404);
    expect(db.comment.create).not.toHaveBeenCalled();
  });

  it("rejects invalid input with 400", async () => {
    db.post.findFirst.mockResolvedValue({ id: "p1" });
    const res = await postComment(jsonRequest(url, "POST", { ...valid, email: "nope" }), ctx({ slug: "hello" }));
    expect(res.status).toBe(400);
  });

  it("fakes success for bots that fill the honeypot, without saving", async () => {
    db.post.findFirst.mockResolvedValue({ id: "p1" });
    const res = await postComment(jsonRequest(url, "POST", { ...valid, website: "spam.example" }), ctx({ slug: "hello" }));
    expect(res.status).toBe(201);
    expect(db.comment.create).not.toHaveBeenCalled();
  });

  it("saves a valid comment on the right post and never returns the email", async () => {
    db.post.findFirst.mockResolvedValue({ id: "p1" });
    db.comment.create.mockResolvedValue({ id: "c1", name: "Budi", content: valid.content, createdAt: new Date("2026-01-01") });
    const res = await postComment(jsonRequest(url, "POST", valid), ctx({ slug: "hello" }));
    expect(res.status).toBe(201);
    expect(db.comment.create.mock.calls[0][0].data).toMatchObject({ postId: "p1", email: "budi@example.com" });
    expect(await res.json()).not.toHaveProperty("email");
  });

  it("caps comments per article even when every request spoofs a new IP", async () => {
    db.post.findFirst.mockResolvedValue({ id: "p2" });
    db.comment.create.mockResolvedValue({ id: "c", name: "x", content: "xx", createdAt: new Date() });
    const statuses: number[] = [];
    for (let i = 0; i < 21; i++) {
      statuses.push((await postComment(jsonRequest("http://site.test/api/posts/spam/comments", "POST", valid), ctx({ slug: "spam" }))).status);
    }
    expect(statuses.slice(0, 20).every((s) => s === 201)).toBe(true);
    expect(statuses[20]).toBe(429);
  });
});

describe("POST /api/admin/login (brute force)", () => {
  it("locks an email after 10 attempts even if the attacker rotates IPs", async () => {
    db.author.findUnique.mockResolvedValue(null);
    const attempt = () => login(jsonRequest("http://site.test/api/admin/login", "POST", { email: "target@example.com", password: "guess" }));
    const statuses: number[] = [];
    for (let i = 0; i < 11; i++) statuses.push((await attempt()).status);
    expect(statuses.slice(0, 10).every((s) => s === 401)).toBe(true);
    expect(statuses[10]).toBe(429);
  }, 30_000);
});

describe("DELETE /api/admin/categories/[id]", () => {
  it("refuses to delete a category that still has articles", async () => {
    db.post.count.mockResolvedValue(3);
    const res = await deleteCategory(new Request("http://site.test/api/admin/categories/c1", { method: "DELETE" }), ctx({ id: "c1" }));
    expect(res.status).toBe(409);
    expect(db.category.delete).not.toHaveBeenCalled();
  });
});

describe("PUT /api/admin/posts/[id] (publish date)", () => {
  const body = { title: "Judul", slug: "judul", content: "Isi", categoryId: "cat1", published: true };
  const put = () => updatePost(jsonRequest("http://site.test/api/admin/posts/p1", "PUT", body), ctx({ id: "p1" }));

  it("stamps publishedAt when a draft is published", async () => {
    db.post.findUniqueOrThrow.mockResolvedValue({ id: "p1", published: false, coverImage: "", content: "" });
    db.post.update.mockResolvedValue({ id: "p1" });
    await put();
    expect(db.post.update.mock.calls[0][0].data.publishedAt).toBeInstanceOf(Date);
  });

  it("keeps the original date when an already published post is edited", async () => {
    db.post.findUniqueOrThrow.mockResolvedValue({ id: "p1", published: true, coverImage: "", content: "" });
    db.post.update.mockResolvedValue({ id: "p1" });
    await put();
    expect(db.post.update.mock.calls[0][0].data).not.toHaveProperty("publishedAt");
  });
});

describe("isReferenced (upload cleanup safety)", () => {
  it("treats an upload used only in the About story as still referenced", async () => {
    db.post.count.mockResolvedValue(0);
    db.track.count.mockResolvedValue(0);
    db.author.count.mockImplementation(async ({ where }) => (JSON.stringify(where).includes("story") ? 1 : 0));
    await expect(isReferenced("/uploads/images/photo.jpg")).resolves.toBe(true);
  });
});
