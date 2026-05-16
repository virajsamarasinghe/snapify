import { authOptions } from "@/lib/auth";
import cloudinary, { extractPublicId } from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import Recognition from "@/models/Recognition";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Admin: update entry
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { year, title, venue, description, type, image } = body;

  if (!year || !title || !venue || !description || !type) {
    return NextResponse.json(
      { error: "All fields except image are required" },
      { status: 400 },
    );
  }

  await dbConnect();
  const updated = await Recognition.findByIdAndUpdate(
    id,
    { year, title, venue, description, type, image: image || "" },
    { new: true },
  );

  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

// Admin: delete entry
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();
  const item = await Recognition.findById(id);
  if (item?.image) {
    const publicId = extractPublicId(item.image);
    if (publicId && publicId.startsWith("snapify/recognition/")) {
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }
  }
  await Recognition.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
