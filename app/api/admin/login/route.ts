import { NextResponse } from "next/server";
import { prisma } from "../../../(frontend)/_lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan Password wajib diisi!" }, { status: 400 });
    }

    const author = await prisma.author.findUnique({
      where: { email },
    });

    if (!author || author.password !== password) {
      return NextResponse.json({ error: "Email atau Password salah!" }, { status: 401 });
    }

    // Return session details, exclude password
    const { password: _, ...sessionUser } = author;

    return NextResponse.json({
      success: true,
      message: "Login berhasil!",
      user: sessionUser,
    });
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Gagal memproses login." }, { status: 500 });
  }
}
