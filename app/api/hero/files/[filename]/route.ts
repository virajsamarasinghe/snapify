import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { filename } = await params;
    // filename is the URL-encoded Cloudinary publicId (e.g. "snapify%2Fhero%2F1")
    const publicId = decodeURIComponent(filename);

    // Security: only allow deleting images in the snapify/ namespace
    if (!publicId.startsWith("snapify/")) {
      return NextResponse.json(
        { error: "Invalid image reference" },
        { status: 400 },
      );
    }

    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hero delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 },
    );
  }
}
