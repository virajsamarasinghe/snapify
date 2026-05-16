import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import Recognition from "@/models/Recognition";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET — list recognition photos already stored in MongoDB
export async function GET() {
  try {
    await dbConnect();
    const items = await Recognition.find({ image: { $nin: ["", null] } })
      .select("image")
      .lean();
    const photos = [
      ...new Set(
        (items as any[])
          .map((i) => i.image as string)
          .filter((u) => u.startsWith("http")),
      ),
    ];
    return NextResponse.json(photos);
  } catch {
    return NextResponse.json([]);
  }
}

// POST — save a Cloudinary URL after a direct browser upload
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
  if (!publicId.startsWith("snapify/recognition/")) {
    return NextResponse.json(
      { error: "Invalid image folder" },
      { status: 400 },
    );
  }

  return NextResponse.json({ url, publicId }, { status: 201 });
}

// DELETE — remove a recognition photo from Cloudinary (admin only)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { publicId } = await req.json();
  if (!publicId || !String(publicId).startsWith("snapify/recognition/")) {
    return NextResponse.json({ error: "Invalid publicId" }, { status: 400 });
  }

  await cloudinary.uploader.destroy(publicId);
  return NextResponse.json({ success: true });
}
