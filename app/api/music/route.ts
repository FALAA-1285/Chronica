import { NextResponse } from "next/server";
import { prisma } from "../../(frontend)/_lib/db";

const DEFAULT_TRACKS = [
  {
    id: "default-1",
    title: "Chopin Nocturne Op. 9 No. 2 (Ambient Remaster)",
    artist: "Frederic Chopin",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    coverUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=300&fit=crop",
    duration: 372,
  },
  {
    id: "default-2",
    title: "Debussy Clair de Lune (Night Ambient)",
    artist: "Claude Debussy",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    coverUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=300&fit=crop",
    duration: 423,
  },
  {
    id: "default-3",
    title: "Beethoven Moonlight Sonata (Adagio Chill)",
    artist: "Ludwig van Beethoven",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    coverUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=300&fit=crop",
    duration: 302,
  },
];

export async function GET() {
  try {
    const dbTracks = await prisma.track.findMany({
      orderBy: { createdAt: "asc" },
    });

    if (dbTracks.length > 0) {
      return NextResponse.json(dbTracks);
    }
  } catch (error) {
    console.warn("Prisma failed to fetch tracks:", error);
  }
  
  return NextResponse.json(DEFAULT_TRACKS);
}
