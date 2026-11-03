import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z, ZodError, type ZodType } from "zod";
import { getSessionUser, type SessionUser } from "@/lib/auth/session";
import { enforceLimits, type LimitRule } from "@/lib/rate-limit";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public headers?: Record<string, string>,
  ) {
    super(message);
  }
}

/** Maps any thrown value to a JSON response without leaking internals. */
export function handleApiError(error: unknown, context: string): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status, headers: error.headers });
  }
  if (error instanceof ZodError) {
    const first = error.issues[0];
    const field = first?.path.join(".");
    return NextResponse.json(
      { error: field ? `${field}: ${first.message}` : "Input tidak valid.", issues: z.flattenError(error).fieldErrors },
      { status: 400 },
    );
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Data dengan slug/email tersebut sudah ada." }, { status: 409 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });
    }
    if (error.code === "P2003") {
      return NextResponse.json({ error: "Data masih dipakai oleh data lain." }, { status: 409 });
    }
  }
  console.error(`[api] ${context}:`, error);
  return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
}

export async function readJson<T>(req: Request, schema: ZodType<T>): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, "Body harus berupa JSON yang valid.");
  }
  return schema.parse(body);
}

/** Throws a 429 with Retry-After when any of the rules is exceeded. */
export function assertWithinLimits(rules: LimitRule[], message: (retryAfterSeconds: number) => string) {
  const result = enforceLimits(rules);
  if (!result.ok) {
    throw new ApiError(429, message(result.retryAfterSeconds), { "Retry-After": String(result.retryAfterSeconds) });
  }
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Every admin route handler must call this first. Rejects requests without a
 * valid session and cross-origin state-changing requests (CSRF defense on top
 * of the SameSite=Lax cookie).
 */
export async function requireAdmin(req: Request): Promise<SessionUser> {
  if (!SAFE_METHODS.has(req.method)) {
    const origin = req.headers.get("origin");
    if (origin && !isSameOrigin(origin, req.url)) {
      throw new ApiError(403, "Permintaan lintas origin ditolak.");
    }
  }
  const user = await getSessionUser();
  if (!user) throw new ApiError(401, "Silakan login terlebih dahulu.");
  return user;
}

/** False for other hosts and for unparsable origins such as "null". */
export function isSameOrigin(origin: string, requestUrl: string): boolean {
  try {
    return new URL(origin).host === new URL(requestUrl).host;
  } catch {
    return false;
  }
}

export type RouteContext = { params: Promise<{ id: string }> };
