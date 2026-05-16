"use client";

import ConfirmDialog from "@/app/components/admin/ConfirmDialog";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import {
    AlertCircle,
    CheckCircle2,
    ImagePlus,
    Loader2,
    Save,
    Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Msg = { type: "success" | "error"; text: string } | null;

interface AboutForm {
  tagline: string;
  heading: string;
  headingItalic: string;
  bio: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  photos: string[];
}

const DEFAULTS: AboutForm = {
  tagline: "// THE ARCHITECT OF LIGHT",
  heading: "Beyond the",
  headingItalic: "Frame",
  bio: "My work is an exploration of the human condition. I don't just capture moments; I deconstruct them to reveal the raw emotion hidden beneath. A visual symphony where every shadow tells a story and every highlight sings.",
  stat1Value: "12",
  stat1Label: "Years Experience",
  stat2Value: "50+",
  stat2Label: "Global Exhibitions",
  photos: [],
};

export default function AboutAdminPage() {
  const [form, setForm] = useState<AboutForm>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedFormRef = useRef<AboutForm | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState<{ href: string } | null>(
    null,
  );
  const router = useRouter();

  // Track dirty state whenever form changes
  useEffect(() => {
    if (savedFormRef.current !== null) {
      setIsDirty(JSON.stringify(form) !== JSON.stringify(savedFormRef.current));
    }
  }, [form]);

  // Warn on browser close / refresh
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Intercept in-app navigation link clicks
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!isDirty) return;
      const anchor = (e.target as HTMLElement).closest(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === window.location.pathname || href.startsWith("#"))
        return;
      e.preventDefault();
      e.stopPropagation();
      setLeaveConfirm({ href });
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [isDirty]);

  useEffect(() => {
    Promise.all([
      fetch("/api/about", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/about/photos", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([d, cloudinaryPhotos]) => {
        const storedPhotos: string[] = Array.isArray(d.photos) ? d.photos : [];
        // If stored photos are local paths (not Cloudinary URLs) or empty, use Cloudinary list
        const hasLocalPaths = storedPhotos.some((p) => !p.startsWith("http"));
        const photos =
          hasLocalPaths || storedPhotos.length === 0
            ? Array.isArray(cloudinaryPhotos) && cloudinaryPhotos.length > 0
              ? cloudinaryPhotos
              : []
            : storedPhotos;

        const loaded: AboutForm = {
          tagline: d.tagline ?? DEFAULTS.tagline,
          heading: d.heading ?? DEFAULTS.heading,
          headingItalic: d.headingItalic ?? DEFAULTS.headingItalic,
          bio: d.bio ?? DEFAULTS.bio,
          stat1Value: d.stat1Value ?? DEFAULTS.stat1Value,
          stat1Label: d.stat1Label ?? DEFAULTS.stat1Label,
          stat2Value: d.stat2Value ?? DEFAULTS.stat2Value,
          stat2Label: d.stat2Label ?? DEFAULTS.stat2Label,
          photos,
        };
        savedFormRef.current = loaded;
        setForm(loaded);
        setIsDirty(false);
      })
      .catch((err) => {
        console.error("Failed to load about settings:", err);
        setMsg({
          type: "error",
          text: "Failed to load settings. Showing defaults.",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        savedFormRef.current = { ...form };
        setIsDirty(false);
        setMsg({
          type: "success",
          text: "About section updated successfully.",
        });
      } else {
        const d = await res.json();
        setMsg({ type: "error", text: d.error ?? "Failed to save." });
      }
    } catch {
      setMsg({ type: "error", text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(file: File) {
    setUploading(true);
    try {
      // Upload directly from browser → Cloudinary (bypasses Vercel body limit)
      const { url, publicId } = await uploadToCloudinary(file, "snapify/about");

      // Persist URL to MongoDB
      const res = await fetch("/api/about/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, publicId }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm((f) => ({ ...f, photos: [...f.photos, data.url] }));
      } else {
        setMsg({ type: "error", text: data.error ?? "Upload failed" });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message ?? "Upload failed" });
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(index: number) {
    const photoUrl = form.photos[index];
    setForm((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== index) }));

    // Delete from Cloudinary if it's a Cloudinary URL
    if (photoUrl && photoUrl.includes("res.cloudinary.com")) {
      const match = photoUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
      const publicId = match ? match[1] : null;
      if (publicId && publicId.startsWith("snapify/about/")) {
        fetch("/api/about/photos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        }).catch(console.error);
      }
    }
  }

  function field(
    label: string,
    key: keyof AboutForm,
    placeholder?: string,
    textarea?: boolean,
  ) {
    return (
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
          {label}
        </label>
        {textarea ? (
          <textarea
            value={form[key] as string}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            placeholder={placeholder}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all resize-none"
          />
        ) : (
          <input
            type="text"
            value={form[key] as string}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
          />
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
              About Section
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Edit your bio, stats and photos
            </p>
          </div>
          {isDirty && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              Unsaved changes
            </span>
          )}
        </div>

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* LEFT: Content + Stats */}
            <div className="space-y-5">
              {/* Text content */}
              <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="px-5 py-3 border-b border-white/10">
                  <p className="text-white font-semibold text-sm">Content</p>
                </div>
                <div className="p-5 space-y-4">
                  {field(
                    "Tagline (small top text)",
                    "tagline",
                    "// THE ARCHITECT OF LIGHT",
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {field("Heading", "heading", "Beyond the")}
                    {field("Heading italic part", "headingItalic", "Frame")}
                  </div>
                  {field("Bio paragraph", "bio", "Your story...", true)}
                </div>
              </div>

              {/* Stats */}
              <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="px-5 py-3 border-b border-white/10">
                  <p className="text-white font-semibold text-sm">Stats</p>
                </div>
                <div className="p-5 grid grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                      Stat 1
                    </p>
                    {field("Value", "stat1Value", "12")}
                    {field("Label", "stat1Label", "Years Experience")}
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                      Stat 2
                    </p>
                    {field("Value", "stat2Value", "50+")}
                    {field("Label", "stat2Label", "Global Exhibitions")}
                  </div>
                </div>
              </div>

              {/* Feedback + Save */}
              {msg && (
                <div
                  className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm ${msg.type === "success" ? "bg-green-500/10 border border-green-500/25 text-green-300" : "bg-red-500/10 border border-red-500/25 text-red-300"}`}
                >
                  {msg.type === "success" ? (
                    <CheckCircle2
                      size={17}
                      className="shrink-0 mt-0.5 text-green-400"
                    />
                  ) : (
                    <AlertCircle
                      size={17}
                      className="shrink-0 mt-0.5 text-red-400"
                    />
                  )}
                  <p>{msg.text}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/20"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>

            {/* RIGHT: Photos */}
            <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between gap-4">
                <p className="text-white font-semibold text-sm">
                  Carousel Photos
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold transition-all"
                >
                  {uploading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ImagePlus size={14} />
                  )}
                  {uploading ? "Uploading…" : "Upload Photo"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoUpload(file);
                    e.target.value = "";
                  }}
                />
              </div>
              <div className="p-5">
                {form.photos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-600 gap-3">
                    <ImagePlus size={32} className="opacity-40" />
                    <p className="text-sm">No photos added yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {form.photos.map((src, i) => (
                      <div
                        key={i}
                        className="relative group aspect-square rounded-xl overflow-hidden border border-white/10"
                      >
                        <img
                          src={src}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <span className="absolute bottom-2 left-2 text-xs bg-black/60 px-2 py-0.5 rounded text-white/70">
                          #{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-zinc-600 mt-3">
                  Photos are shown in a carousel. Drag order follows the list
                  above.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Leave-without-saving confirmation */}
      <ConfirmDialog
        open={!!leaveConfirm}
        title="Unsaved Changes"
        message="You have unsaved changes. If you leave now your changes will be lost."
        confirmLabel="Discard & Leave"
        onConfirm={() => {
          setIsDirty(false);
          const href = leaveConfirm!.href;
          setLeaveConfirm(null);
          router.push(href);
        }}
        onCancel={() => setLeaveConfirm(null)}
      />
    </div>
  );
}
