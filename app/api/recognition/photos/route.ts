import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import Recognition from "@/models/Recognition";
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

// POST — upload a new recognition photo to Cloudinary (admin only)
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
    folder: "snapify/recognition",
    resource_type: "image",
    overwrite: false,
  });

  return NextResponse.json(
    { url: result.secure_url, publicId: result.public_id },
    { status: 201 },
  );
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
