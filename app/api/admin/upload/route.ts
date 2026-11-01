import { NextResponse } from "next/server";
import { ApiError, handleApiError, requireAdmin } from "@/lib/api";
import { checkUpload } from "@/lib/upload-rules";
import { saveUpload } from "@/lib/uploads";

export async function POST(req: Request) {
  try {
    await requireAdmin(req);

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      throw new ApiError(400, "Body harus berupa multipart/form-data.");
    }

    const file = form.get("file");
    if (!(file instanceof File)) throw new ApiError(400, "Tidak ada berkas yang diunggah.");

    const data = Buffer.from(await file.arrayBuffer());
    const check = checkUpload(file.name, data.length, data.subarray(0, 16));
    if (!check.ok) throw new ApiError(400, check.error);

    const url = await saveUpload(file.name, data, check.kind, check.ext);
    return NextResponse.json({ url, kind: check.kind }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "upload");
  }
}
