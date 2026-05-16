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
  const filter = { productType };

  const [productsDocs, categoriesDocs] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).populate("category").lean(),
    Category.find().sort({ name: 1 }).lean(),
  ]);

  const products = productsDocs.map((doc: any) => ({
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description || "",
    price: doc.price,
    images: doc.images || [],
    status: doc.status || "available",
    productType: doc.productType || "gallery",
    category: doc.category
      ? { id: doc.category._id.toString(), name: doc.category.name }
      : { id: "", name: "Unknown" },
  }));

  const categories = categoriesDocs.map((doc: any) => ({
    id: doc._id.toString(),
    name: doc.name,
  }));

  return (
    <ProductManagement
      initialProducts={products}
      categories={categories}
      productType={productType}
    />
  );
}
