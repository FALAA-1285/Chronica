import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { handleApiError, readJson, requireAdmin, type RouteContext } from "@/lib/api";
import { estimateReadingTime } from "@/lib/format";
import { DEFAULT_COVER_IMAGE } from "@/lib/media";
import { extractUploadUrls } from "@/lib/upload-rules";
import { removeUnusedUploads } from "@/lib/uploads";
import { postInput } from "@/lib/validation";
import { adminPostInclude } from "@/lib/admin-queries";

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const { tags, categoryId, readingTime, coverImage, ...input } = await readJson(req, postInput);

    const existing = await prisma.post.findUniqueOrThrow({ where: { id } });

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...input,
        coverImage: coverImage || DEFAULT_COVER_IMAGE,
        readingTime: readingTime || estimateReadingTime(input.content),
        // A draft that gets published is dated at the moment of publishing.
        ...(!existing.published && input.published ? { publishedAt: new Date() } : {}),
        category: { connect: { id: categoryId } },
        tags: { set: tags.map((tagId) => ({ id: tagId })) },
      },
      include: adminPostInclude,
    });

    await removeUnusedUploads(extractUploadUrls(existing.coverImage, existing.content));
    revalidatePath("/", "layout");
    return NextResponse.json(post);
  } catch (error) {
    return handleApiError(error, "update post");
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const deleted = await prisma.post.delete({ where: { id } });

    await removeUnusedUploads(extractUploadUrls(deleted.coverImage, deleted.content));
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "delete post");
  }
}
