import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import type { MetadataRoute } from "next";
import { SERVICE_PAGES } from "./[slug]/services-data";

const SITE_URL = "https://www.jagathkalupahanaphotography.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Category gallery URLs generated from the database
  let categoryEntries: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const categories = await Category.find({ showInGallery: { $ne: false } })
      .select("name")
      .lean();
    categoryEntries = (categories as { name: string }[]).map((c) => ({
      url: `${SITE_URL}/gallery?category=${encodeURIComponent(c.name)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable — base pages still emitted
  }

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about-jagath-kalupahana`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/awards-and-exhibitions`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/client-reviews`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...SERVICE_PAGES.map((s) => ({
      url: `${SITE_URL}/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...categoryEntries,
    {
      url: `${SITE_URL}/work`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/marketplace`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
