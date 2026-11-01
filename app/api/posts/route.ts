import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api";
import { searchPosts } from "@/lib/posts";

// Public search used by the Ctrl+K modal. Returns published post summaries only.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").slice(0, 100);
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 8, 1), 20);
    return NextResponse.json(await searchPosts(q, limit));
  } catch (error) {
    return handleApiError(error, "search posts");
  }
}
