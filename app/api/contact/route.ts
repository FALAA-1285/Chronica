import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ApiError, handleApiError, readJson } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { contactInput } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const limit = rateLimit(`contact:${clientIp(req)}`, 5, 60 * 60 * 1000);
    if (!limit.ok) {
      throw new ApiError(429, "Terlalu banyak pesan terkirim. Coba lagi nanti.", {
        "Retry-After": String(limit.retryAfterSeconds),
      });
    }

    const { website, subject, ...message } = await readJson(req, contactInput);

    // Honeypot filled in: pretend success so bots don't learn to adapt.
    if (website) return NextResponse.json({ success: true }, { status: 201 });

    await prisma.contactMessage.create({ data: { ...message, subject: subject || null } });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "contact");
  }
}
