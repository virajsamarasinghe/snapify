import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Hero from "@/models/Hero";
import Recognition from "@/models/Recognition";
import SiteSettings from "@/models/SiteSettings";
import fs from "fs/promises";
import path from "path";
import HomePageWrapper from "./components/HomePageWrapper";
// Ensure Product model is registered for populate
import "@/models/Product";

export const dynamic = "force-dynamic";

export default async function Home() {
  await dbConnect();

  // Fetch hero images from public/hero directory and filter out hidden ones
  let heroImages: any[] = [];
  try {
    const hiddenHeroes = await Hero.find({ isHidden: true })
      .select("src")
      .lean();
    const hiddenSrcs = hiddenHeroes.map((h: any) => h.src);

    const heroDir = path.join(process.cwd(), "public/hero");
    const files = await fs.readdir(heroDir);
    heroImages = files
      .filter((file) =>
        [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(
          path.extname(file).toLowerCase(),
        ),
      )
      .map((file) => ({ src: `/hero/${file}` }))
      .filter((img) => !hiddenSrcs.includes(img.src));
  } catch (e) {
    console.error("Failed to read hero directory:", e);
  }

  // Fetch categories and populate products to get images
  const categoriesDocs = await Category.find()
    .sort({ name: 1 })
    // We populate 'products' (virtual) to get images.
    // Mongoose virtuals population requires configuration in schema.
    .populate({
      path: "products",
      select: "images",
      options: { limit: 5 }, // Limit images per category for performance
    })
    .lean();

  const categories = categoriesDocs.map((doc: any) => {
    // Determine size based on index or random? Let's use simple logic or round-robin
    // The original data had specific sizes. We can default to 'medium' or randomize.
    // For now, let's alternate.
    const sizes: ("small" | "medium" | "large")[] = [
      "medium",
      "large",
      "small",
      "medium",
    ];
    // Deterministic randomish based on name length
    const size = sizes[doc.name.length % sizes.length];

    // Collect images from products
    const productImages = doc.products
      ? doc.products.flatMap((p: any) => p.images || [])
      : [];

    // Add category image if exists
    const images = [doc.image, ...productImages].filter(Boolean);

    return {
      id: doc._id.toString(),
      title: doc.name,
      images: images.length > 0 ? images : ["/placeholder.jpg"], // Fallback
      description: `Explore our ${doc.name} collection.`, // Generic description
      size: size,
    };
  });

  // Fetch recognition/achievements entries — top 8 only
  const recognitionDocs = await Recognition.find()
    .sort({ order: 1, createdAt: 1 })
    .limit(8)
    .lean();
  const achievements = recognitionDocs.map((doc: any) => ({
    _id: doc._id.toString(),
    year: doc.year,
    title: doc.title,
    venue: doc.venue,
    description: doc.description,
    type: doc.type as "award" | "exhibition" | "feature",
    image: doc.image || "",
    order: doc.order,
  }));

  // Fetch site settings
  let showMarketplace = true;
  try {
    const siteSettings = await SiteSettings.findOne().lean();
    if (siteSettings) showMarketplace = (siteSettings as any).showMarketplace;
  } catch (e) {
    console.error("Failed to fetch site settings:", e);
  }

  return (
    <HomePageWrapper
      categories={categories}
      heroImages={heroImages}
      achievements={achievements}
      showMarketplace={showMarketplace}
    />
  );
}
