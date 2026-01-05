"use client";

import { useState } from "react";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
};

type ProductStatus = 'available' | 'coming_soon' | 'sold';

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: ProductStatus;
  category: Category;
};

export default function ProductManagement({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<ProductStatus>("available");
  const [categoryId, setCategoryId] = useState("");
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const startEdit = (product: Product) => {
      setEditingProduct(product);
      setTitle(product.title);
      setDescription(product.description || "");
      setPrice(product.price.toString());
      setCategoryId(product.category?.id || "");
      setStatus(product.status || "available");
      setIsCreating(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
      setEditingProduct(null);
      setTitle("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setStatus("available");
      setImageFiles(null);
      setIsCreating(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !price || !categoryId || !description) return;

    setUploading(true);
    let uploadedImages: string[] = editingProduct?.images || [];

    try {
      // 1. Upload Images
      if (imageFiles && imageFiles.length > 0) {
        const newImages: string[] = [];
        for (let i = 0; i < imageFiles.length; i++) {
          const formData = new FormData();
          formData.append("file", imageFiles[i]);
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.url) newImages.push(data.url);
        }
        // If editing, append? Or replace? 
        // For simplicity, if new images are uploaded, we append them.
        uploadedImages = [...uploadedImages, ...newImages];
      }

      const payload = {
          title,
          description,
          price: parseFloat(price),
          categoryId,
          status,
          images: uploadedImages,
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
             // Manually populate category name for UI update if separate lookup needed, 
             // but backend populate should handle it if route returns populated doc
             // Ensure backend PUT returns populated doc
             
             // Temporary fix: preserve category object if ID matches, else find from props
             const catObj = categories.find(c => c.id === categoryId) || updatedProduct.category;

            setProducts(products.map(p => p.id === updatedProduct._id ? { ...p, ...updatedProduct, id: updatedProduct._id, category: catObj } : p));
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
            const formattedProduct = { ...newProduct, id: newProduct._id || newProduct.id };
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
    if (!confirm("Are you sure you want to delete this product?")) return;

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
    }
  }

  const getStatusBadge = (status: ProductStatus) => {
      switch(status) {
          case 'available': return <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs border border-green-800">Available</span>;
          case 'coming_soon': return <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 rounded text-xs border border-yellow-800">Coming Soon</span>;
          case 'sold': return <span className="px-2 py-1 bg-red-900/50 text-red-400 rounded text-xs border border-red-800">Sold</span>;
          default: return null;
      }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button
          onClick={() => isCreating ? cancelEdit() : setIsCreating(true)}
          className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          {isCreating ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {isCreating && (
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mb-8">
          <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm text-zinc-400 mb-1">Category</label>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white"
                    required
                >
                    <option value="">Select a Category</option>
                    {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                    ))}
                </select>
                </div>
                <div>
                <label className="block text-sm text-zinc-400 mb-1">Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProductStatus)}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white"
                    required
                >
                    <option value="available">Available</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="sold">Sold</option>
                </select>
                </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white h-24"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Images {editingProduct && "(Upload to add more)"}</label>
              <input
                type="file"
                multiple
                onChange={(e) => setImageFiles(e.target.files)}
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
                {uploading ? (editingProduct ? "Updating..." : "Creating...") : (editingProduct ? "Update Product" : "Create Product")}
                </button>
                 {editingProduct && (
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
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-zinc-800/30">
                <td className="px-6 py-4">
                  {product.images?.[0] ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-600">
                      🛍️
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-white">{product.title}</td>
                <td className="px-6 py-4 text-zinc-400">
                  <span className="bg-zinc-800 px-2 py-1 rounded text-xs">
                    {product.category?.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                   {getStatusBadge(product.status)}
                </td>
                <td className="px-6 py-4 text-white">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 flex gap-4">
                   <button 
                    onClick={() => startEdit(product)}
                    className="text-sm text-blue-500 hover:text-blue-400"
                  >
                    Edit
                  </button>
                  <button 
                     onClick={() => handleDelete(product.id)}
                     className="text-sm text-red-500 hover:text-red-400">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                  No products found. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
