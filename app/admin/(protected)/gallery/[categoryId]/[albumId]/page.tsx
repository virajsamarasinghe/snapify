import AlbumDetailView from "@/app/components/admin/AlbumDetailView";
import dbConnect from "@/lib/db";
import Album from "@/models/Album";
import Category from "@/models/Category";

// Ensure model registration
import "@/models/Album";
import "@/models/Category";

import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ categoryId: string; albumId: string }>;
}) {
  const { categoryId, albumId } = await params;
  await dbConnect();

  const [categoryDoc, albumDoc] = await Promise.all([
    Category.findById(categoryId).lean(),
    Album.findById(albumId).lean(),
  ]);

  if (!categoryDoc || !albumDoc) notFound();

  const category = categoryDoc as any;
  const doc = albumDoc as any;

  const album = {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description || "",
    conductDate: doc.conductDate
      ? (doc.conductDate as Date).toISOString()
      : null,
    location: doc.location || "",
    coverPhoto: doc.coverPhoto || "",
    photos: (doc.photos || []) as string[],
  };

  return (
    <AlbumDetailView
      album={album}
      categoryId={categoryId}
      categoryName={category.name}
    />
  );
}
