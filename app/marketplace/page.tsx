import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import type { Metadata } from "next";
import MarketplaceClient from "./MarketplaceClient";

// Ensure models are registered
import "@/models/Category";
import "@/models/Product";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Photography Print Marketplace",
  description:
    "Purchase fine-art photography prints by Jagath Kalupahana. Limited edition prints from weddings, wildlife, events and portrait collections. Worldwide shipping.",
  alternates: { canonical: "https://snapify-sooty.vercel.app/marketplace" },
  openGraph: {
    title: "Photography Print Marketplace | Jagath Kalupahana",
    description:
      "Buy limited edition fine-art photography prints. Weddings, wildlife, portraits and more. Worldwide shipping.",
    url: "https://snapify-sooty.vercel.app/marketplace",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Photography Prints Marketplace",
      },
    ],
  },
};

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
    count: categoryCounts[doc._id.toString()] || 0,
  }));

  return (
    <MarketplaceClient
      initialProducts={products}
      initialCategories={categories}
    />
  );
}
