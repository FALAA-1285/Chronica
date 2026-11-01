import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { handleApiError, readJson, requireAdmin } from "@/lib/api";
import { categoryInput } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return handleApiError(error, "list categories");
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin(req);
    const data = await readJson(req, categoryInput);
    const category = await prisma.category.create({ data, include: { _count: { select: { posts: true } } } });
    revalidatePath("/", "layout");
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return handleApiError(error, "create category");
  }
}
