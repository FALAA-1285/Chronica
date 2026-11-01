import { NextResponse } from "next/server";
import { prisma } from "../../../../(frontend)/_lib/db";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    const { name, slug, description, color, bgColor, icon } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || "",
        color: color || "#0A0A0A",
        bgColor: bgColor || "#FFE500",
        icon: icon || "BookOpen",
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Admin API PUT category error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await prisma.category.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin API DELETE category error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
