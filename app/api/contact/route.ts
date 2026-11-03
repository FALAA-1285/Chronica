import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertWithinLimits, handleApiError, readJson } from "@/lib/api";
import { clientIp, LIMITS } from "@/lib/rate-limit";
import { contactInput } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    assertWithinLimits(LIMITS.contact(clientIp(req)), () => "Terlalu banyak pesan terkirim. Coba lagi nanti.");

    const { website, subject, ...message } = await readJson(req, contactInput);

    // Honeypot filled in: pretend success so bots don't learn to adapt.
    if (website) return NextResponse.json({ success: true }, { status: 201 });

    await prisma.contactMessage.create({ data: { ...message, subject: subject || null } });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "contact");
  }
}
