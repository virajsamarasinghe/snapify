"use client";

import { useState } from "react";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
  image: string | null;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Initialize Edit Mode
  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setIsCreating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setName("");
    setImageFile(null);
    setIsCreating(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;

    setUploading(true);
    let imageUrl = editingCategory?.image || "";

    try {
      // 1. Upload Image if exists
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) imageUrl = data.url;
      }

      const payload = { name, image: imageUrl };

      if (editingCategory) {
        // UPDATE
         const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const updatedCategory = await res.json();
          setCategories(categories.map(cat => cat.id === updatedCategory._id ? { ...cat, ...updatedCategory, id: updatedCategory._id } : cat));
          cancelEdit();
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
          // Map _id to id for consistency if backend returns _id
          const formattedCat = { ...newCategory, id: newCategory._id || newCategory.id };
          setCategories([formattedCat, ...categories]);
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
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories(categories.filter((cat) => cat.id !== id));
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Category Management</h1>
        <button
          onClick={() => isCreating ? cancelEdit() : setIsCreating(true)}
          className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          {isCreating ? "Cancel" : "+ Add Category"}
        </button>
      </div>

      {isCreating && (
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mb-8">
          <h2 className="text-xl font-bold mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white"
                placeholder="e.g. Landscapes"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Cover Image {editingCategory && "(Leave empty to keep existing)"}
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setImageFile(e.target.files ? e.target.files[0] : null)
                }
                className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                accept="image/*"
              />
            </div>
            <div className="flex gap-4">
                <button
                type="submit"
                disabled={uploading}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
                >
                {uploading ? (editingCategory ? "Updating..." : "Creating...") : (editingCategory ? "Update Category" : "Create Category")}
                </button>
                {editingCategory && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="bg-zinc-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-zinc-700"
                    >
                        Cancel
                    </button>
                )}
            </div>
          </form>
        </div>
      )}

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-800/50 text-zinc-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Products</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-zinc-800/30">
                <td className="px-6 py-4">
                  {cat.image ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-600">
                      📷
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-white">{cat.name}</td>
                <td className="px-6 py-4 text-zinc-400">
                  {cat._count?.products || 0} items
                </td>
                <td className="px-6 py-4 flex gap-4">
                  <button 
                    onClick={() => startEdit(cat)}
                    className="text-sm text-blue-500 hover:text-blue-400"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="text-sm text-red-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                  No categories found. Create one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
