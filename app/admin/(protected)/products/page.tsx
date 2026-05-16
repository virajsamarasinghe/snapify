import GalleryCategoryView from "@/app/components/admin/GalleryCategoryView";
import ProductManagement from "@/app/components/admin/ProductManagement";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

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

  // Gallery → show category cards so admin can drill into albums
  if (productType === "gallery") {
    const categoriesDocs = await Category.find().sort({ name: 1 }).lean();
    const categories = (categoriesDocs as any[]).map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      image: doc.image || null,
    }));
    return <GalleryCategoryView categories={categories} />;
  }

  // Marketplace → keep the product table as before
  const [productsDocs, categoriesDocs] = await Promise.all([
    Product.find({ productType: "marketplace" })
      .sort({ createdAt: -1 })
      .populate("category")
      .lean(),
    Category.find().sort({ name: 1 }).lean(),
  ]);

  const products = (productsDocs as any[]).map((doc) => ({
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description || "",
    price: doc.price,
    images: doc.images || [],
    status: doc.status || "available",
    productType: doc.productType || "marketplace",
    category: doc.category
      ? { id: doc.category._id.toString(), name: doc.category.name }
      : { id: "", name: "Unknown" },
  }));

  const categories = (categoriesDocs as any[]).map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
  }));

  return (
    <ProductManagement
      initialProducts={products}
      categories={categories}
      productType="marketplace"
    />
  );
}
