export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
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

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  category: Category;
  tags: Tag[];
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  featured: boolean;
  views: number;
  likes: number;
  tableOfContents: TocItem[];
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
  children?: TocItem[];
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
}
