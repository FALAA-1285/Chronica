import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ApiError, handleApiError, readJson, requireAdmin, type RouteContext } from "@/lib/api";
import { categoryInput } from "@/lib/validation";

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const data = await readJson(req, categoryInput);
    const category = await prisma.category.update({
      where: { id },
      data,
      include: { _count: { select: { posts: true } } },
    });
    revalidatePath("/", "layout");
    return NextResponse.json(category);
  } catch (error) {
    return handleApiError(error, "update category");
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    // The FK is ON DELETE RESTRICT; check first to give a helpful message.
    const postCount = await prisma.post.count({ where: { categoryId: id } });
    if (postCount > 0) {
      throw new ApiError(409, `Kategori masih dipakai ${postCount} artikel. Pindahkan artikelnya ke kategori lain dulu.`);
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "delete category");
  }
}
