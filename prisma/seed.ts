/**
 * Idempotent seed: creates the admin account and starter content if missing.
 * Never deletes or overwrites existing rows, so it is safe to re-run.
 *
 *   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='a-strong-password' npm run db:seed
 */
import "dotenv/config";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { estimateReadingTime } from "@/lib/format";

const categories = [
  {
    name: "Opini",
    slug: "opini",
    description: "Gagasan kritis, analisis tajam, dan sudut pandang mendalam mengenai dinamika sosial dan isu kontemporer.",
    color: "#0A0A0A",
    bgColor: "#FFE500",
    icon: "MessageSquare",
  },
  {
    name: "Musik",
    slug: "musik",
    description: "Ulasan album, eksplorasi melodi, harmonisasi lintas genre, dan kisah di balik nada.",
    color: "#0A0A0A",
    bgColor: "#00FF87",
    icon: "Music",
  },
  {
    name: "Buku",
    slug: "buku",
    description: "Resensi sastra, catatan kurasi bacaan klasik, eksplorasi prosa, dan telaah pemikiran penulis dunia.",
    color: "#FFFBF0",
    bgColor: "#0057FF",
    icon: "BookOpen",
  },
  {
    name: "Movie",
    slug: "movie",
    description: "Kritik sinema, bedah narasi visual, sinematografi, dan ulasan film-film berpengaruh.",
    color: "#FFFBF0",
    bgColor: "#FF4040",
    icon: "Film",
  },
];

const tags = [
  { name: "Geopolitics", slug: "geopolitics", color: "#3178C6" },
  { name: "Revolution", slug: "revolution", color: "#FF4040" },
  { name: "Classics", slug: "classics", color: "#FFE500" },
  { name: "Sovereignty", slug: "sovereignty", color: "#0A0A0A" },
  { name: "Modernism", slug: "modernism", color: "#7B2FBE" },
];

const posts = [
  {
    title: "The Fall of Constantinople 1453: Geopolitical Rebirth and Trade Realignment",
    slug: "fall-of-constantinople-1453-geopolitical-turning-point",
    excerpt:
      "Explore how the fall of Byzantium shattered medieval trade, forced European explorers into the oceans, and laid the foundations of the Modern Age.",
    content: `## Introduction\n\nThe fall of Constantinople in 1453 represents one of the most critical turning points in human history. For over a millennium, the Byzantine Empire stood as a bulwark of Classical civilization, bridging East and West.`,
    coverImage: "https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?w=800&h=450&fit=crop",
    category: "buku",
    tags: ["geopolitics", "revolution"],
    featured: true,
    publishedAt: new Date("2026-05-20T08:00:00Z"),
  },
  {
    title: "Machiavelli in the 21st Century: Power, Realism, and Digital Sovereignty",
    slug: "machiavelli-21st-century-digital-sovereignty",
    excerpt:
      "A realist rethinking of 'The Prince' in the age of algorithmic statecraft, platform monopolies, and information warfare.",
    content: `## Introduction\n\nRethinking Niccolò Machiavelli in the 21st century requires looking past the cliché of "ends justifying the means." Machiavelli was a realist analyst of power, writing during a time of extreme Italian political fragmentation.`,
    coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=450&fit=crop",
    category: "opini",
    tags: ["geopolitics", "sovereignty"],
    featured: true,
    publishedAt: new Date("2026-05-18T09:00:00Z"),
  },
];

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  let author = await prisma.author.findFirst({ orderBy: { createdAt: "asc" } });
  if (!author) {
    if (!email || !password || password.length < 8) {
      throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (min. 8 characters) to create the admin account.");
    }
    author = await prisma.author.create({
      data: {
        name: "Admin",
        email,
        password: await hashPassword(password),
        avatar: `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        bio: "Tulis biografi Anda di CMS → Profil Penulis.",
      },
    });
    console.log(`Created admin account ${email}`);
  }

  for (const category of categories) {
    await prisma.category.upsert({ where: { slug: category.slug }, update: {}, create: category });
  }
  for (const tag of tags) {
    await prisma.tag.upsert({ where: { slug: tag.slug }, update: {}, create: tag });
  }

  for (const { category, tags: tagSlugs, ...post } of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        readingTime: estimateReadingTime(post.content),
        author: { connect: { id: author.id } },
        category: { connect: { slug: category } },
        tags: { connect: tagSlugs.map((slug) => ({ slug })) },
      },
    });
  }

  console.log("Seed complete (existing rows were left untouched).");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
