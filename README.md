# Chronica

Blog editorial (opini, musik, buku, film) dengan CMS bawaan.

- **Stack:** Next.js 16 (App Router) · React 19 · Prisma 7 + adapter MariaDB di MySQL/MariaDB · Tailwind CSS 4 · Zod
- **Situs publik:** `app/(frontend)`: beranda, `/blog`, `/blog/[slug]` (dengan komentar), `/about`, `/contact`
- **CMS:** `app/(admin)/custom-admin`: artikel (draf/terbit), kategori, tag, playlist musik, moderasi komentar, pesan kontak, profil & cerita halaman Tentang
- **API:** `app/api`. Publik: `/api/posts` (daftar, pencarian, pagination), `/api/posts/[slug]/like`, `/api/posts/[slug]/comments`, `/api/contact`. Admin: `/api/admin/*`, semuanya wajib sesi.
- **Kode server:** `lib/`: akses data (`posts.ts`, `comments.ts`), auth (`auth/`), validasi, upload, rate limiting, hitungan views

## Setup

Kebutuhan: Node.js 22+ (disarankan 24) dan MySQL 5.7+/MariaDB.

```bash
npm install                 # sekaligus menjalankan `prisma generate`
cp .env.example .env        # isi DATABASE_URL dan SESSION_SECRET
npm run db:migrate          # menerapkan prisma/migrations
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='password-panjang' npm run db:seed
npm run dev
```

Buka http://localhost:3000, dan CMS di http://localhost:3000/custom-admin.

Seed bersifat idempoten: hanya membuat baris yang belum ada dan tidak pernah menghapus data.

> Setelah `db:migrate` atau perubahan `schema.prisma`, **restart `npm run dev`**: server yang sedang berjalan masih memakai Prisma client lama.

## Scripts

| Script | Fungsi |
| --- | --- |
| `npm run dev` / `build` / `start` | Server dev Next.js, build produksi, server produksi |
| `npm run lint` · `npm run typecheck` · `npm test` | ESLint, TypeScript, unit & API test (Vitest, tanpa database) |
| `npm run test:e2e` | Smoke test end-to-end terhadap server yang berjalan (lihat di bawah) |
| `npm run db:migrate` | Terapkan migrasi yang belum jalan (tidak pernah mereset data) |
| `npm run db:seed` | Buat akun admin dan konten awal bila belum ada |
| `npm run db:hash-passwords` | Sekali jalan: hash password lama yang masih plaintext |
| `npm run uploads:clean` | Daftar berkas upload yatim (>24 jam, tak dirujuk). Tambah `-- --apply` untuk menghapus |

Untuk mengubah schema: edit `prisma/schema.prisma`, lalu `npx prisma migrate dev --name <perubahan>` pada database development.

### Smoke test end-to-end

```bash
npm run build && npx next start -p 3005
E2E_BASE_URL=http://localhost:3005 npm run test:e2e
```

Script ini membuat artikel sementara berlabel `[UJI E2E]` di kategori uji, menguji daftar, pagination, pencarian, halaman artikel, views, komentar, like, moderasi admin, dan logout, lalu **menghapus semua data ujinya**. Pengujian logout mencabut sesi admin yang ada, jadi Anda perlu login ulang.

## Model keamanan

- Login admin menyetel cookie `httpOnly`, `SameSite=Lax` yang ditandatangani `SESSION_SECRET`. Setiap handler `/api/admin/*` memanggil `requireAdmin()`, yang memverifikasi sesi ke database dan menolak penulisan lintas origin.
- Password di-hash dengan scrypt. Mengganti password mengeluarkan sesi lain; **logout mencabut semua token** lewat `Author.sessionVersion`.
- Rate limiting berlapis (`lib/rate-limit.ts` → `LIMITS`): per IP **dan** batas yang tidak bergantung IP (per email untuk login, per artikel / seluruh situs untuk komentar, kontak, dan like). Jadi memalsukan `X-Forwarded-For` tidak cukup untuk menembusnya.
  - Di belakang nginx/Apache, set `TRUST_PROXY=1` dan `proxy_set_header X-Real-IP $remote_addr;` agar IP klien akurat.
  - Limiter disimpan di memori per proses; jika menjalankan beberapa instance, gunakan store bersama (mis. Redis).
- Views dihitung sekali per pengunjung per artikel per hari; bot diabaikan.
- Upload dibatasi tipe gambar/audio tertentu, dicek magic bytes dan ukurannya, dan disajikan dengan CSP sandbox. Berkas lama dihapus hanya bila tak ada baris yang merujuknya (termasuk cerita halaman Tentang).
- Komentar: email tidak pernah ditampilkan publik; ada honeypot anti-bot; admin dapat menyembunyikan atau menghapus.

## Catatan deployment

- Berkas upload ditulis ke `public/uploads/` di disk lokal, cocok untuk satu server (Laragon/VPS). Di host serverless dengan filesystem read-only, pindahkan upload ke object storage (S3, Vercel Blob, …).
- Set `NEXT_PUBLIC_SITE_URL` ke domain publik agar sitemap dan tautan Open Graph benar.
