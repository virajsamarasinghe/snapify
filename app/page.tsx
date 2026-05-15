import HomePageWrapper from "./components/HomePageWrapper";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Hero from "@/models/Hero";
import fs from "fs/promises";
import path from "path";
// Ensure Product model is registered for populate
import "@/models/Product"; 

export const dynamic = "force-dynamic";

export default async function Home() {
  await dbConnect();

  // Fetch hero images from public/hero directory and filter out hidden ones
  let heroImages: any[] = [];
  try {
    const hiddenHeroes = await Hero.find({ isHidden: true }).select("src").lean();
    const hiddenSrcs = hiddenHeroes.map((h: any) => h.src);

    const heroDir = path.join(process.cwd(), "public/hero");
    const files = await fs.readdir(heroDir);
    heroImages = files
      .filter(file => [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(path.extname(file).toLowerCase()))
      .map(file => ({ src: `/hero/${file}` }))
      .filter(img => !hiddenSrcs.includes(img.src));
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
      options: { limit: 5 } // Limit images per category for performance
    })
    .lean();

  const categories = categoriesDocs.map((doc: any) => {
    // Determine size based on index or random? Let's use simple logic or round-robin
    // The original data had specific sizes. We can default to 'medium' or randomize.
    // For now, let's alternate.
    const sizes: ("small" | "medium" | "large")[] = ["medium", "large", "small", "medium"];
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

  return <HomePageWrapper categories={categories} heroImages={heroImages} />;
}