const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const dbUrl = new URL(process.env.DATABASE_URL || "mysql://root:@localhost:3306/myblog");

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username || "root",
  password: dbUrl.password || "",
  database: dbUrl.pathname.substring(1),
  connectionLimit: 10,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding started...");

  // Clean database
  await prisma.track.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.author.deleteMany({});

  // 1. Create sole author
  const author = await prisma.author.create({
    data: {
      id: "1",
      name: "Prof. Bambang Utomo",
      email: "bambang@gmail.com",
      password: "password123",
      avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Bambang",
      bio: "Seorang sejarawan sosial, penulis, dan blogger veteran yang lahir di Bandung. Sangat menyukai diskusi sejarah kuno, buku sastra klasik, film fiksi ilmiah (sci-fi), serta alunan musik lofi untuk menemani menulis.",
      twitter: "bambang_utomo",
      github: "bambangutomo",
      linkedin: "bambangutomo",
    },
  });

  // 2. Create categories
  const categories = [
    {
      id: "1",
      name: "History",
      slug: "history",
      description: "Unraveling the tales, empires, revolutions, and historical chronicles that shaped the modern world.",
      color: "#0A0A0A",
      bgColor: "#FFE500",
      icon: "BookOpen",
    },
    {
      id: "2",
      name: "Politics",
      slug: "politics",
      description: "Deep political analysis, geopolitics, democratic institutions, statecraft, and power structures.",
      color: "#FFFBF0",
      bgColor: "#FF4040",
      icon: "Globe",
    },
    {
      id: "3",
      name: "Literature",
      slug: "literature",
      description: "Exploring literary criticisms, classical novel analysis, poetry, magical realism, and prose.",
      color: "#0A0A0A",
      bgColor: "#00FF87",
      icon: "PenTool",
    },
    {
      id: "4",
      name: "Philosophy",
      slug: "philosophy",
      description: "Ancient wisdom, ethics, political philosophy, existentialism, and rethinking core values.",
      color: "#FFFBF0",
      bgColor: "#0057FF",
      icon: "Compass",
    },
  ];

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  // 3. Create tags
  const tags = [
    { id: "1", name: "Geopolitics", slug: "geopolitics", color: "#3178C6" },
    { id: "2", name: "Revolution", slug: "revolution", color: "#FF4040" },
    { id: "3", name: "Classics", slug: "classics", color: "#FFE500" },
    { id: "4", name: "Sovereignty", slug: "sovereignty", color: "#0A0A0A" },
    { id: "5", name: "Modernism", slug: "modernism", color: "#7B2FBE" },
  ];

  for (const tag of tags) {
    await prisma.tag.create({ data: tag });
  }

  // 4. Create tracks
  const tracks = [
    {
      id: "track-1",
      title: "Chopin Nocturne Op. 9 No. 2 (Ambient Remaster)",
      artist: "Frederic Chopin",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      coverUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=300&fit=crop",
      duration: 372,
    },
    {
      id: "track-2",
      title: "Debussy Clair de Lune (Night Ambient)",
      artist: "Claude Debussy",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      coverUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=300&fit=crop",
      duration: 423,
    },
    {
      id: "track-3",
      title: "Beethoven Moonlight Sonata (Adagio Chill)",
      artist: "Ludwig van Beethoven",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      coverUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=300&fit=crop",
      duration: 302,
    },
  ];

  for (const track of tracks) {
    await prisma.track.create({ data: track });
  }

  // 5. Create some sample posts connected to our single author, categories, and tags
  const samplePosts = [
    {
      id: "post-1",
      title: "The Fall of Constantinople 1453: Geopolitical Rebirth and Trade Realignment",
      slug: "fall-of-constantinople-1453-geopolitical-turning-point",
      excerpt: "Explore how the fall of Byzantium shattered medieval trade, forced European explorers into the oceans, and laid the foundations of the Modern Age.",
      content: `## Introduction\n\nThe fall of Constantinople in 1453 represents one of the most critical turning points in human history. For over a millennium, the Byzantine Empire stood as a bulwark of Classical civilization, bridging East and West.`,
      coverImage: "https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?w=800&h=450&fit=crop",
      authorId: "1",
      categoryId: "1",
      readingTime: 8,
      featured: true,
      publishedAt: new Date("2026-05-20T08:00:00Z"),
      tags: { connect: [{ id: "1" }, { id: "2" }] },
    },
    {
      id: "post-2",
      title: "Machiavelli in the 21st Century: Power, Realism, and Digital Sovereignty",
      slug: "machiavelli-21st-century-digital-sovereignty",
      excerpt: "A realist rethinking of 'The Prince' in the age of algorithmic statecraft, platform monopolies, and information warfare.",
      content: `## Introduction\n\nRethinking Niccolò Machiavelli in the 21st century requires looking past the cliché of "ends justifying the means." Machiavelli was a realist analyst of power, writing during a time of extreme Italian political fragmentation.`,
      coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=450&fit=crop",
      authorId: "1",
      categoryId: "2",
      readingTime: 12,
      featured: true,
      publishedAt: new Date("2026-05-18T09:00:00Z"),
      tags: { connect: [{ id: "1" }, { id: "4" }] },
    },
  ];

  for (const postData of samplePosts) {
    const { tags, ...rest } = postData;
    await prisma.post.create({
      data: {
        ...rest,
        tags,
      },
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
