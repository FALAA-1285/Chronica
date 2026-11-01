import { NextResponse } from "next/server";
import { prisma } from "../../../../(frontend)/_lib/db";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    const { name, slug, color } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug,
        color: color || "#7B2FBE",
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Admin API PUT tag error:", error);
    return NextResponse.json({ error: "Failed to update tag" }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await prisma.tag.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin API DELETE tag error:", error);
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}
