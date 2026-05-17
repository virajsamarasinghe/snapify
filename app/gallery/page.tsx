/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import Album from "@/models/Album";
import Category from "@/models/Category";
import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

const SITE_URL = "https://www.jagathkalupahanaphotography.com";

export const metadata: Metadata = {
  title: "Photography Gallery — Weddings, Wildlife, Events & More",
  description:
    "Browse the complete photography gallery of Jagath Kalupahana. Curated collections spanning weddings, wildlife, university events, army coverage, school events and world photography. Award-winning images from Sri Lanka and beyond.",
  keywords: [
    "photography gallery Sri Lanka",
    "wedding photography gallery",
    "wildlife photography gallery",
    "event photography Sri Lanka",
    "Jagath Kalupahana gallery",
  ],
  alternates: { canonical: `${SITE_URL}/gallery` },
  openGraph: {
    type: "website",
    title:
      "Photography Gallery — Weddings, Wildlife & Events | Jagath Kalupahana",
    description:
      "Curated photography collections: weddings, wildlife, university events, army coverage, school events and world photography by award-winning photographer Jagath Kalupahana.",
    url: `${SITE_URL}/gallery`,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jagath Kalupahana Photography Gallery",
      },
    ],
  },
};

const gallerySchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Photography Gallery — Jagath Kalupahana",
  description:
    "Curated photography collections spanning weddings, wildlife, events, portraits and fine-art photography by Jagath Kalupahana.",
  url: `${SITE_URL}/gallery`,
  author: {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Jagath Kalupahana",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gallery",
        item: `${SITE_URL}/gallery`,
      },
    ],
  },
  hasPart: [
    {
      "@type": "ImageGallery",
      name: "Wedding Photography",
      url: `${SITE_URL}/gallery?category=Weddings`,
    },
    {
      "@type": "ImageGallery",
      name: "Wildlife Photography",
      url: `${SITE_URL}/gallery?category=Wildlife`,
    },
    {
      "@type": "ImageGallery",
      name: "Events Coverage",
      url: `${SITE_URL}/gallery?category=Events%20Coverage`,
    },
    {
      "@type": "ImageGallery",
      name: "University Events",
      url: `${SITE_URL}/gallery?category=University`,
    },
    {
      "@type": "ImageGallery",
      name: "School Events",
      url: `${SITE_URL}/gallery?category=School%20Events`,
    },
    {
      "@type": "ImageGallery",
      name: "World Photography",
      url: `${SITE_URL}/gallery?category=World%20Photography`,
    },
  ],
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  await dbConnect();

  // Fetch all gallery-visible categories
  const categoriesDocs = await Category.find({ showInGallery: { $ne: false } })
    .sort({ name: 1 })
    .lean()
    .catch(() => []);

  const categoryIds = (categoriesDocs as any[]).map((c: any) => c._id);

  // Fetch all albums for these categories
  const albumsDocs =
    categoryIds.length > 0
      ? await Album.find({ category: { $in: categoryIds } })
          .sort({ conductDate: -1, createdAt: -1 })
          .lean()
          .catch(() => [])
      : [];

  // Build gallery data: per category, collect all photos (cover + album photos)
  const galleryCategories = (categoriesDocs as any[]).map((doc: any) => {
    const catAlbums = (albumsDocs as any[]).filter(
      (a: any) => a.category.toString() === doc._id.toString(),
    );
    const allPhotos: string[] = [];
    // category cover image first
    if (doc.image) allPhotos.push(doc.image);
    // all album photos
    catAlbums.forEach((album: any) => {
      if (album.coverPhoto) allPhotos.push(album.coverPhoto);
      (album.photos || []).forEach((p: string) => allPhotos.push(p));
    });
    return {
      id: doc._id.toString(),
      name: doc.name,
      images: allPhotos.filter(Boolean),
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <GalleryClient galleryCategories={galleryCategories} />
    </>
  );
}
