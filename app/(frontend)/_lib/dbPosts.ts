import { posts } from "./posts";
import { Post, TocItem } from "./types";
import { prisma } from "./db";

// Helper to dynamically parse Markdown headings to build a Table of Contents
export const parseToc = (content: string): TocItem[] => {
  if (!content) return [];
  const lines = content.split("\n");
  const toc: TocItem[] = [];
  
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      const title = line.slice(3).trim();
      toc.push({
        id: slugify(title),
        title,
        level: 2,
      });
    } else if (line.startsWith("### ")) {
      const title = line.slice(4).trim();
      toc.push({
        id: slugify(title),
        title,
        level: 3,
      });
    }
  }
  return toc;
};

// Helper to map Prisma's raw database post to the frontend's Post interface
const mapPrismaPost = (dbPost: any): Post => {
  const content = dbPost.content || "";
  return {
    id: dbPost.id,
    title: dbPost.title,
    slug: dbPost.slug,
    excerpt: dbPost.excerpt || "",
    content: content,
    coverImage: dbPost.coverImage || "",
    readingTime: dbPost.readingTime || 5,
    featured: dbPost.featured || false,
    category: dbPost.category ? {
      id: dbPost.category.id,
      name: dbPost.category.name,
      slug: dbPost.category.slug,
      description: dbPost.category.description || "",
      color: dbPost.category.color || "#0A0A0A",
      bgColor: dbPost.category.bgColor || "#FFE500",
      icon: dbPost.category.icon || "BookOpen",
      count: 0
    } : { id: "general", name: "General", slug: "general", description: "", color: "", bgColor: "", icon: "", count: 0 },
    tags: Array.isArray(dbPost.tags) ? dbPost.tags.map((tag: any) => ({
      id: tag.id,
      name: tag.name || "",
      slug: tag.slug || "",
      color: tag.color || "#7B2FBE",
    })) : [],
    author: dbPost.author ? {
      id: dbPost.author.id,
      name: dbPost.author.name,
      avatar: dbPost.author.avatar || "https://api.dicebear.com/8.x/avataaars/svg?seed=Bambang",
      bio: dbPost.author.bio || "",
      social: {
        twitter: dbPost.author.twitter || undefined,
        github: dbPost.author.github || undefined,
        linkedin: dbPost.author.linkedin || undefined,
      }
    } : {
      id: "author-1",
      name: "Prof. Bambang Utomo",
      avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Bambang",
      bio: "Seorang sejarawan sosial, penulis, dan blogger veteran.",
      social: {}
    },
    publishedAt: dbPost.publishedAt instanceof Date ? dbPost.publishedAt.toISOString() : dbPost.publishedAt,
    updatedAt: dbPost.updatedAt instanceof Date ? dbPost.updatedAt.toISOString() : dbPost.updatedAt,
    views: dbPost.views || 0,
    likes: dbPost.likes || 0,
    tableOfContents: parseToc(content)
  };
};

export const getFeaturedPosts = async (): Promise<Post[]> => {
  try {
    const dbPosts = await prisma.post.findMany({
      where: { featured: true },
      include: {
        category: true,
        tags: true,
        author: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
    if (dbPosts && dbPosts.length > 0) {
      return dbPosts.map(mapPrismaPost);
    }
  } catch (err) {
    console.error("DB error in getFeaturedPosts, falling back to static:", err);
  }
  return posts.filter((p) => p.featured).slice(0, 3);
};

export const getLatestPosts = async (limit?: number): Promise<Post[]> => {
  try {
    const dbPosts = await prisma.post.findMany({
      orderBy: { publishedAt: "desc" },
      include: {
        category: true,
        tags: true,
        author: true,
      },
      take: limit,
    });
    if (dbPosts && dbPosts.length > 0) {
      return dbPosts.map(mapPrismaPost);
    }
  } catch (err) {
    console.error("DB error in getLatestPosts, falling back to static:", err);
  }
  const sorted = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
};

export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
        author: true,
      },
    });
    if (post) {
      return mapPrismaPost(post);
    }
  } catch (err) {
    console.error("DB error in getPostBySlug, falling back to static:", err);
  }
  return posts.find((p) => p.slug === slug);
};

export const getPostsByCategory = async (categorySlug: string): Promise<Post[]> => {
  try {
    const dbPosts = await prisma.post.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      include: {
        category: true,
        tags: true,
        author: true,
      },
      orderBy: { publishedAt: "desc" },
    });
    if (dbPosts && dbPosts.length > 0) {
      return dbPosts.map(mapPrismaPost);
    }
  } catch (err) {
    console.error("DB error in getPostsByCategory, falling back to static:", err);
  }
  return posts.filter((p) => p.category.slug === categorySlug);
};

export const getRelatedPosts = async (post: Post, limit = 3): Promise<Post[]> => {
  try {
    const dbPosts = await prisma.post.findMany({
      where: {
        id: { not: post.id },
        categoryId: post.category.id,
      },
      include: {
        category: true,
        tags: true,
        author: true,
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
    if (dbPosts && dbPosts.length > 0) {
      return dbPosts.map(mapPrismaPost);
    }
  } catch (err) {
    console.error("DB error in getRelatedPosts, falling back to static:", err);
  }
  return posts
    .filter((p) => p.id !== post.id && p.category.id === post.category.id)
    .slice(0, limit);
};
