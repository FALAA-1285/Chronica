import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { handleApiError, readJson, requireAdmin, type RouteContext } from "@/lib/api";
import { removeUnusedUploads } from "@/lib/uploads";
import { trackInput } from "@/lib/validation";

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const { coverUrl, duration, ...input } = await readJson(req, trackInput);

    const existing = await prisma.track.findUniqueOrThrow({ where: { id } });
    const track = await prisma.track.update({
      where: { id },
      data: { ...input, coverUrl: coverUrl || null, duration: duration ?? null },
    });

    await removeUnusedUploads([existing.audioUrl, existing.coverUrl ?? ""]);
    revalidatePath("/", "layout");
    return NextResponse.json(track);
  } catch (error) {
    return handleApiError(error, "update track");
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const deleted = await prisma.track.delete({ where: { id } });

    await removeUnusedUploads([deleted.audioUrl, deleted.coverUrl ?? ""]);
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "delete track");
  }
}
