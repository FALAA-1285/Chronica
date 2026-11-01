import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { handleApiError, readJson, requireAdmin } from "@/lib/api";
import { estimateReadingTime } from "@/lib/format";
import { DEFAULT_COVER_IMAGE } from "@/lib/media";
import { postInput } from "@/lib/validation";
import { adminPostInclude } from "@/lib/admin-queries";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const posts = await prisma.post.findMany({ orderBy: { publishedAt: "desc" }, include: adminPostInclude });
    return NextResponse.json(posts);
  } catch (error) {
    return handleApiError(error, "list posts");
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAdmin(req);
    const { tags, categoryId, readingTime, coverImage, ...input } = await readJson(req, postInput);

    const post = await prisma.post.create({
      data: {
        ...input,
        coverImage: coverImage || DEFAULT_COVER_IMAGE,
        readingTime: readingTime || estimateReadingTime(input.content),
        author: { connect: { id: user.id } },
        category: { connect: { id: categoryId } },
        tags: { connect: tags.map((id) => ({ id })) },
      },
      include: adminPostInclude,
    });

    revalidatePath("/", "layout");
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return handleApiError(error, "create post");
  }
}
