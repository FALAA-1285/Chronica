export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  /** Long-form Markdown story for the About page. */
  story: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
  count: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

/** Card/list shape: everything except the article body. */
export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: Pick<Author, "id" | "name" | "avatar">;
  category: Pick<Category, "id" | "name" | "slug" | "color" | "bgColor">;
  tags: Tag[];
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  views: number;
  likes: number;
}

export interface Post extends PostSummary {
  content: string;
  updatedAt: string;
  author: Author;
  tableOfContents: TocItem[];
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string | null;
  duration: number | null;
}
