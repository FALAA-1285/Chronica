import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { handleApiError, readJson, requireAdmin } from "@/lib/api";
import { trackInput } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const tracks = await prisma.track.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(tracks);
  } catch (error) {
    return handleApiError(error, "list tracks");
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin(req);
    const { coverUrl, duration, ...input } = await readJson(req, trackInput);
    const track = await prisma.track.create({
      data: { ...input, coverUrl: coverUrl || null, duration: duration ?? null },
    });
    revalidatePath("/", "layout");
    return NextResponse.json(track, { status: 201 });
  } catch (error) {
    return handleApiError(error, "create track");
  }
}
