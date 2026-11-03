import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api";
import { POSTS_PAGE_SIZE } from "@/lib/constants";
import { listPosts } from "@/lib/posts";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// Public listing/search used by the article grid ("Load more", search box) and
// the Ctrl+K modal. Returns published post summaries only.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = await listPosts({
      q: (searchParams.get("q") ?? "").slice(0, 100),
      category: (searchParams.get("category") ?? "").slice(0, 191),
      offset: clamp(Number(searchParams.get("offset")) || 0, 0, 10_000),
      limit: clamp(Number(searchParams.get("limit")) || POSTS_PAGE_SIZE, 1, 20),
    });
    return NextResponse.json(page);
  } catch (error) {
    return handleApiError(error, "list posts");
  }
}
