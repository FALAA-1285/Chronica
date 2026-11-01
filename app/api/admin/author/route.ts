import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../(frontend)/_lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID author wajib disertakan!" },
        { status: 400 }
      );
    }

    const author = await prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      return NextResponse.json(
        { error: "Author tidak ditemukan!" },
        { status: 404 }
      );
    }

    return NextResponse.json(author);
  } catch (error: any) {
    console.error("Gagal mengambil data author:", error);
    return NextResponse.json(
      { error: "Gagal memproses permintaan data author." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      email,
      password,
      avatar,
      bio,
      twitter,
      github,
      linkedin,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID author wajib disertakan!" },
        { status: 400 }
      );
    }

    // Check email uniqueness if email is modified
    if (email) {
      const existingAuthor = await prisma.author.findUnique({
        where: { email },
      });
      if (existingAuthor && existingAuthor.id !== id) {
        return NextResponse.json(
          { error: "Email sudah digunakan oleh author lain!" },
          { status: 400 }
        );
      }
    }

    const updatedAuthor = await prisma.author.update({
      where: { id },
      data: {
        name,
        email,
        password,
        avatar,
        bio,
        twitter,
        github,
        linkedin,
      },
    });

    // Exclude password from returned payload for security
    const { password: _, ...sessionUser } = updatedAuthor;

    return NextResponse.json({
      success: true,
      message: "Profil author berhasil diperbarui!",
      user: sessionUser,
    });
  } catch (error: any) {
    console.error("Gagal memperbarui data author:", error);
    return NextResponse.json(
      { error: error.message || "Gagal memperbarui profil author." },
      { status: 500 }
    );
  }
}
