"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  FolderOpen, 
  Trash2, 
  Edit2, 
  Plus, 
  Upload, 
  X, 
  Image as ImageIcon 
} from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Categories</h1>
           <p className="text-zinc-400 text-sm mt-1">Manage your artwork categories</p>
        </div>
        <button
          onClick={() => isCreating ? cancelEdit() : setIsCreating(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
            isCreating 
            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" 
            : "bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105"
          }`}
        >
          {isCreating ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Add Category</>}
        </button>
      </div>

      {isCreating && (
        <div className="bg-zinc-900/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            {editingCategory ? <Edit2 size={20} className="text-purple-400"/> : <Plus size={20} className="text-purple-400"/>}
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-zinc-600"
                placeholder="e.g. Landscapes"
                required
              />
            </div>
            
            <div>
               <label className="block text-sm font-medium text-zinc-400 mb-2">
                Cover Image {editingCategory && "(Leave empty to keep existing)"}
              </label>
              <div className="relative group">
                <input
                  type="file"
                  onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  accept="image/*"
                />
                <div className="w-full bg-black/50 border border-white/10 border-dashed rounded-xl px-4 py-8 flex flex-col items-center justify-center gap-2 group-hover:border-purple-500/50 transition-colors">
                   <Upload size={24} className="text-zinc-500 group-hover:text-purple-400 transition-colors" />
                   <span className="text-zinc-500 text-sm group-hover:text-zinc-300">
                     {imageFile ? imageFile.name : "Click to upload an image"}
                   </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                type="submit"
                disabled={uploading}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : <FolderOpen size={18} />}
                  {uploading ? "Processing..." : (editingCategory ? "Update Category" : "Create Category")}
                </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-zinc-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Image</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Products</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.map((cat) => (
              <tr key={cat.id} className="group hover:bg-white/5 transition-colors">
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
                    <span className="font-medium text-white text-lg">{cat.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-medium">
                     <FolderOpen size={12} /> {cat._count?.products || 0} items
                  </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEdit(cat)}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
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
                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
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
