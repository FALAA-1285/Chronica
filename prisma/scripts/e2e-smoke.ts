/**
 * End-to-end smoke test against a running server, using throw-away data.
 * Creates "[UJI E2E]" posts in a dedicated category, exercises the public and
 * admin flows over HTTP, then deletes everything it created.
 *
 *   npm run build && npx next start -p 3005
 *   E2E_BASE_URL=http://localhost:3005 npm run test:e2e
 *
 * Note: the logout check revokes the admin's existing sessions (log in again).
 */
import "dotenv/config";
import { prisma } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { createSessionToken } from "@/lib/auth/token";

const BASE = (process.env.E2E_BASE_URL || "http://localhost:3005").replace(/\/$/, "");
const CATEGORY_SLUG = "uji-e2e-kategori";
const BROWSER = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36";
const results: { name: string; ok: boolean; detail?: string }[] = [];

function check(name: string, ok: boolean, detail?: string) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${!ok && detail ? `  → ${detail}` : ""}`);
}

// Unique fake IPs per run: the server's in-memory limiter remembers earlier runs.
const RUN = Math.floor(Math.random() * 250);
let ip = 0;
const headers = (extra: Record<string, string> = {}) => ({ "User-Agent": BROWSER, "X-Forwarded-For": `10.${RUN}.${Math.floor(++ip / 250)}.${ip % 250}`, ...extra });
/** React separates adjacent text nodes with <!-- --> markers in server HTML. */
const textOf = (html: string) => html.replace(/<!-- -->/g, "");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function cleanup() {
  await prisma.post.deleteMany({ where: { slug: { startsWith: "uji-e2e-" } } });
  await prisma.category.deleteMany({ where: { slug: CATEGORY_SLUG } });
}

async function main() {
  const author = await prisma.author.findFirst({ orderBy: { createdAt: "asc" } });
  if (!author) throw new Error("No author account: run the seed first.");
  await cleanup();

  const category = await prisma.category.create({
    data: { name: "[UJI E2E] Kategori", slug: CATEGORY_SLUG, description: "Data uji sementara", color: "#0A0A0A", bgColor: "#FFE500", icon: "BookOpen" },
  });
  for (let i = 1; i <= 8; i++) {
    await prisma.post.create({
      data: {
        title: `[UJI E2E] Artikel ${i}`,
        slug: `uji-e2e-${i}`,
        excerpt: `Ringkasan artikel uji ${i}`,
        content: `## Bagian Satu\n\nIsi artikel uji ${i}.\n\n## Bagian Dua\n\nPenutup.`,
        coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
        readingTime: 1,
        publishedAt: new Date(Date.now() - i * 60_000),
        authorId: author.id,
        categoryId: category.id,
      },
    });
  }
  const target = await prisma.post.findUniqueOrThrow({ where: { slug: "uji-e2e-1" } });

  // ---- Public pages & listing ---------------------------------------------------
  const blog = await fetch(`${BASE}/blog?category=${CATEGORY_SLUG}`, { headers: headers() });
  const blogHtml = await blog.text();
  check("Blog: halaman kategori tampil", blog.status === 200 && blogHtml.includes("[UJI E2E] Artikel 1"));
  check("Blog: server hanya merender 1 halaman (6 artikel)", !blogHtml.includes("[UJI E2E] Artikel 7"));
  check("Blog: judul tidak ganda", /<title>Arsip Blog \| Chronica<\/title>/.test(blogHtml));
  check("Blog: <html lang=\"id\">", blogHtml.includes('<html lang="id"'));

  const page1 = await (await fetch(`${BASE}/api/posts?category=${CATEGORY_SLUG}`)).json();
  check("API: halaman 1 = 6 artikel, hasMore", page1.posts.length === 6 && page1.hasMore === true, JSON.stringify({ n: page1.posts.length, more: page1.hasMore }));
  const page2 = await (await fetch(`${BASE}/api/posts?category=${CATEGORY_SLUG}&offset=6`)).json();
  check("API: halaman 2 = 2 artikel, tidak ada lagi", page2.posts.length === 2 && page2.hasMore === false);
  const search = await (await fetch(`${BASE}/api/posts?q=${encodeURIComponent("Artikel 3")}&category=${CATEGORY_SLUG}`)).json();
  check("API: pencarian menemukan artikel 3", search.posts.length === 1 && search.posts[0].slug === "uji-e2e-3");

  // ---- Article page & views ---------------------------------------------------------
  const visitor = headers();
  const article = await fetch(`${BASE}/blog/uji-e2e-1`, { headers: visitor });
  const articleHtml = textOf(await article.text());
  check(
    "Artikel: tampil dengan daftar isi & komentar",
    article.status === 200 && articleHtml.includes("Daftar Isi") && articleHtml.includes("Komentar (0)"),
    `status=${article.status} toc=${articleHtml.includes("Daftar Isi")} komentar=${articleHtml.match(/Komentar \([^)]*\)/)?.[0]}`,
  );
  await fetch(`${BASE}/blog/uji-e2e-1`, { headers: visitor }); // same visitor refreshes
  await fetch(`${BASE}/blog/uji-e2e-1`, { headers: headers({ "User-Agent": "Googlebot/2.1" }) });
  await sleep(800);
  const views = (await prisma.post.findUniqueOrThrow({ where: { id: target.id } })).views;
  check("Views: refresh & bot tidak dihitung (views = 1)", views === 1, `views=${views}`);

  // ---- Comments -------------------------------------------------------------------
  const commentUrl = `${BASE}/api/posts/uji-e2e-1/comments`;
  const send = (body: object) => fetch(commentUrl, { method: "POST", headers: headers({ "Content-Type": "application/json" }), body: JSON.stringify(body) });
  const created = await send({ name: "Penguji", email: "penguji@example.com", content: "Komentar uji end-to-end." });
  check("Komentar: kirim valid → 201", created.status === 201);
  check("Komentar: validasi menolak input kosong → 400", (await send({ name: "", email: "x", content: "" })).status === 400);
  const honeypot = await send({ name: "Bot", email: "bot@example.com", content: "spam spam", website: "spam.example" });
  const stored = await prisma.comment.count({ where: { postId: target.id } });
  check("Komentar: honeypot pura-pura sukses tapi tidak disimpan", honeypot.status === 201 && stored === 1, `stored=${stored}`);
  const publicComments = await (await fetch(commentUrl)).json();
  check("Komentar: tampil publik tanpa email", publicComments.length === 1 && !("email" in publicComments[0]));
  const withComment = textOf(await (await fetch(`${BASE}/blog/uji-e2e-1`, { headers: headers() })).text());
  check("Komentar: muncul di halaman artikel", withComment.includes("Komentar uji end-to-end.") && withComment.includes("Komentar (1)"));

  // ---- Likes ----------------------------------------------------------------------
  const liker = headers();
  const like1 = await fetch(`${BASE}/api/posts/uji-e2e-1/like`, { method: "POST", headers: liker });
  const like2 = await fetch(`${BASE}/api/posts/uji-e2e-1/like`, { method: "POST", headers: liker });
  check("Like: pertama 201/200 dan bertambah, kedua 429", like1.ok && (await like1.json()).likes === 1 && like2.status === 429);

  // ---- Admin (session minted in-process, never printed) -------------------------------
  const cookie = `${SESSION_COOKIE}=${createSessionToken(author.id, author.password, author.sessionVersion)}`;
  const admin = (path: string, init: RequestInit = {}) =>
    fetch(`${BASE}${path}`, { ...init, headers: { Cookie: cookie, Origin: BASE, "Content-Type": "application/json", ...(init.headers ?? {}) } });

  const list = await admin("/api/admin/posts");
  const listed = await list.json();
  const ours = listed.find((p: { slug: string }) => p.slug === "uji-e2e-1");
  check("Admin: daftar artikel tanpa field content", list.status === 200 && ours && !("content" in ours));
  const detail = await (await admin(`/api/admin/posts/${target.id}`)).json();
  check("Admin: detail artikel memuat content", typeof detail.content === "string" && detail.content.includes("Bagian Satu"));

  const comments = await (await admin("/api/admin/comments")).json();
  const ourComment = comments.find((c: { post: { slug: string } }) => c.post.slug === "uji-e2e-1");
  check("Admin: komentar terlihat beserta email", !!ourComment && ourComment.email === "penguji@example.com");
  const hide = await admin(`/api/admin/comments/${ourComment.id}`, { method: "PATCH", body: JSON.stringify({ approved: false }) });
  const afterHide = await (await fetch(commentUrl)).json();
  check("Admin: sembunyikan komentar → hilang dari publik", hide.status === 200 && afterHide.length === 0);
  const crossSite = await fetch(`${BASE}/api/admin/comments/${ourComment.id}`, {
    method: "DELETE",
    headers: { Cookie: cookie, Origin: "http://evil.example" },
  });
  check("Admin: request lintas origin ditolak (403)", crossSite.status === 403);
  const del = await admin(`/api/admin/comments/${ourComment.id}`, { method: "DELETE" });
  check("Admin: hapus komentar", del.status === 200 && (await prisma.comment.count({ where: { id: ourComment.id } })) === 0);

  // ---- Logout revokes the token server-side -------------------------------------------
  const logout = await admin("/api/admin/logout", { method: "POST" });
  const reused = await admin("/api/admin/posts");
  check("Logout: token lama langsung ditolak (401)", logout.status === 200 && reused.status === 401, `logout=${logout.status} reuse=${reused.status}`);
}

main()
  .catch((error) => {
    console.error(error);
    check("Script selesai tanpa error", false, String(error));
  })
  .finally(async () => {
    await cleanup();
    const left = await prisma.post.count({ where: { slug: { startsWith: "uji-e2e-" } } });
    console.log(`Data uji dibersihkan (sisa: ${left}).`);
    const failed = results.filter((r) => !r.ok).length;
    console.log(`\n${results.length - failed}/${results.length} lulus.`);
    process.exitCode = failed ? 1 : 0;
    await prisma.$disconnect();
  });
