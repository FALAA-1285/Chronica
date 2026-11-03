import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { parseToc } from "@/lib/slug";
import type { Author, Category, Post, PostSummary, Track } from "@/lib/types";

// Public queries never select Author.email / Author.password.
const authorPublicSelect = {
  id: true,
  name: true,
  avatar: true,
  bio: true,
  story: true,
  twitter: true,
  github: true,
  linkedin: true,
} satisfies Prisma.AuthorSelect;

const summarySelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  publishedAt: true,
  readingTime: true,
  featured: true,
  views: true,
  likes: true,
  author: { select: { id: true, name: true, avatar: true } },
  category: { select: { id: true, name: true, slug: true, color: true, bgColor: true } },
  tags: { select: { id: true, name: true, slug: true, color: true } },
} satisfies Prisma.PostSelect;

const detailSelect = {
  ...summarySelect,
  content: true,
  updatedAt: true,
  author: { select: authorPublicSelect },
} satisfies Prisma.PostSelect;

type SummaryRow = Prisma.PostGetPayload<{ select: typeof summarySelect }>;
type DetailRow = Prisma.PostGetPayload<{ select: typeof detailSelect }>;
type AuthorRow = Prisma.AuthorGetPayload<{ select: typeof authorPublicSelect }>;

const published = { published: true } satisfies Prisma.PostWhereInput;
const newestFirst = { publishedAt: "desc" } satisfies Prisma.PostOrderByWithRelationInput;

function toAuthor(row: AuthorRow): Author {
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    bio: row.bio,
    story: row.story ?? "",
    social: {
      twitter: row.twitter || undefined,
      github: row.github || undefined,
      linkedin: row.linkedin || undefined,
    },
  };
}

function toSummary(row: SummaryRow): PostSummary {
  return { ...row, publishedAt: row.publishedAt.toISOString() };
}

function toPost(row: DetailRow): Post {
  return {
    ...row,
    publishedAt: row.publishedAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    author: toAuthor(row.author),
    tableOfContents: parseToc(row.content),
  };
}

export async function getPostSummaries(options: { limit?: number; featured?: boolean } = {}): Promise<PostSummary[]> {
  const rows = await prisma.post.findMany({
    where: { ...published, ...(options.featured ? { featured: true } : {}) },
    select: summarySelect,
    orderBy: newestFirst,
    take: options.limit,
  });
  return rows.map(toSummary);
}

export async function getPopularPosts(limit = 4): Promise<PostSummary[]> {
  const rows = await prisma.post.findMany({
    where: published,
    select: summarySelect,
    orderBy: [{ views: "desc" }, newestFirst],
    take: limit,
  });
  return rows.map(toSummary);
}

/** Deduplicated per request (generateMetadata + page both call it). */
export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const row = await prisma.post.findFirst({ where: { slug, ...published }, select: detailSelect });
  return row ? toPost(row) : null;
});

export async function getRelatedPosts(post: Pick<Post, "id" | "category">, limit = 3): Promise<PostSummary[]> {
  const rows = await prisma.post.findMany({
    where: { ...published, id: { not: post.id }, categoryId: post.category.id },
    select: summarySelect,
    orderBy: newestFirst,
    take: limit,
  });
  return rows.map(toSummary);
}

export async function searchPosts(query: string, limit = 8): Promise<PostSummary[]> {
  const q = query.trim();
  const rows = await prisma.post.findMany({
    where: q
      ? {
          ...published,
          OR: [{ title: { contains: q } }, { excerpt: { contains: q } }, { category: { name: { contains: q } } }],
        }
      : published,
    select: summarySelect,
    orderBy: newestFirst,
    take: limit,
  });
  return rows.map(toSummary);
}

export async function getCategoriesWithCount(): Promise<Category[]> {
  const rows = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      color: true,
      bgColor: true,
      icon: true,
      _count: { select: { posts: { where: published } } },
    },
  });
  return rows.map(({ _count, ...category }) => ({ ...category, count: _count.posts }));
}

/** Single-author blog: the first author account is the site owner. */
export const getSiteAuthor = cache(async (): Promise<Author | null> => {
  const row = await prisma.author.findFirst({ orderBy: { createdAt: "asc" }, select: authorPublicSelect });
  return row ? toAuthor(row) : null;
});

export async function getTracks(): Promise<Track[]> {
  return prisma.track.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, title: true, artist: true, audioUrl: true, coverUrl: true, duration: true },
  });
}

export async function getSitemapEntries() {
  return prisma.post.findMany({
    where: published,
    select: { slug: true, updatedAt: true },
    orderBy: newestFirst,
  });
}
