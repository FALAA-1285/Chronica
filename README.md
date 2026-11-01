# Chronica

An editorial blog (history, politics, literature, philosophy) with a built-in CMS.

- **Stack:** Next.js 16 (App Router) · React 19 · Prisma 7 with the MariaDB adapter on MySQL/MariaDB · Tailwind CSS 4 · Zod
- **Public site:** `app/(frontend)` — home, `/blog`, `/blog/[slug]`, `/about`, `/contact`
- **CMS:** `app/(admin)/custom-admin` — posts (draft/published), categories, tags, music playlist, contact messages, author profile
- **API:** `app/api` — public (`/api/posts`, `/api/posts/[slug]/like`, `/api/contact`) and admin (`/api/admin/*`, all require a session)
- **Server code:** `lib/` — data access (`posts.ts`), auth (`auth/`), validation, uploads, rate limiting

## Setup

Requirements: Node.js 22+ (24 recommended) and MySQL 5.7+/MariaDB.

```bash
npm install                 # also runs `prisma generate`
cp .env.example .env        # then fill in DATABASE_URL and SESSION_SECRET
npm run db:migrate          # applies prisma/migrations
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='a-long-password' npm run db:seed
npm run dev
```

Open http://localhost:3000, and the CMS at http://localhost:3000/custom-admin.

The seed is idempotent: it only creates rows that are missing and never deletes data.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js dev server, production build, production server |
| `npm run lint` · `npm run typecheck` · `npm test` | ESLint, TypeScript, unit tests (Vitest) |
| `npm run db:migrate` | Apply pending migrations (never resets data) |
| `npm run db:seed` | Create the admin account and starter content if missing |
| `npm run db:hash-passwords` | One-off: hash any legacy plaintext author passwords |

To change the schema: edit `prisma/schema.prisma`, then `npx prisma migrate dev --name <change>` against a development database.

## Security model

- Admin login sets an `httpOnly`, `SameSite=Lax` cookie signed with `SESSION_SECRET`. Every `/api/admin/*` handler calls `requireAdmin()`, which verifies the session against the database and rejects cross-origin writes.
- Passwords are hashed with scrypt. Changing the password signs out other sessions.
- Login, contact form and likes are rate-limited in memory (per process — use a shared store such as Redis if you run several instances).
- Uploads are restricted to known image/audio types, checked by file signature and size, and served with a sandboxing CSP.

## Deployment notes

- Uploaded files are written to `public/uploads/` on local disk, which is right for a single server (e.g. Laragon/VPS). On serverless hosts with a read-only filesystem, move uploads to object storage (S3, Vercel Blob, …).
- Set `NEXT_PUBLIC_SITE_URL` to the public domain so the sitemap and Open Graph links are correct.
