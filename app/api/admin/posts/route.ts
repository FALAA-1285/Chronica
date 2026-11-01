import { NextResponse } from "next/server";
import { prisma } from "../../../(frontend)/_lib/db";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { publishedAt: "desc" },
      include: {
        category: true,
        tags: true,
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Admin API GET posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, categoryId, tags, readingTime, featured } = body;

    if (!title || !slug || !content || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content,
        coverImage: coverImage || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=450&fit=crop",
        readingTime: parseInt(readingTime) || 5,
        featured: !!featured,
        author: {
          connect: { id: "1" }, // Sole author
        },
        category: {
          connect: { id: categoryId },
        },
        tags: tags && Array.isArray(tags) ? {
          connect: tags.map((id: string) => ({ id })),
        } : undefined,
      },
      include: {
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Admin API POST post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
