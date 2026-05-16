import fs from "fs";
import type { MetadataRoute } from "next";
import path from "path";

const SITE_URL = "https://snapify-sooty.vercel.app";

function getHeroImages(): string[] {
  try {
    const heroDir = path.join(process.cwd(), "public/hero");
    return fs
      .readdirSync(heroDir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .map((f) => `/hero/${f}`);
  } catch {
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const heroImages = getHeroImages();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      // @ts-expect-error — Next.js image sitemap extension
      images: heroImages.map((src) => ({
        loc: `${SITE_URL}${src}`,
        title: "Jagath Kalupahana Photography",
        caption: "Professional photography by Jagath Kalupahana",
      })),
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/gallery?category=Weddings`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/gallery?category=Wildlife`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/gallery?category=Events%20Coverage`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
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
  ];
}
