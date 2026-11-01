import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada berkas yang diunggah." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine subfolder based on file type / extension
    let subfolder = "images";
    const fileType = file.type || "";
    const fileName = file.name || "";

    if (
      fileType.startsWith("audio/") ||
      fileName.endsWith(".mp3") ||
      fileName.endsWith(".wav") ||
      fileName.endsWith(".ogg") ||
      fileName.endsWith(".m4a")
    ) {
      subfolder = "audio";
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", subfolder);

    // Ensure the directory exists recursively
    await mkdir(uploadDir, { recursive: true });

    // Generate safe, unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);
    const sanitizedBase = baseName
      .replace(/[^a-zA-Z0-9]/g, "_")
      .substring(0, 100); // Sanitize and limit name length
    const finalFilename = `${sanitizedBase}-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadDir, finalFilename);

    // Write file to disk
    await writeFile(filePath, buffer);

    // Relative URL path to be stored in the database
    const relativeUrl = `/uploads/${subfolder}/${finalFilename}`;

    return NextResponse.json({
      success: true,
      url: relativeUrl,
      fileName: fileName,
      type: fileType,
    });
  } catch (err: any) {
    console.error("Gagal mengunggah berkas:", err);
    return NextResponse.json(
      { error: err.message || "Gagal memproses unggah berkas." },
      { status: 500 }
    );
  }
}
