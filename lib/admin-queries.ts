import type { Prisma } from "@prisma/client";

/** Shape returned by the admin post endpoints. */
export const adminPostInclude = {
  category: { select: { id: true, name: true } },
  tags: { select: { id: true, name: true } },
} satisfies Prisma.PostInclude;

/** Lists and save responses skip the (possibly huge) Markdown body; the editor loads it on demand. */
export const adminPostOmit = { content: true } satisfies Prisma.PostOmit;
