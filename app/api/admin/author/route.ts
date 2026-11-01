import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ApiError, handleApiError, readJson, requireAdmin } from "@/lib/api";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { startSession } from "@/lib/auth/session";
import { removeUnusedUploads } from "@/lib/uploads";
import { authorInput } from "@/lib/validation";

const profileSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  bio: true,
  twitter: true,
  github: true,
  linkedin: true,
} as const;

// The author id always comes from the session, never from the request.
export async function GET(req: Request) {
  try {
    const user = await requireAdmin(req);
    const author = await prisma.author.findUniqueOrThrow({ where: { id: user.id }, select: profileSelect });
    return NextResponse.json(author);
  } catch (error) {
    return handleApiError(error, "get author");
  }
}

export async function PUT(req: Request) {
  try {
    const user = await requireAdmin(req);
    const { currentPassword, newPassword, ...profile } = await readJson(req, authorInput);

    const existing = await prisma.author.findUniqueOrThrow({ where: { id: user.id } });

    let passwordHash: string | undefined;
    if (newPassword) {
      if (!(await verifyPassword(currentPassword ?? "", existing.password))) {
        throw new ApiError(400, "Password saat ini salah.");
      }
      passwordHash = await hashPassword(newPassword);
    }

    const updated = await prisma.author.update({
      where: { id: user.id },
      data: {
        ...profile,
        twitter: profile.twitter || null,
        github: profile.github || null,
        linkedin: profile.linkedin || null,
        ...(passwordHash ? { password: passwordHash } : {}),
      },
      select: profileSelect,
    });

    // Changing the password revokes other sessions; keep this one signed in.
    if (passwordHash) await startSession(user.id, passwordHash);

    if (existing.avatar !== updated.avatar) await removeUnusedUploads([existing.avatar]);
    revalidatePath("/", "layout");

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error, "update author");
  }
}
