import { NextResponse } from "next/server";
import { prisma } from "../../../(frontend)/_lib/db";

export async function GET() {
  try {
    const tracks = await prisma.track.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(tracks);
  } catch (error) {
    console.error("Admin API GET tracks error:", error);
    return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, artist, audioUrl, coverUrl, duration } = body;

    if (!title || !artist || !audioUrl) {
      return NextResponse.json({ error: "Title, Artist, and Audio URL are required" }, { status: 400 });
    }

    const track = await prisma.track.create({
      data: {
        title,
        artist,
        audioUrl,
        coverUrl: coverUrl || null,
        duration: duration ? parseInt(duration) : null,
      },
    });

    return NextResponse.json(track);
  } catch (error) {
    console.error("Admin API POST track error:", error);
    return NextResponse.json({ error: "Failed to create track" }, { status: 500 });
  }
}
