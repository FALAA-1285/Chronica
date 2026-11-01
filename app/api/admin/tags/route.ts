import { NextResponse } from "next/server";
import { prisma } from "../../../(frontend)/_lib/db";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Admin API GET tags error:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, color } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        color: color || "#7B2FBE",
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Admin API POST tag error:", error);
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}
