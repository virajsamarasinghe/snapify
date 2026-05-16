import AlbumManagement from "@/app/components/admin/AlbumManagement";
import dbConnect from "@/lib/db";
import Album from "@/models/Album";
import Category from "@/models/Category";

// Ensure model registration
import "@/models/Album";
import "@/models/Category";

import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function GalleryCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  await dbConnect();

  const [categoryDoc, albumDocs] = await Promise.all([
    Category.findById(categoryId).lean(),
    Album.find({ category: categoryId })
      .sort({ conductDate: -1, createdAt: -1 })
      .lean(),
  ]);

  if (!categoryDoc) notFound();

  const category = categoryDoc as any;

  const albums = (albumDocs as any[]).map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description || "",
    conductDate: doc.conductDate
      ? (doc.conductDate as Date).toISOString()
      : null,
    location: doc.location || "",
    coverPhoto: doc.coverPhoto || "",
    photos: doc.photos || [],
  }));

  return (
    <AlbumManagement
      initialAlbums={albums}
      categoryId={categoryId}
      categoryName={category.name}
    />
  );
}
