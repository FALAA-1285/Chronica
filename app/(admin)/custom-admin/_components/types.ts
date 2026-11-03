/** List shape: no Markdown body (see AdminPostDetail). */
export interface AdminPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  readingTime: number;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  categoryId: string;
  category: { id: string; name: string };
  tags: { id: string; name: string }[];
}

export interface AdminPostDetail extends AdminPost {
  content: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
  _count: { posts: number };
}

export interface AdminTag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface AdminTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string | null;
  duration: number | null;
}

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AdminComment {
  id: string;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: string;
  post: { id: string; title: string; slug: string };
}
