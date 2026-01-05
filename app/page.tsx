import HomePageWrapper from "./components/HomePageWrapper";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
// Ensure Product model is registered for populate
import "@/models/Product"; 

export const dynamic = "force-dynamic";

export default async function Home() {
  await dbConnect();

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

  return <HomePageWrapper categories={categories} />;
}