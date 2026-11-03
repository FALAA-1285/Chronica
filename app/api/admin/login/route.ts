import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ApiError, assertWithinLimits, handleApiError, readJson } from "@/lib/api";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { startSession } from "@/lib/auth/session";
import { clientIp, LIMITS, resetRateLimit } from "@/lib/rate-limit";
import { loginInput } from "@/lib/validation";

let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= hashPassword("timing-equalizer"));

export async function POST(req: Request) {
  try {
    const { email, password } = await readJson(req, loginInput);

    const rules = LIMITS.login(clientIp(req), email.toLowerCase());
    assertWithinLimits(rules, (s) => `Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil(s / 60)} menit.`);

    const author = await prisma.author.findUnique({ where: { email } });
    // Hash even for unknown emails so response time does not reveal which emails exist.
    const valid = await verifyPassword(password, author?.password ?? (await getDummyHash()));
    if (!author || !valid) {
      throw new ApiError(401, "Email atau password salah.");
    }

    rules.forEach((rule) => resetRateLimit(rule.key));
    await startSession(author);
    return NextResponse.json({ user: { id: author.id, name: author.name, email: author.email, avatar: author.avatar } });
  } catch (error) {
    return handleApiError(error, "login");
  }
}
