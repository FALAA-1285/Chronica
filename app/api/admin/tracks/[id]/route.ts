import { NextResponse } from "next/server";
import { prisma } from "../../../../(frontend)/_lib/db";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    const { title, artist, audioUrl, coverUrl, duration } = body;

    if (!title || !artist || !audioUrl) {
      return NextResponse.json({ error: "Title, Artist, and Audio URL are required" }, { status: 400 });
    }

    const track = await prisma.track.update({
      where: { id },
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
    console.error("Admin API PUT track error:", error);
    return NextResponse.json({ error: "Failed to update track" }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await prisma.track.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin API DELETE track error:", error);
    return NextResponse.json({ error: "Failed to delete track" }, { status: 500 });
  }
}
