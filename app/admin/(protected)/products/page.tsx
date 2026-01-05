import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductManagement from "@/app/components/admin/ProductManagement";

// Ensure models
import "@/models/Product";
import "@/models/Category";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await dbConnect();

  const [productsDocs, categoriesDocs] = await Promise.all([
    Product.find().sort({ createdAt: -1 }).populate("category").lean(),
    Category.find().sort({ name: 1 }).lean(),
  ]);

  const products = productsDocs.map((doc: any) => ({
    id: doc._id.toString(),
    title: doc.title,
    price: doc.price,
    images: doc.images || [],
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
    />
  );
}
