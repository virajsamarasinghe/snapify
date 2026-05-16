"use client";

import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import {
    ArrowLeft,
    Calendar,
    Camera,
    Check,
    CheckSquare,
    Image as ImageIcon,
    Loader2,
    MapPin,
    Square,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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

export default function AlbumDetailView({
  album: initialAlbum,
  categoryId,
  categoryName,
}: {
  album: Album;
  categoryId: string;
  categoryName: string;
}) {
  const router = useRouter();
  const [album, setAlbum] = useState<Album>(initialAlbum);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<
    string | "selected" | null
  >(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSelection = (url: string) => {
    const next = new Set(selectedPhotos);
    if (next.has(url)) next.delete(url);
    else next.add(url);
    setSelectedPhotos(next);
  };

  const toggleSelectAll = () => {
    if (selectedPhotos.size === album.photos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(album.photos));
    }
  };

  async function handleUpload() {
    if (!photoFiles || photoFiles.length === 0) return;
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    const toSlug = (s: string) =>
      s
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    const folder = `snapify/categories/gallery/${toSlug(categoryName)}/${toSlug(album.name)}`;

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < photoFiles.length; i++) {
        const { url } = await uploadToCloudinary(photoFiles[i], folder);
        newUrls.push(url);
        setUploadProgress(Math.round(((i + 1) / photoFiles.length) * 100));
      }
      const updatedPhotos = [...album.photos, ...newUrls];
      const res = await fetch(`/api/albums/${album.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: updatedPhotos }),
      });
      if (res.ok) {
        setAlbum({ ...album, photos: updatedPhotos });
        setPhotoFiles(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setError("Failed to save photos.");
      }
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  async function handleDeletePhotos(urls: string[]) {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/albums/${album.id}/photos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: urls }),
      });
      if (res.ok) {
        const remaining = album.photos.filter((p) => !urls.includes(p));
        setAlbum({ ...album, photos: remaining });
        setSelectedPhotos(new Set());
        setSelectionMode(false);
      } else {
        setError("Failed to delete photos.");
      }
    } catch (err) {
      console.error(err);
      setError("Delete failed. Please try again.");
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const deleteCount =
    confirmDelete === "selected" ? selectedPhotos.size : confirmDelete ? 1 : 0;

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={confirmDelete !== null}
        title={
          confirmDelete === "selected"
            ? `Delete ${deleteCount} Photo${deleteCount > 1 ? "s" : ""}`
            : "Delete Photo"
        }
        message={
          confirmDelete === "selected"
            ? `Are you sure you want to permanently delete ${deleteCount} selected photo${deleteCount > 1 ? "s" : ""}? This cannot be undone.`
            : "Are you sure you want to permanently delete this photo? This cannot be undone."
        }
        confirmLabel="Delete"
        onConfirm={() => {
          if (confirmDelete === "selected") {
            handleDeletePhotos(Array.from(selectedPhotos));
          } else if (confirmDelete) {
            handleDeletePhotos([confirmDelete]);
          }
        }}
        onCancel={() => setConfirmDelete(null)}
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
      <div className="flex flex-wrap gap-3 justify-between items-start">
        <div className="flex items-start gap-3">
          <button
            onClick={() => router.push(`/admin/gallery/${categoryId}`)}
            className="p-2 mt-1 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Back to albums"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
              <button
                onClick={() => router.push(`/admin/gallery/${categoryId}`)}
                className="hover:text-zinc-300 transition-colors"
              >
                {categoryName}
              </button>
              <span>/</span>
              <span className="text-zinc-400">{album.name}</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {album.name}
            </h1>
            <div className="flex flex-wrap gap-3 mt-1.5">
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
        </div>

        {/* Action toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {selectionMode ? (
            <>
              <span className="text-sm text-zinc-400 mr-1">
                {selectedPhotos.size} selected
              </span>
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
              >
                {selectedPhotos.size === album.photos.length ? (
                  <CheckSquare size={14} />
                ) : (
                  <Square size={14} />
                )}
                {selectedPhotos.size === album.photos.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
              {selectedPhotos.size > 0 && (
                <button
                  onClick={() => setConfirmDelete("selected")}
                  disabled={deleting}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Delete ({selectedPhotos.size})
                </button>
              )}
              <button
                onClick={() => {
                  setSelectionMode(false);
                  setSelectedPhotos(new Set());
                }}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Cancel selection"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              {album.photos.length > 0 && (
                <button
                  onClick={() => setSelectionMode(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors"
                >
                  <CheckSquare size={14} />
                  Select
                </button>
              )}
              {/* File picker */}
              <div className="relative group">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setPhotoFiles(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={uploading}
                />
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 border-dashed transition-colors cursor-pointer">
                  <Upload size={14} />
                  {photoFiles && photoFiles.length > 0
                    ? `${photoFiles.length} file${photoFiles.length > 1 ? "s" : ""} selected`
                    : "Choose Photos"}
                </div>
              </div>
              {photoFiles && photoFiles.length > 0 && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      {uploadProgress > 0 ? `${uploadProgress}%` : "Uploading…"}
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      Upload
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload progress bar */}
      {uploading && uploadProgress > 0 && (
        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Photos grid */}
      {album.photos.length === 0 ? (
        <div className="bg-zinc-900/50 rounded-2xl border border-white/5 px-6 py-24 flex flex-col items-center gap-4 text-zinc-500">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <Camera size={32} className="opacity-50" />
          </div>
          <p className="text-sm">
            No photos yet. Use the &quot;Choose Photos&quot; button above to
            upload.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {album.photos.map((url, i) => {
            const isSelected = selectedPhotos.has(url);
            return (
              <div
                key={i}
                onClick={() => selectionMode && toggleSelection(url)}
                className={`relative aspect-square group rounded-xl overflow-hidden border transition-all duration-200 ${
                  selectionMode ? "cursor-pointer" : ""
                } ${
                  isSelected
                    ? "border-purple-500 ring-2 ring-purple-500/50 scale-[0.97]"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <Image
                  src={url}
                  alt={`Photo ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  className={`object-cover transition-transform duration-300 ${
                    selectionMode ? "" : "group-hover:scale-105"
                  }`}
                />

                {/* Selection checkbox */}
                {selectionMode && (
                  <div className="absolute top-2 left-2 z-20">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shadow-md ${
                        isSelected
                          ? "bg-purple-500 border-purple-500"
                          : "bg-black/50 border-white/60"
                      }`}
                    >
                      {isSelected && <Check size={11} className="text-white" />}
                    </div>
                  </div>
                )}

                {/* Selection overlay tint */}
                {selectionMode && isSelected && (
                  <div className="absolute inset-0 bg-purple-500/20 pointer-events-none" />
                )}

                {/* Hover delete button (non-selection mode only) */}
                {!selectionMode && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(url);
                      }}
                      className="p-2 bg-red-600/90 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
                      title="Delete photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}

                {/* Photo index badge */}
                <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white/70 text-[10px] px-1.5 py-0.5 rounded-md pointer-events-none">
                  {i + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
