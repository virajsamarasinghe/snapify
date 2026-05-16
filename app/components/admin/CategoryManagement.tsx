"use client";

import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import {
    Edit2,
    FolderOpen,
    Image as ImageIcon,
    Plus,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

type Category = {
  id: string;
  name: string;
  image: string | null;
  showInMarketplace: boolean;
  showInGallery: boolean;
  _count?: { products: number };
};

export default function CategoryManagement({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isCreating, setIsCreating] = useState(false);

  // Edit State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [showInMarketplace, setShowInMarketplace] = useState(false);
  const [showInGallery, setShowInGallery] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Initialize Edit Mode
  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setShowInMarketplace(category.showInMarketplace);
    setShowInGallery(category.showInGallery ?? true);
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
    setIsCreating(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setName("");
    setShowInMarketplace(false);
    setShowInGallery(true);
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
    setIsCreating(false);
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setRemoveImage(false);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;

    setUploading(true);
    setError(null);
    let imageUrl = removeImage ? "" : editingCategory?.image || "";

    // Build slug the same way the server does
    const slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    try {
      // 1. Upload Image if exists
      if (imageFile) {
        // Upload directly from browser → Cloudinary (bypasses Vercel body limit)
        const { url } = await uploadToCloudinary(
          imageFile,
          "snapify/categories",
        );
        imageUrl = url;
      }

      const payload = {
        name,
        image: imageUrl,
        showInMarketplace,
        showInGallery,
      };

      if (editingCategory) {
        // UPDATE
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const updatedCategory = await res.json();
          const id = updatedCategory._id || updatedCategory.id;
          setCategories(
            categories.map((cat) =>
              cat.id === id ? { ...cat, ...updatedCategory, id } : cat,
            ),
          );
          cancelEdit();
        } else {
          const data = await res.json().catch(() => ({}));
          setError(
            data.error || "Failed to update category. Please try again.",
          );
        }
      } else {
        // CREATE
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const newCategory = await res.json();
          const formattedCat = {
            ...newCategory,
            id: newCategory._id || newCategory.id,
          };
          setCategories([formattedCat, ...categories]);
          cancelEdit();
        } else {
          const data = await res.json().catch(() => ({}));
          setError(
            data.error || "Failed to create category. Please try again.",
          );
        }
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories(categories.filter((cat) => cat.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete category. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setConfirmDeleteId(null);
    }
  }

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Category"
        message="Are you sure you want to delete this category? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />

      {/* Global error banner */}
      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
          <X size={16} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="shrink-0 hover:text-red-300 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
            Categories
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage your artwork categories
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {isCreating && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) cancelEdit();
          }}
        >
          <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-white/10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {editingCategory ? (
                  <Edit2 size={20} className="text-purple-400" />
                ) : (
                  <Plus size={20} className="text-purple-400" />
                )}
                {editingCategory ? "Edit Category" : "Add New Category"}
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
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-zinc-600"
                    placeholder="e.g. Landscapes"
                    required
                  />
                </div>

                {/* Gallery toggle */}
                <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded-xl px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Show in Gallery
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Display this category in the home page gallery section.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInGallery((v) => !v)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                      showInGallery ? "bg-blue-600" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        showInGallery ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Marketplace toggle */}
                <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded-xl px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Show in Marketplace
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Enable to also list this category in the Marketplace.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInMarketplace((v) => !v)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                      showInMarketplace ? "bg-purple-600" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        showInMarketplace ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Cover Image
                  </label>

                  {/* Preview: newly selected file OR existing saved image (edit mode) */}
                  {(imagePreview ||
                    (editingCategory?.image &&
                      !removeImage &&
                      !imagePreview)) && (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10 mb-3 group/preview">
                      <Image
                        src={imagePreview ?? editingCategory!.image!}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="flex items-center gap-1.5 bg-red-600/90 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} /> Remove Image
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Warning shown when user clicked Remove */}
                  {removeImage && (
                    <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2 mb-3">
                      <X size={14} />
                      Image will be removed on save.
                      <button
                        type="button"
                        onClick={() => setRemoveImage(false)}
                        className="ml-auto underline hover:no-underline"
                      >
                        Undo
                      </button>
                    </div>
                  )}

                  <div className="relative group">
                    <input
                      type="file"
                      onChange={(e) =>
                        handleImageChange(
                          e.target.files ? e.target.files[0] : null,
                        )
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept="image/*"
                    />
                    <div className="w-full bg-black/50 border border-white/10 border-dashed rounded-xl px-4 py-6 flex flex-col items-center justify-center gap-2 group-hover:border-purple-500/50 transition-colors">
                      <Upload
                        size={24}
                        className="text-zinc-500 group-hover:text-purple-400 transition-colors"
                      />
                      <span className="text-zinc-500 text-sm group-hover:text-zinc-300">
                        {imageFile
                          ? imageFile.name
                          : editingCategory?.image && !removeImage
                            ? "Click to replace image"
                            : "Click to upload an image"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FolderOpen size={18} />
                    )}
                    {uploading
                      ? "Processing..."
                      : editingCategory
                        ? "Update Category"
                        : "Create Category"}
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
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead className="bg-white/5 text-zinc-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Image</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Visibility</th>
              <th className="px-6 py-4 font-semibold">Products</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="group hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4">
                  {cat.image ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors">
                      <Image
                        src={cat.image}
                        alt={cat.name}
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
                    {cat.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    {(cat.showInGallery ?? true) && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium w-fit">
                        Gallery
                      </span>
                    )}
                    {cat.showInMarketplace && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium w-fit">
                        Marketplace
                      </span>
                    )}
                    {!(cat.showInGallery ?? true) && !cat.showInMarketplace && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-700/50 border border-zinc-600/20 text-zinc-500 text-xs font-medium w-fit">
                        Hidden
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-medium">
                    <FolderOpen size={12} /> {cat._count?.products || 0} items
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 sm:opacity-0 max-sm:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(cat.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-zinc-500"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      <FolderOpen size={32} className="opacity-50" />
                    </div>
                    <p>No categories found. Create one above.</p>
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
