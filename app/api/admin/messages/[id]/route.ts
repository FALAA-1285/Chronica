import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError, readJson, requireAdmin, type RouteContext } from "@/lib/api";
import { contactUpdateInput } from "@/lib/validation";

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const message = await prisma.contactMessage.update({ where: { id }, data: await readJson(req, contactUpdateInput) });
    return NextResponse.json(message);
  } catch (error) {
    return handleApiError(error, "update message");
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "delete message");
  }
}
