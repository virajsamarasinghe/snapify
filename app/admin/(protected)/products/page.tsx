import GalleryCategoryView from "@/app/components/admin/GalleryCategoryView";
import MarketplaceCategoryView from "@/app/components/admin/MarketplaceCategoryView";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

// Ensure models
import "@/models/Category";
import "@/models/Product";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await dbConnect();

  const { type } = await searchParams;
  const productType = type === "marketplace" ? "marketplace" : "gallery";

  if (productType === "gallery") {
    const categoriesDocs = await Category.find().sort({ name: 1 }).lean();
    const categories = (categoriesDocs as any[]).map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      image: doc.image || null,
    }));
    return <GalleryCategoryView categories={categories} />;
  }

  // Marketplace → only categories with showInMarketplace: true
  const categoriesDocs = await Category.find({ showInMarketplace: true })
    .sort({ name: 1 })
    .lean();
  const categories = (categoriesDocs as any[]).map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    image: doc.image || null,
  }));
  return <MarketplaceCategoryView categories={categories} />;
}
