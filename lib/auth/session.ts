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

export async function startSession(author: { id: string; password: string; sessionVersion: number }) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(author.id, author.password, author.sessionVersion), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

/**
 * Logs out and revokes the token server-side: bumping sessionVersion makes
 * every token issued so far invalid, even a copy stolen before logout.
 */
export async function endSession() {
  const user = await getSessionUser();
  if (user) {
    await prisma.author.update({ where: { id: user.id }, data: { sessionVersion: { increment: 1 } } });
  }
  (await cookies()).delete(SESSION_COOKIE);
}

/** Verifies the cookie against the database. Returns null when not logged in. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = readSessionToken(token);
  if (!payload) return null;

  const author = await prisma.author.findUnique({
    where: { id: payload.sub },
    select: { id: true, name: true, email: true, avatar: true, password: true, sessionVersion: true },
  });
  if (!author || passwordFingerprint(author.password) !== payload.pwd || author.sessionVersion !== payload.ver) return null;

  return { id: author.id, name: author.name, email: author.email, avatar: author.avatar };
}
