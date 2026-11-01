import { NextResponse } from "next/server";
import { prisma } from "../../(frontend)/_lib/db";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { publishedAt: "desc" },
      include: {
        category: true,
        tags: true,
        author: true,
      },
    });
    return NextResponse.json(posts);
  } catch (err) {
    console.error("Prisma failed to fetch posts:", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
