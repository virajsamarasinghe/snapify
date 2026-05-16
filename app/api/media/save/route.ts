import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
// Vercel serverless payload limit is 4.5 MB — keep file under that
const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string | null) ?? "snapify/media";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.",
        },
        { status: 400 },
      );
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum 4 MB per image." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "image",
      quality: "auto:best",
      overwrite: false,
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      success: true,
    });
  } catch (error: any) {
    const message = error?.message || "Upload failed";
    console.error("Media save error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
