import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ApiError, assertWithinLimits, handleApiError, readJson } from "@/lib/api";
import { getApprovedComments, publicCommentSelect, toPublicComment } from "@/lib/comments";
import { clientIp, LIMITS } from "@/lib/rate-limit";
import { commentInput } from "@/lib/validation";

type Ctx = { params: Promise<{ slug: string }> };

async function findPublishedPost(slug: string) {
  const post = await prisma.post.findFirst({ where: { slug, published: true }, select: { id: true } });
  if (!post) throw new ApiError(404, "Artikel tidak ditemukan.");
  return post;
}

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { slug } = await params;
    const post = await findPublishedPost(slug);
    return NextResponse.json(await getApprovedComments(post.id));
  } catch (error) {
    return handleApiError(error, "list comments");
  }
}

export async function POST(req: Request, { params }: Ctx) {
  try {
    const { slug } = await params;
    assertWithinLimits(LIMITS.comment(clientIp(req), slug), () => "Terlalu banyak komentar terkirim. Coba lagi nanti.");

    const { website, ...input } = await readJson(req, commentInput);
    const post = await findPublishedPost(slug);

    // Honeypot filled in: pretend success so bots don't learn to adapt.
    if (website) {
      return NextResponse.json({ id: crypto.randomUUID(), name: input.name, content: input.content, createdAt: new Date().toISOString() }, { status: 201 });
    }

    const comment = await prisma.comment.create({ data: { ...input, postId: post.id }, select: publicCommentSelect });
    return NextResponse.json(toPublicComment(comment), { status: 201 });
  } catch (error) {
    return handleApiError(error, "create comment");
  }
}
