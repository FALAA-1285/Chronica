import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { handleApiError, readJson, requireAdmin } from "@/lib/api";
import { tagInput } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(tags);
  } catch (error) {
    return handleApiError(error, "list tags");
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin(req);
    const tag = await prisma.tag.create({ data: await readJson(req, tagInput) });
    revalidatePath("/", "layout");
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    return handleApiError(error, "create tag");
  }
}
