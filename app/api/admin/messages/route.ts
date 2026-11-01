import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError, requireAdmin } from "@/lib/api";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
    return NextResponse.json(messages);
  } catch (error) {
    return handleApiError(error, "list messages");
  }
}
