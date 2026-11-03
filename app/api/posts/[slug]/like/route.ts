import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ApiError, assertWithinLimits, handleApiError } from "@/lib/api";
import { clientIp, LIMITS } from "@/lib/rate-limit";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    // One like per post per IP per day, plus a per-post cap so a spoofed IP
    // can't inflate the count (the button also remembers it locally).
    assertWithinLimits(LIMITS.like(clientIp(req), slug), () => "Anda sudah menyukai artikel ini.");

    const { count } = await prisma.post.updateMany({
      where: { slug, published: true },
      data: { likes: { increment: 1 } },
    });
    if (count === 0) throw new ApiError(404, "Artikel tidak ditemukan.");

    const post = await prisma.post.findUniqueOrThrow({ where: { slug }, select: { likes: true } });
    return NextResponse.json(post);
  } catch (error) {
    return handleApiError(error, "like post");
  }
}
