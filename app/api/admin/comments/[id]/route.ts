import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError, readJson, requireAdmin, type RouteContext } from "@/lib/api";
import { commentUpdateInput } from "@/lib/validation";
import { adminCommentSelect } from "@/lib/comments";

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const comment = await prisma.comment.update({
      where: { id },
      data: await readJson(req, commentUpdateInput),
      select: adminCommentSelect,
    });
    return NextResponse.json(comment);
  } catch (error) {
    return handleApiError(error, "update comment");
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "delete comment");
  }
}
