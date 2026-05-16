import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import AboutSettings from "@/models/AboutSettings";
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
const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB (Vercel 4.5 MB payload limit)

// GET — list existing about photos from MongoDB
export async function GET() {
  try {
    await dbConnect();
    const settings = (await AboutSettings.findOne().lean()) as any;
    const photos: string[] = Array.isArray(settings?.photos)
      ? (settings.photos as string[]).filter((p: string) =>
          p.startsWith("http"),
        )
      : [];
    return NextResponse.json(photos);
  } catch {
    return NextResponse.json([]);
  }
}

// POST — upload a new about photo (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
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
    folder: "snapify/about",
    resource_type: "image",
    quality: "auto:good",
    overwrite: false,
  });

  // Persist URL to MongoDB immediately (same as products/categories)
  await dbConnect();
  let settings = await AboutSettings.findOne();
  if (!settings) {
    settings = new AboutSettings({ photos: [result.secure_url] });
  } else {
    // Only add if not already present, and remove any local-path entries
    const cleaned = (settings.photos || []).filter(
      (p: string) => p.startsWith("http") && p !== result.secure_url,
    );
    settings.photos = [...cleaned, result.secure_url];
  }
  await settings.save();

  return NextResponse.json({
    url: result.secure_url,
    publicId: result.public_id,
  });
}

// DELETE — remove a photo from Cloudinary (admin only)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { publicId } = await req.json();
  if (!publicId || !String(publicId).startsWith("snapify/about/")) {
    return NextResponse.json(
      { error: "Invalid image reference" },
      { status: 400 },
    );
  }

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

  // Remove URL from MongoDB — derive the secure_url pattern to match
  await dbConnect();
  const settings = await AboutSettings.findOne();
  if (settings) {
    // Remove any URL that contains the publicId
    settings.photos = (settings.photos || []).filter(
      (p: string) => !p.includes(publicId),
    );
    await settings.save();
  }

  return NextResponse.json({ success: true });
}
