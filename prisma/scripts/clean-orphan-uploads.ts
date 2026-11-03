/**
 * Lists (and with --apply, deletes) files in public/uploads that no database
 * row references any more, e.g. uploads from a form that was never saved.
 * Files younger than 24 hours are skipped so in-progress edits are safe.
 *
 *   npm run uploads:clean            # dry run: only lists
 *   npm run uploads:clean -- --apply # deletes
 */
import "dotenv/config";
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";
import { isReferenced } from "@/lib/uploads";

const MIN_AGE_MS = 24 * 60 * 60 * 1000;
const apply = process.argv.includes("--apply");

async function main() {
  const root = path.join(process.cwd(), "public", "uploads");
  let orphans = 0;
  let bytes = 0;

  for (const kind of ["images", "audio"]) {
    const dir = path.join(root, kind);
    const files = await readdir(dir).catch(() => [] as string[]);
    for (const name of files) {
      const file = path.join(dir, name);
      const info = await stat(file);
      if (!info.isFile() || Date.now() - info.mtimeMs < MIN_AGE_MS) continue;

      const url = `/uploads/${kind}/${name}`;
      if (await isReferenced(url)) continue;

      orphans += 1;
      bytes += info.size;
      console.log(`${apply ? "hapus" : "yatim"}  ${url}  (${(info.size / 1024).toFixed(0)} KB)`);
      if (apply) await unlink(file);
    }
  }

  const summary = `${orphans} berkas yatim, ${(bytes / 1024 / 1024).toFixed(1)} MB`;
  console.log(apply ? `Selesai: ${summary} dihapus.` : `${summary}. Jalankan dengan --apply untuk menghapus.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
