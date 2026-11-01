import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { createSessionToken, passwordFingerprint, readSessionToken, SESSION_TTL_SECONDS } from "./token";

export const SESSION_COOKIE = "chronica_admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export async function startSession(authorId: string, passwordHash: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(authorId, passwordHash), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Verifies the cookie against the database. Returns null when not logged in. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = readSessionToken(token);
  if (!payload) return null;

  const author = await prisma.author.findUnique({
    where: { id: payload.sub },
    select: { id: true, name: true, email: true, avatar: true, password: true },
  });
  if (!author || passwordFingerprint(author.password) !== payload.pwd) return null;

  return { id: author.id, name: author.name, email: author.email, avatar: author.avatar };
}
