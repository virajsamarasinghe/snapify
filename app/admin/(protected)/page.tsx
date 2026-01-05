import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

// Ensure models are registered
import "@/models/Category"; 
import "@/models/Product";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await dbConnect();
  
  const [categoriesCount, productsCount] = await Promise.all([
    Category.countDocuments(),
    Product.countDocuments(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">
            Total Categories
          </h3>
          <p className="text-4xl font-bold text-white">{categoriesCount}</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">
            Total Products
          </h3>
          <p className="text-4xl font-bold text-white">{productsCount}</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">
            Quick Actions
          </h3>
          <div className="flex flex-col gap-2 mt-2">
            <a
              href="/admin/categories"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              + Add New Category
            </a>
            <a
              href="/admin/products"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              + Add New Product
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
