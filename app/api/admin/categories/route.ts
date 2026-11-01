import { NextResponse } from "next/server";
import { prisma } from "../../../(frontend)/_lib/db";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Admin API GET categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, description, color, bgColor, icon } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    const category = await prisma.category.create({
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
    console.error("Admin API POST category error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
