import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";
import { isLocalUpload } from "@/lib/media";
import type { UploadKind } from "@/lib/upload-rules";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export async function saveUpload(originalName: string, data: Buffer, kind: UploadKind, ext: string): Promise<string> {
  const base =
    path
      .basename(originalName, path.extname(originalName))
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 60) || "file";
  const fileName = `${base}-${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;

  const dir = path.join(UPLOAD_ROOT, kind);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), data);
  return `/uploads/${kind}/${fileName}`;
}

async function isReferenced(url: string): Promise<boolean> {
  const [posts, tracks, authors] = await Promise.all([
    prisma.post.count({ where: { OR: [{ coverImage: url }, { content: { contains: url } }] } }),
    prisma.track.count({ where: { OR: [{ audioUrl: url }, { coverUrl: url }] } }),
    prisma.author.count({ where: { avatar: url } }),
  ]);
  return posts + tracks + authors > 0;
}

/**
 * Deletes local upload files that no row references any more. Call after a
 * delete/update with the URLs the old row used. Failures are logged, never thrown.
 */
export async function removeUnusedUploads(urls: string[]) {
  for (const url of urls) {
    if (!isLocalUpload(url)) continue;
    try {
      if (await isReferenced(url)) continue;
      await unlink(path.join(process.cwd(), "public", url));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        console.error("[uploads] cleanup failed for", url, error);
      }
    }
  }
}
