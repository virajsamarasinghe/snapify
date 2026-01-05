import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import MarketplaceClient from "./MarketplaceClient";

// Ensure models are registered
import "@/models/Product";
import "@/models/Category";

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
  await dbConnect();

  // Fetch all products with populated categories
  const productsDocs = await Product.find()
    .sort({ createdAt: -1 })
    .populate("category")
    .lean();

  // Fetch all categories
  const categoriesDocs = await Category.find().sort({ name: 1 }).lean();

  // Calculate counts per category based on fetched products
  const categoryCounts: { [key: string]: number } = {};
  
  const products = productsDocs.map((doc: any) => {
    const categoryDoc = doc.category;
    if (categoryDoc) {
      const catId = categoryDoc._id.toString();
      categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
    }
    
    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      price: doc.price,
      images: doc.images || [],
      category: categoryDoc
        ? {
            id: categoryDoc._id.toString(),
            name: categoryDoc.name,
            slug: categoryDoc.slug,
          }
        : { id: "unknown", name: "Unknown", slug: "unknown" },
    };
  });

  const categories = categoriesDocs.map((doc: any) => ({
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    count: categoryCounts[doc._id.toString()] || 0
  }));

  return (
    <MarketplaceClient 
      initialProducts={products} 
      initialCategories={categories} 
    />
  );
}