"use client";

import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import {
    ArrowLeft,
    DollarSign,
    Edit2,
    Image as ImageIcon,
    Plus,
    ShoppingBag,
    Tag,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

type Category = {
  id: string;
  name: string;
};

type ProductStatus = "available" | "coming_soon" | "sold";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: ProductStatus;
  productType: "gallery" | "marketplace";
  category: Category;
};

export default function ProductManagement({
  initialProducts,
  categories,
  productType,
  fixedCategory,
}: {
  initialProducts: Product[];
  categories: Category[];
  productType: "gallery" | "marketplace";
  fixedCategory?: { id: string; name: string };
}) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<ProductStatus>("available");
  const [categoryId, setCategoryId] = useState(fixedCategory?.id ?? "");
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setDescription(product.description || "");
    setPrice(product.price.toString());
    setCategoryId(product.category?.id || "");
    setStatus(product.status || "available");
    setExistingImages(product.images || []);
    setIsCreating(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setCategoryId(fixedCategory?.id ?? "");
    setStatus("available");
    setImageFiles(null);
    setExistingImages([]);
    setIsCreating(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !price || !categoryId || !description) return;

    setUploading(true);
    // Start from current existingImages (already has removed ones filtered out)
    let uploadedImages: string[] = editingProduct ? existingImages : [];

    // Derive category slug for organized Cloudinary folder
    const selectedCat = categories.find((c) => c.id === categoryId);
    const catSlug = selectedCat
      ? selectedCat.name
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "")
      : "uncategorized";
    const productFolder = `snapify/categories/market/${catSlug}`;

    try {
      // 1. Upload Images
      if (imageFiles && imageFiles.length > 0) {
        const newImages: string[] = [];
        for (let i = 0; i < imageFiles.length; i++) {
          // Upload directly from browser → Cloudinary (bypasses Vercel body limit)
          const { url } = await uploadToCloudinary(
            imageFiles[i],
            productFolder,
          );
          newImages.push(url);
        }
        uploadedImages = [...uploadedImages, ...newImages];
      }

      const payload = {
        title,
        description,
        price: parseFloat(price),
        categoryId,
        status,
        images: uploadedImages,
        productType,
      };

      if (editingProduct) {
        // UPDATE
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const updatedProduct = await res.json();
          const catObj =
            categories.find((c) => c.id === categoryId) ||
            updatedProduct.category;
          setProducts(
            products.map((p) =>
              p.id === updatedProduct._id
                ? {
                    ...p,
                    ...updatedProduct,
                    id: updatedProduct._id,
                    category: catObj,
                  }
                : p,
            ),
          );
          cancelEdit();
        }
      } else {
        // CREATE
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const newProduct = await res.json();
          const formattedProduct = {
            ...newProduct,
            id: newProduct._id || newProduct.id,
          };
          setProducts([formattedProduct, ...products]);
          cancelEdit();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmDeleteId(null);
    }
  }

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case "available":
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Available
          </div>
        );
      case "coming_soon":
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            Coming Soon
          </div>
        );
      case "sold":
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Sold
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Product"
        message="Are you sure you want to delete this product? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex items-center gap-3">
          {fixedCategory && (
            <button
              onClick={() => router.push("/admin/products?type=marketplace")}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Back to categories"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {fixedCategory
                ? fixedCategory.name
                : productType === "gallery"
                  ? "Gallery Products"
                  : "Marketplace Products"}
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              {fixedCategory
                ? "Manage marketplace listings for this category"
                : productType === "gallery"
                  ? "Manage your gallery portfolio items"
                  : "Manage your marketplace inventory and pricing"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105"
        >
          <Plus size={18} /> Add Entry
        </button>
      </div>

      {isCreating && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) cancelEdit();
          }}
        >
          <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-white/10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {editingProduct ? (
                  <Edit2 size={20} className="text-pink-400" />
                ) : (
                  <Plus size={20} className="text-pink-400" />
                )}
                {editingProduct ? "Edit Product" : "Add New Entry"}
              </h2>
              <button
                type="button"
                onClick={cancelEdit}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-8 py-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-zinc-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Price ($)
                    </label>
                    <div className="relative">
                      <DollarSign
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-zinc-600"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Category
                    </label>
                    {fixedCategory ? (
                      <div className="flex items-center gap-3 bg-black/30 border border-white/10 rounded-xl px-4 py-3">
                        <Tag size={15} className="text-zinc-500 shrink-0" />
                        <span className="text-white font-medium">
                          {fixedCategory.name}
                        </span>
                      </div>
                    ) : (
                      <div className="relative">
                        <Tag
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                        />
                        <select
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all appearance-none cursor-pointer"
                          required
                        >
                          <option
                            value=""
                            className="bg-zinc-900 text-zinc-500"
                          >
                            Select a Category
                          </option>
                          {categories.map((cat) => (
                            <option
                              key={cat.id}
                              value={cat.id}
                              className="bg-zinc-900"
                            >
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as ProductStatus)
                      }
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="available" className="bg-zinc-900">
                        Available
                      </option>
                      <option value="coming_soon" className="bg-zinc-900">
                        Coming Soon
                      </option>
                      <option value="sold" className="bg-zinc-900">
                        Sold
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-zinc-600 h-32 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Images {editingProduct && "(Upload to add more)"}
                  </label>

                  {/* Existing images with remove buttons */}
                  {existingImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {existingImages.map((url, i) => (
                        <div key={i} className="relative group w-20 h-20">
                          <Image
                            src={url}
                            alt={`Image ${i + 1}`}
                            fill
                            className="object-cover rounded-lg border border-white/10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setExistingImages((imgs) =>
                                imgs.filter((_, idx) => idx !== i),
                              )
                            }
                            className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="relative group">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setImageFiles(e.target.files)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept="image/*"
                    />
                    <div className="w-full bg-black/50 border border-white/10 border-dashed rounded-xl px-4 py-8 flex flex-col items-center justify-center gap-2 group-hover:border-pink-500/50 transition-colors">
                      <Upload
                        size={24}
                        className="text-zinc-500 group-hover:text-pink-400 transition-colors"
                      />
                      <span className="text-zinc-500 text-sm group-hover:text-zinc-300">
                        {imageFiles && imageFiles.length > 0
                          ? `${imageFiles.length} files selected`
                          : "Drag images or click to upload"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex items-center gap-2 bg-linear-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ShoppingBag size={18} />
                    )}
                    {uploading
                      ? "Processing..."
                      : editingProduct
                        ? "Update Product"
                        : "Create Entry"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden shadow-xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead className="bg-white/5 text-zinc-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Image</th>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr
                key={product.id}
                className="group hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4">
                  {product.images?.[0] ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-600">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-white text-lg">
                    {product.title}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-400">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-medium">
                    <Tag size={12} />
                    {product.category?.name}
                  </span>
                </td>
                <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                <td className="px-6 py-4 font-mono text-white">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 max-sm:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(product)}
                      className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(product.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-zinc-500"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      <ShoppingBag size={32} className="opacity-50" />
                    </div>
                    <p>No products found. Create one above.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
