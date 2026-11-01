import { NextResponse } from "next/server";
import { prisma } from "../../../../(frontend)/_lib/db";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, categoryId, tags, readingTime, featured } = body;

    if (!title || !slug || !content || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content,
        coverImage: coverImage || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=450&fit=crop",
        readingTime: parseInt(readingTime) || 5,
        featured: !!featured,
        category: {
          connect: { id: categoryId },
        },
        tags: {
          set: tags && Array.isArray(tags) ? tags.map((tId: string) => ({ id: tId })) : [],
        },
      },
      include: {
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Admin API PUT post error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin API DELETE post error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
