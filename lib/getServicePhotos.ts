/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import Album from "@/models/Album";
import Category from "@/models/Category";

/**
 * Collect gallery photos whose category name matches any of the given keywords.
 * Used by the convocation and cricket/sports landing pages so they reuse the
 * same photos managed in the admin gallery.
 */
export async function getServicePhotos(
  keywords: string[],
  limit = 24,
): Promise<string[]> {
  try {
    await dbConnect();

    const regex = new RegExp(keywords.join("|"), "i");

    const categories = (await Category.find({
      showInGallery: { $ne: false },
      name: { $regex: regex },
    })
      .lean()
      .catch(() => [])) as any[];

    if (!categories.length) return [];

    const categoryIds = categories.map((c) => c._id);

    const albums = (await Album.find({ category: { $in: categoryIds } })
      .sort({ conductDate: -1, createdAt: -1 })
      .lean()
      .catch(() => [])) as any[];

    const photos: string[] = [];

    categories.forEach((c) => {
      if (c.image) photos.push(c.image);
    });
    albums.forEach((a) => {
      if (a.coverPhoto) photos.push(a.coverPhoto);
      (a.photos || []).forEach((p: string) => photos.push(p));
    });

    return Array.from(new Set(photos.filter(Boolean))).slice(0, limit);
  } catch {
    return [];
  }
}
