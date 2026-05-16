import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import AboutSettings from "@/models/AboutSettings";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

// POST — save a Cloudinary URL to MongoDB after a direct browser upload
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { url, publicId } = body as { url?: string; publicId?: string };

  if (!url || !publicId) {
    return NextResponse.json(
      { error: "url and publicId are required" },
      { status: 400 },
    );
  }
  if (!publicId.startsWith("snapify/about/")) {
    return NextResponse.json(
      { error: "Invalid image folder" },
      { status: 400 },
    );
  }

  await dbConnect();
  let settings = await AboutSettings.findOne();
  if (!settings) {
    settings = new AboutSettings({ photos: [url] });
  } else {
    const cleaned = (settings.photos || []).filter(
      (p: string) => p.startsWith("http") && p !== url,
    );
    settings.photos = [...cleaned, url];
  }
  await settings.save();

  return NextResponse.json({ url, publicId });
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
