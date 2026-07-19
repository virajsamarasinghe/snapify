import { authOptions } from "@/lib/auth";
import cloudinary, { extractPublicId } from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import Album from "@/models/Album";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * DELETE /api/albums/[id]/photos
 * Body: { photos: string[] }  — list of photo URLs to remove
 * Removes photos from Cloudinary and from the album's photos array.
 */
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
    const body = await req.json();
    const toDelete: string[] = Array.isArray(body.photos) ? body.photos : [];

    await dbConnect();
    const album = await Album.findById(id);
    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    // Delete from Cloudinary
    await Promise.all(
      toDelete.map(async (url: string) => {
        const pid = extractPublicId(url);
        if (pid) {
          try {
            await cloudinary.uploader.destroy(pid);
          } catch {
            /* ignore individual failures */
          }
        }
      }),
    );

    // Remove from album's photos array
    const remaining = (album.photos as string[]).filter(
      (p) => !toDelete.includes(p),
    );
    album.photos = remaining;
    await album.save();

    revalidatePath("/");
    return NextResponse.json({ success: true, photos: remaining });
  } catch (error) {
    console.error("Album photos delete error:", error);
    return NextResponse.json(
      { error: "Error deleting photos" },
      { status: 500 },
    );
  }
}
