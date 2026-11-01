import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ApiError, handleApiError, readJson } from "@/lib/api";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { startSession } from "@/lib/auth/session";
import { clientIp, rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { loginInput } from "@/lib/validation";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= hashPassword("timing-equalizer"));

export async function POST(req: Request) {
  try {
    const { email, password } = await readJson(req, loginInput);

    const key = `login:${clientIp(req)}:${email.toLowerCase()}`;
    const limit = rateLimit(key, MAX_ATTEMPTS, WINDOW_MS);
    if (!limit.ok) {
      throw new ApiError(429, `Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil(limit.retryAfterSeconds / 60)} menit.`, {
        "Retry-After": String(limit.retryAfterSeconds),
      });
    }

    const author = await prisma.author.findUnique({ where: { email } });
    // Hash even for unknown emails so response time does not reveal which emails exist.
    const valid = await verifyPassword(password, author?.password ?? (await getDummyHash()));
    if (!author || !valid) {
      throw new ApiError(401, "Email atau password salah.");
    }

    resetRateLimit(key);
    await startSession(author.id, author.password);
    return NextResponse.json({ user: { id: author.id, name: author.name, email: author.email, avatar: author.avatar } });
  } catch (error) {
    return handleApiError(error, "login");
  }
}
