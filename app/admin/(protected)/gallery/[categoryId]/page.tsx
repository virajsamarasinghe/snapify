/* eslint-disable @typescript-eslint/no-explicit-any */
import AlbumManagement from "@/app/components/admin/AlbumManagement";
import dbConnect from "@/lib/db";
import Album from "@/models/Album";
import Category from "@/models/Category";
import Product from "@/models/Product";

// Ensure model registration
import "@/models/Album";
import "@/models/Category";
import "@/models/Product";

import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function GalleryCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  await dbConnect();

  const [categoryDoc, albumDocs, productDocs] = await Promise.all([
    Category.findById(categoryId).lean(),
    Album.find({ category: categoryId })
      .sort({ conductDate: -1, createdAt: -1 })
      .lean(),
    Product.find({ category: categoryId }).select("images").lean(),
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

  // Same photo pool the homepage preview card draws from: cover + product
  // images + album photos — used here so admins can pick featured images
  // from the exact same set.
  const productImages = (productDocs as any[]).flatMap(
    (p: any) => p.images || [],
  );
  const albumPhotos = albums.flatMap((a) => a.photos);
  const allPhotos = Array.from(
    new Set(
      [category.image, ...productImages, ...albumPhotos].filter(
        Boolean,
      ) as string[],
    ),
  );

  return (
    <AlbumManagement
      initialAlbums={albums}
      categoryId={categoryId}
      categoryName={category.name}
      allPhotos={allPhotos}
      initialFeaturedImages={category.featuredImages || []}
    />
  );
}
