import { prisma } from "@/lib/db";

/** Public comment shape: the commenter's email is never included. */
export interface PublicComment {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

export const publicCommentSelect = { id: true, name: true, content: true, createdAt: true } as const;

export const adminCommentSelect = {
  ...publicCommentSelect,
  email: true,
  approved: true,
  post: { select: { id: true, title: true, slug: true } },
} as const;

export function toPublicComment(row: { id: string; name: string; content: string; createdAt: Date }): PublicComment {
  return { ...row, createdAt: row.createdAt.toISOString() };
}

export async function getApprovedComments(postId: string): Promise<PublicComment[]> {
  const rows = await prisma.comment.findMany({
    where: { postId, approved: true },
    select: publicCommentSelect,
    orderBy: { createdAt: "asc" },
    take: 500,
  });
  return rows.map(toPublicComment);
}
