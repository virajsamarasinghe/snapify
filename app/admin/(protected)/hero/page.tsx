"use client";

import ConfirmDialog from "@/app/components/admin/ConfirmDialog";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import {
    Eye,
    EyeOff,
    Image as ImageIcon,
    Loader2,
    Trash2,
    UploadCloud,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LocalFile {
  filename: string;
  url: string;
  publicId: string;
  isHidden: boolean;
}

export default function ManageHero() {
  const [localFiles, setLocalFiles] = useState<LocalFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState<
    { name: string; status: "pending" | "done" | "error" }[]
  >([]);
  const [confirmDeleteFile, setConfirmDeleteFile] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const filesRes = await fetch("/api/hero/files");
      const filesData = await filesRes.json();

      if (!filesData.files) {
        setFetchError(filesData.error || "Failed to load images");
        return;
      }

      const mergedFiles = filesData.files.map(
        (f: {
          filename: string;
          url: string;
          publicId: string;
          isHidden: boolean;
        }) => ({
          filename: f.filename,
          url: f.url,
          publicId: f.publicId,
          isHidden: f.isHidden,
        }),
      );

      setLocalFiles(mergedFiles);
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
      setFetchError(error?.message || "Unexpected error loading images");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0)
      return alert("Please select at least one image");

    const fileArray = Array.from(files);
    setUploadProgress(
      fileArray.map((f) => ({ name: f.name, status: "pending" })),
    );
    setUploading(true);

    let anyError = false;
    for (let i = 0; i < fileArray.length; i++) {
      try {
        // Upload directly from browser → Cloudinary (bypasses Vercel body limit)
        const { url, publicId } = await uploadToCloudinary(
          fileArray[i],
          "snapify/hero",
        );

        // Persist URL to MongoDB
        const saveRes = await fetch("/api/hero/save-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, publicId }),
        });
        const saveResult = await saveRes.json();
        if (!saveResult.success) {
          throw new Error(saveResult.error || "Failed to save");
        }

        setUploadProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, status: "done" } : p)),
        );
      } catch (error: any) {
        anyError = true;
        setUploadProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, status: "error" } : p)),
        );
      }
    }

    setFiles(null);
    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";

    setUploading(false);
    if (anyError) alert("Some images failed to upload. Check the list above.");
    fetchData();
    setTimeout(() => setUploadProgress([]), 3000);
  };

  const handleDelete = async (publicId: string) => {
    try {
      const res = await fetch(
        `/api/hero/files/${encodeURIComponent(publicId)}`,
        { method: "DELETE" },
      );

      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting hero:", error);
    }
  };

  const toggleVisibility = async (
    url: string,
    currentHiddenStatus: boolean,
  ) => {
    try {
      // Optimistic update
      setLocalFiles((prev) =>
        prev.map((f) =>
          f.url === url ? { ...f, isHidden: !currentHiddenStatus } : f,
        ),
      );

      const res = await fetch("/api/hero/toggle-visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src: url, isHidden: !currentHiddenStatus }),
      });

      if (!res.ok) {
        // Revert on error
        setLocalFiles((prev) =>
          prev.map((f) =>
            f.url === url ? { ...f, isHidden: currentHiddenStatus } : f,
          ),
        );
        alert("Failed to update visibility");
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
      // Revert on error
      setLocalFiles((prev) =>
        prev.map((f) =>
          f.url === url ? { ...f, isHidden: currentHiddenStatus } : f,
        ),
      );
    }
  };

  return (
    <div className="space-y-8">
      <ConfirmDialog
        open={confirmDeleteFile !== null}
        title="Delete Hero Image"
        message={`Are you sure you want to delete "${confirmDeleteFile}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (confirmDeleteFile) {
            handleDelete(confirmDeleteFile);
            setConfirmDeleteFile(null);
          }
        }}
        onCancel={() => setConfirmDeleteFile(null)}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
          Manage Hero Images
        </h1>
      </div>

      {/* Upload Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <UploadCloud className="text-purple-400" />
          Upload New Image
        </h2>

        <form
          onSubmit={handleUploadFile}
          className="flex gap-4 items-end flex-wrap sm:flex-nowrap"
        >
          <div className="flex-1 w-full space-y-3">
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                setFiles(e.target.files);
                setUploadProgress([]);
              }}
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30"
              required
            />
            {files && files.length > 0 && (
              <p className="text-zinc-500 text-xs">
                {files.length} file{files.length > 1 ? "s" : ""} selected
              </p>
            )}
            {uploadProgress.length > 0 && (
              <ul className="space-y-1">
                {uploadProgress.map((p, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        p.status === "done"
                          ? "bg-green-400"
                          : p.status === "error"
                            ? "bg-red-400"
                            : "bg-zinc-500 animate-pulse"
                      }`}
                    />
                    <span className="text-zinc-400 truncate max-w-60">
                      {p.name}
                    </span>
                    <span
                      className={
                        p.status === "done"
                          ? "text-green-400"
                          : p.status === "error"
                            ? "text-red-400"
                            : "text-zinc-500"
                      }
                    >
                      {p.status === "done"
                        ? "Done"
                        : p.status === "error"
                          ? "Failed"
                          : "Uploading..."}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            disabled={uploading || !files || files.length === 0}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>
                  Uploading{" "}
                  {uploadProgress.filter((p) => p.status === "done").length}/
                  {uploadProgress.length}
                </span>
              </>
            ) : (
              "Upload"
            )}
          </button>
        </form>
      </div>

      {/* Grid Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <ImageIcon className="text-pink-400" />
          Active Hero Images
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-purple-500" size={32} />
          </div>
        ) : fetchError ? (
          <div className="text-center py-12 border border-dashed border-red-800 rounded-xl space-y-2">
            <p className="text-red-400 font-medium">Failed to load images</p>
            <p className="text-zinc-500 text-sm">{fetchError}</p>
            <p className="text-zinc-600 text-xs mt-2">
              Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and
              CLOUDINARY_API_SECRET are set in your Vercel environment
              variables.
            </p>
            <button
              onClick={fetchData}
              className="mt-4 text-sm text-purple-400 underline hover:text-purple-300"
            >
              Retry
            </button>
          </div>
        ) : localFiles.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
            No images found. Upload an image to display it in the hero section!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localFiles.map((file) => (
              <div
                key={file.filename}
                className={`group relative bg-black border rounded-xl overflow-hidden transition-all duration-300 ${
                  file.isHidden
                    ? "border-zinc-800 opacity-50"
                    : "border-purple-500/30 hover:border-purple-500/60"
                }`}
              >
                <div className="aspect-video relative">
                  <Image
                    src={file.url}
                    alt={file.filename}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {file.isHidden ? (
                      <span className="bg-zinc-800 text-zinc-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-zinc-700">
                        <EyeOff size={12} /> Hidden
                      </span>
                    ) : (
                      <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
                        <Eye size={12} /> Visible
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm font-mono truncate">
                      {file.filename}
                    </p>
                  </div>
                </div>

                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleVisibility(file.url, file.isHidden)}
                    className={`p-2 text-white rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium ${
                      file.isHidden
                        ? "bg-purple-500/90 hover:bg-purple-600"
                        : "bg-zinc-700/90 hover:bg-zinc-600"
                    }`}
                    title={file.isHidden ? "Show Image" : "Hide Image"}
                  >
                    {file.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>

                  <button
                    onClick={() => setConfirmDeleteFile(file.publicId)}
                    className="p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium"
                    title="Delete Image File"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
