import { authOptions } from "@/lib/auth";
import cloudinary, { extractPublicId } from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import Album from "@/models/Album";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    await dbConnect();

    const album = await Album.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }
    return NextResponse.json(album);
  } catch (error) {
    console.error("Album update error:", error);
    return NextResponse.json(
      { error: "Error updating album" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await dbConnect();

    const album = await Album.findById(id);
    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    // Cleanup Cloudinary: cover photo + all photos
    const allUrls: string[] = [...(album.photos || [])];
    if (album.coverPhoto) allUrls.push(album.coverPhoto);

    await Promise.all(
      allUrls.map(async (url: string) => {
        const pid = extractPublicId(url);
        if (pid) {
          try {
            await cloudinary.uploader.destroy(pid);
          } catch {
            /* ignore */
          }
        }
      }),
    );

    await Album.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Album delete error:", error);
    return NextResponse.json(
      { error: "Error deleting album" },
      { status: 500 },
    );
  }
}
