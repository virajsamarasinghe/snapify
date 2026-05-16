import ProductManagement from "@/app/components/admin/ProductManagement";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

import "@/models/Category";
import "@/models/Product";

import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MarketplaceCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  await dbConnect();

  const categoryDoc = await Category.findById(categoryId).lean();
  if (!categoryDoc) notFound();

  const category = categoryDoc as any;

  const productsDocs = await Product.find({
    productType: "marketplace",
    category: categoryId,
  })
    .sort({ createdAt: -1 })
    .lean();

  const products = (productsDocs as any[]).map((doc) => ({
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description || "",
    price: doc.price,
    images: doc.images || [],
    status: doc.status || "available",
    productType: "marketplace" as const,
    category: {
      id: categoryId,
      name: category.name,
    },
  }));

  const fixedCategory = {
    id: categoryId,
    name: category.name,
  };

  return (
    <ProductManagement
      initialProducts={products}
      categories={[fixedCategory]}
      productType="marketplace"
      fixedCategory={fixedCategory}
    />
  );
}
