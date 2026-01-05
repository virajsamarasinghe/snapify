import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Link from "next/link";
import { 
  ShoppingBag, 
  FolderOpen, 
  PlusCircle, 
  TrendingUp, 
  ArrowRight
} from "lucide-react";

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
           Dashboard
         </h1>
         <p className="text-zinc-500 font-mono text-sm">Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Categories Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 hover:border-purple-500/50 transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex justify-between items-start">
             <div>
                <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                   <FolderOpen size={16} /> Total Categories
                </h3>
                <p className="text-5xl font-bold text-white tracking-tight">{categoriesCount}</p>
             </div>
             <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <TrendingUp size={24} />
             </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 hover:border-pink-500/50 transition-colors duration-300">
           <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           <div className="relative z-10 flex justify-between items-start">
             <div>
                <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                   <ShoppingBag size={16} /> Total Products
                </h3>
                <p className="text-5xl font-bold text-white tracking-tight">{productsCount}</p>
             </div>
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                <TrendingUp size={24} />
             </div>
           </div>
        </div>

        {/* Quick Actions Card */}
        <div className="group relative rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-4">
             Quick Actions
          </h3>
          <div className="flex flex-col gap-3">
             <Link
               href="/admin/categories"
               className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-purple-600/20 hover:text-purple-300 border border-transparent hover:border-purple-500/30 transition-all duration-300 group/link"
             >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <PlusCircle size={16} /> Add Category
                </span>
                <ArrowRight size={16} className="opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
             </Link>
             <Link
               href="/admin/products"
               className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-pink-600/20 hover:text-pink-300 border border-transparent hover:border-pink-500/30 transition-all duration-300 group/link"
             >
                 <span className="flex items-center gap-2 text-sm font-medium">
                  <PlusCircle size={16} /> Add Product
                </span>
                <ArrowRight size={16} className="opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
