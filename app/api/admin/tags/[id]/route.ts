import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { handleApiError, readJson, requireAdmin, type RouteContext } from "@/lib/api";
import { tagInput } from "@/lib/validation";

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const tag = await prisma.tag.update({ where: { id }, data: await readJson(req, tagInput) });
    revalidatePath("/", "layout");
    return NextResponse.json(tag);
  } catch (error) {
    return handleApiError(error, "update tag");
  }
}

// Deleting a tag only removes its links to posts; the posts stay.
export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    await prisma.tag.delete({ where: { id } });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "delete tag");
  }
}
