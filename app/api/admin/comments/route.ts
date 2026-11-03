import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError, requireAdmin } from "@/lib/api";
import { adminCommentSelect } from "@/lib/comments";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const comments = await prisma.comment.findMany({ select: adminCommentSelect, orderBy: { createdAt: "desc" }, take: 500 });
    return NextResponse.json(comments);
  } catch (error) {
    return handleApiError(error, "list comments");
  }
}
