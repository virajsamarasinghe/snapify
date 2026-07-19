"use client";

import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import {
    ArrowLeft,
    Calendar,
    Camera,
    Check,
    Edit2,
    Image as ImageIcon,
    MapPin,
    Plus,
    Sparkles,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

type Album = {
  id: string;
  name: string;
  description: string;
  conductDate: string | null;
  location: string;
  coverPhoto: string;
  photos: string[];
};

// Keep in sync with MAX_PREVIEW_IMAGES in app/components/GalleryShowcaseNew.tsx —
// the homepage card only ever crossfades this many images anyway.
const MAX_FEATURED_IMAGES = 5;

export default function AlbumManagement({
  initialAlbums,
  categoryId,
  categoryName,
  allPhotos = [],
  initialFeaturedImages = [],
}: {
  initialAlbums: Album[];
  categoryId: string;
  categoryName: string;
  allPhotos?: string[];
  initialFeaturedImages?: string[];
}) {
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Featured (homepage preview) image selection
  const [featuredImages, setFeaturedImages] = useState<Set<string>>(
    () => new Set(initialFeaturedImages),
  );
  const [savingFeatured, setSavingFeatured] = useState(false);
  const [featuredSaved, setFeaturedSaved] = useState(false);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  const toggleFeatured = (url: string) => {
    setFeaturedSaved(false);
    setFeaturedImages((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        if (next.size >= MAX_FEATURED_IMAGES) {
          setFeaturedError(
            `You can feature up to ${MAX_FEATURED_IMAGES} images on the homepage card.`,
          );
          return prev;
        }
        next.add(url);
      }
      setFeaturedError(null);
      return next;
    });
  };

  async function saveFeaturedImages() {
    setSavingFeatured(true);
    setFeaturedError(null);
    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredImages: Array.from(featuredImages) }),
      });
      if (res.ok) {
        setFeaturedSaved(true);
      } else {
        const d = await res.json().catch(() => ({}));
        setFeaturedError(d.error || "Failed to save featured images.");
      }
    } catch (err) {
      console.error(err);
      setFeaturedError("An unexpected error occurred.");
    } finally {
      setSavingFeatured(false);
    }
  }

  // Album form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [conductDate, setConductDate] = useState("");
  const [location, setLocation] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const openCreate = () => {
    setEditingAlbum(null);
    setName("");
    setDescription("");
    setConductDate("");
    setLocation("");
    setCoverFile(null);
    setCoverPreview(null);
    setError(null);
    setIsModalOpen(true);
  };

  const openEdit = (album: Album) => {
    setEditingAlbum(album);
    setName(album.name);
    setDescription(album.description || "");
    setConductDate(album.conductDate ? album.conductDate.substring(0, 10) : "");
    setLocation(album.location || "");
    setCoverFile(null);
    setCoverPreview(null);
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAlbum(null);
    setError(null);
  };

  const handleCoverChange = (file: File | null) => {
    setCoverFile(file);
    if (file) setCoverPreview(URL.createObjectURL(file));
    else setCoverPreview(null);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);
    setError(null);

    // Derive slugs for folder naming
    const toSlug = (s: string) =>
      s
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    const catSlug = toSlug(categoryName);
    const albumSlug = toSlug(name);
    const albumFolder = `snapify/categories/gallery/${catSlug}/${albumSlug}`;

    try {
      let coverPhoto = editingAlbum?.coverPhoto || "";
      if (coverFile) {
        const { url } = await uploadToCloudinary(coverFile, albumFolder);
        coverPhoto = url;
      }

      const payload = {
        name,
        description,
        conductDate: conductDate || null,
        location,
        coverPhoto,
        category: categoryId,
      };

      if (editingAlbum) {
        const res = await fetch(`/api/albums/${editingAlbum.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          const id = updated._id || updated.id;
          setAlbums(
            albums.map((a) =>
              a.id === editingAlbum.id ? { ...a, ...updated, id } : a,
            ),
          );
          closeModal();
        } else {
          const d = await res.json().catch(() => ({}));
          setError(d.error || "Failed to update album.");
        }
      } else {
        const res = await fetch("/api/albums", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setAlbums([
            { ...created, id: created._id || created.id, photos: [] },
            ...albums,
          ]);
          closeModal();
        } else {
          const d = await res.json().catch(() => ({}));
          setError(d.error || "Failed to create album.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteAlbum(id: string) {
    const res = await fetch(`/api/albums/${id}`, { method: "DELETE" });
    if (res.ok) setAlbums(albums.filter((a) => a.id !== id));
    else setError("Failed to delete album.");
    setConfirmDeleteId(null);
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Album"
        message="Are you sure you want to delete this album and all its photos? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => confirmDeleteId && handleDeleteAlbum(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />

      {/* Error banner */}
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

      {/* Page header */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/products?type=gallery")}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Back to categories"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
              {categoryName}
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Manage albums &amp; photos
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300"
        >
          <Plus size={18} /> New Album
        </button>
      </div>

      {/* Featured homepage images picker */}
      {allPhotos.length > 0 && (
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Sparkles size={18} className="text-purple-400 mt-0.5 shrink-0" />
              <div>
                <h2 className="text-white font-semibold">
                  Featured Homepage Images
                </h2>
                <p className="text-zinc-500 text-sm mt-0.5">
                  Pick up to {MAX_FEATURED_IMAGES} photos to show on this
                  category&apos;s homepage card. Leave empty to let the site
                  auto-pick a preview.{" "}
                  <span className="text-zinc-400">
                    {featuredImages.size}/{MAX_FEATURED_IMAGES} selected
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={saveFeaturedImages}
              disabled={savingFeatured}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-purple-600 text-white hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {savingFeatured ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check size={16} />
              )}
              {savingFeatured
                ? "Saving…"
                : featuredSaved
                  ? "Saved"
                  : "Save Selection"}
            </button>
          </div>

          {featuredError && (
            <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
              <X size={14} />
              {featuredError}
            </div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-96 overflow-y-auto pr-1">
            {allPhotos.map((url) => {
              const isSelected = featuredImages.has(url);
              return (
                <button
                  key={url}
                  type="button"
                  onClick={() => toggleFeatured(url)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    isSelected
                      ? "border-purple-500"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <Image
                    src={url}
                    alt="Category photo"
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                  <div
                    className={`absolute inset-0 transition-colors ${
                      isSelected ? "bg-black/30" : "bg-black/0 hover:bg-black/20"
                    }`}
                  />
                  <div
                    className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected
                        ? "bg-purple-500 border-purple-500"
                        : "bg-black/40 border-white/40"
                    }`}
                  >
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Albums list */}
      {albums.length === 0 ? (
        <div className="bg-zinc-900/50 rounded-2xl border border-white/5 px-6 py-20 flex flex-col items-center gap-4 text-zinc-500">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <Camera size={32} className="opacity-50" />
          </div>
          <p>No albums yet. Create your first album above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden"
            >
              {/* Album row */}
              <div className="flex items-center gap-4 p-4">
                {/* Cover thumbnail — click to open album detail */}
                <button
                  onClick={() =>
                    router.push(`/admin/gallery/${categoryId}/${album.id}`)
                  }
                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-colors shrink-0 group/thumb"
                  title="Open album"
                >
                  {album.coverPhoto ? (
                    <Image
                      src={album.coverPhoto}
                      alt={album.name}
                      fill
                      className="object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                      <Camera size={24} className="text-zinc-600" />
                    </div>
                  )}
                </button>

                {/* Album info */}
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() =>
                      router.push(`/admin/gallery/${categoryId}/${album.id}`)
                    }
                    className="text-left"
                  >
                    <h3 className="text-white font-semibold text-lg leading-tight truncate hover:text-purple-300 transition-colors">
                      {album.name}
                    </h3>
                  </button>
                  {album.description && (
                    <p className="text-zinc-500 text-sm mt-0.5 line-clamp-1">
                      {album.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-2">
                    {album.conductDate && (
                      <span className="flex items-center gap-1 text-xs text-zinc-400">
                        <Calendar size={11} />
                        {formatDate(album.conductDate)}
                      </span>
                    )}
                    {album.location && (
                      <span className="flex items-center gap-1 text-xs text-zinc-400">
                        <MapPin size={11} />
                        {album.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                      <ImageIcon size={11} />
                      {album.photos.length} photo
                      {album.photos.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(album)}
                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                    title="Edit album"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(album.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete album"
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/admin/gallery/${categoryId}/${album.id}`)
                    }
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors text-sm font-medium"
                  >
                    <ImageIcon size={14} />
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Album create / edit modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-white/10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {editingAlbum ? (
                  <Edit2 size={20} className="text-purple-400" />
                ) : (
                  <Plus size={20} className="text-purple-400" />
                )}
                {editingAlbum ? "Edit Album" : "New Album"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 py-6">
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
                  <X size={14} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Album Name */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 mb-2">
                    Album Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-zinc-600"
                    placeholder="e.g. Summer Wedding 2024"
                    required
                  />
                </div>

                {/* Shoot Date + Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 mb-2">
                      <Calendar size={13} /> Shoot Date
                    </label>
                    <input
                      type="date"
                      value={conductDate}
                      onChange={(e) => setConductDate(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all scheme-dark"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 mb-2">
                      <MapPin size={13} /> Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-zinc-600"
                      placeholder="e.g. Colombo, Sri Lanka"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-zinc-600 resize-none"
                    placeholder="Brief description of this shoot…"
                  />
                </div>

                {/* Cover Photo */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 mb-2">
                    Cover Photo
                  </label>
                  {(coverPreview ||
                    (editingAlbum?.coverPhoto && !coverPreview)) && (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10 mb-3">
                      <Image
                        src={coverPreview ?? editingAlbum!.coverPhoto}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleCoverChange(e.target.files?.[0] ?? null)
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full bg-black/50 border border-white/10 border-dashed rounded-xl px-4 py-5 flex flex-col items-center gap-2 group-hover:border-purple-500/50 transition-colors">
                      <Upload
                        size={20}
                        className="text-zinc-500 group-hover:text-purple-400 transition-colors"
                      />
                      <span className="text-zinc-500 text-sm group-hover:text-zinc-300">
                        {coverFile
                          ? coverFile.name
                          : editingAlbum?.coverPhoto
                            ? "Click to replace cover"
                            : "Click to upload cover photo"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit / Cancel */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Camera size={18} />
                    )}
                    {uploading
                      ? "Saving…"
                      : editingAlbum
                        ? "Update Album"
                        : "Create Album"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 rounded-xl font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
