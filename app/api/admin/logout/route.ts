import { NextResponse } from "next/server";
import { ApiError, handleApiError, isSameOrigin } from "@/lib/api";
import { endSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    // Logging out revokes sessions server-side, so refuse cross-site requests.
    const origin = req.headers.get("origin");
    if (origin && !isSameOrigin(origin, req.url)) throw new ApiError(403, "Permintaan lintas origin ditolak.");

    await endSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "logout");
  }
}
