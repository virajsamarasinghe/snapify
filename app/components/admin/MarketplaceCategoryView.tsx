"use client";

import { Camera, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  image: string | null;
};

export default function MarketplaceCategoryView({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
          Marketplace Products
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Select a category to manage individual listings
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="bg-zinc-900/50 rounded-2xl border border-white/5 px-6 py-20 flex flex-col items-center gap-4 text-zinc-500">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <ShoppingBag size={32} className="opacity-50" />
          </div>
          <p>
            No marketplace categories found. Enable &ldquo;Show in
            Marketplace&rdquo; on a category first.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => router.push(`/admin/marketplace/${cat.id}`)}
              className="group relative aspect-4/3 rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 hover:scale-[1.02]"
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                  <Camera size={32} className="text-zinc-600" />
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              {/* Category name */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-semibold text-sm leading-tight text-left">
                  {cat.name}
                </p>
              </div>
              {/* Hover ring */}
              <div className="absolute inset-0 ring-2 ring-pink-500/0 group-hover:ring-pink-500/40 rounded-2xl transition-all duration-300" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
