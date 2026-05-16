"use client";

import ConfirmDialog from "@/app/components/admin/ConfirmDialog";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { Reorder, useDragControls } from "framer-motion";
import {
    AlertCircle,
    Award,
    CheckCircle2,
    Edit2,
    GripVertical,
    ImagePlus,
    Loader2,
    Plus,
    Trash2,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface RecognitionItem {
  _id: string;
  year: string;
  title: string;
  venue: string;
  description: string;
  type: "award" | "exhibition" | "feature";
  image: string;
  order: number;
}

const DEFAULT_TYPES = ["award", "exhibition", "feature"];

const TYPE_COLORS: Record<string, string> = {
  award: "text-yellow-400 bg-yellow-500/15 border-yellow-500/30",
  exhibition: "text-purple-400 bg-purple-500/15 border-purple-500/30",
  feature: "text-blue-400 bg-blue-500/15 border-blue-500/30",
};

function typeColor(type: string) {
  return TYPE_COLORS[type] ?? "text-zinc-300 bg-white/10 border-white/20";
}

const EMPTY_FORM = {
  year: "",
  title: "",
  venue: "",
  description: "",
  type: "award",
  image: "",
};

type Msg = { type: "success" | "error"; text: string } | null;

// ─── Draggable card ───────────────────────────────────────────────────────────
function RecognitionCard({
  item,
  onEdit,
  onDelete,
  isDeleting,
  onDragEnd,
}: {
  item: RecognitionItem;
  onEdit: (item: RecognitionItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onDragEnd: () => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors group select-none"
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 8px 32px rgba(168,85,247,0.25)",
        borderColor: "rgba(168,85,247,0.5)",
        zIndex: 50,
      }}
    >
      {/* Drag handle */}
      <div
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab active:cursor-grabbing p-1 mt-1 shrink-0 text-zinc-600 hover:text-purple-400 transition-colors touch-none"
        title="Drag to reorder"
      >
        <GripVertical size={18} />
      </div>

      {/* Image */}
      {item.image && item.image.startsWith("http") && (
        <img
          src={item.image}
          alt={item.title}
          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
        />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${typeColor(item.type)}`}
          >
            {item.type}
          </span>
          <span className="text-zinc-500 text-xs">{item.year}</span>
        </div>
        <h3 className="text-white font-semibold text-sm mb-0.5 truncate">
          {item.title}
        </h3>
        <p className="text-zinc-400 text-xs mb-1">{item.venue}</p>
        <p className="text-zinc-500 text-xs line-clamp-2">{item.description}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(item)}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <Edit2 size={15} />
        </button>
        <button
          onClick={() => onDelete(item._id)}
          disabled={isDeleting}
          className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          {isDeleting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Trash2 size={15} />
          )}
        </button>
      </div>
    </Reorder.Item>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function RecognitionAdminPage() {
  const [items, setItems] = useState<RecognitionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const pendingOrderRef = useRef<RecognitionItem[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [msg, setMsg] = useState<Msg>(null);
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [addingType, setAddingType] = useState(false);
  const [newTypeInput, setNewTypeInput] = useState("");
  const newTypeRef = useRef<HTMLInputElement>(null);

  // photo state
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allTypes = [...DEFAULT_TYPES, ...customTypes];

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/recognition");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch recognition items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    setPhotosLoading(true);
    try {
      const res = await fetch("/api/recognition/photos");
      const data = await res.json();
      setExistingPhotos(Array.isArray(data) ? data : []);
    } catch {
      setExistingPhotos([]);
    } finally {
      setPhotosLoading(false);
    }
  }

  async function handlePhotoUpload(file: File) {
    setUploading(true);
    try {
      // Upload directly from browser → Cloudinary (bypasses Vercel body limit)
      const { url, publicId } = await uploadToCloudinary(
        file,
        "snapify/recognition",
      );

      // Notify backend (auth check + returns url)
      const res = await fetch("/api/recognition/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, publicId }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm((f) => ({ ...f, image: data.url }));
        setExistingPhotos((prev) => [data.url, ...prev]);
      } else {
        setMsg({ type: "error", text: data.error ?? "Upload failed" });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message ?? "Upload failed" });
    } finally {
      setUploading(false);
    }
  }

  function openAdd() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setMsg(null);
    setAddingType(false);
    setNewTypeInput("");
    setShowForm(true);
  }

  function openEdit(item: RecognitionItem) {
    setEditingId(item._id);
    // If item has a custom type not in defaults, track it
    if (
      !DEFAULT_TYPES.includes(item.type) &&
      !customTypes.includes(item.type)
    ) {
      setCustomTypes((prev) => [...prev, item.type]);
    }
    setForm({
      year: item.year,
      title: item.title,
      venue: item.venue,
      description: item.description,
      type: item.type,
      image: item.image,
    });
    setMsg(null);
    setAddingType(false);
    setNewTypeInput("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setMsg(null);
    setAddingType(false);
    setNewTypeInput("");
  }

  function confirmNewType() {
    const val = newTypeInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!val) return;
    if (!DEFAULT_TYPES.includes(val) && !customTypes.includes(val)) {
      setCustomTypes((prev) => [...prev, val]);
    }
    setForm((f) => ({ ...f, type: val }));
    setAddingType(false);
    setNewTypeInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const url = editingId
      ? `/api/recognition/${editingId}`
      : "/api/recognition";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", text: data.error });
      } else {
        setMsg({
          type: "success",
          text: editingId ? "Entry updated." : "Entry added.",
        });
        await fetchItems();
        setTimeout(closeForm, 1200);
      }
    } catch {
      setMsg({ type: "error", text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch(`/api/recognition/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i._id !== id));
    setDeleting(null);
    setConfirmDeleteId(null);
  }

  function handleReorder(newOrder: RecognitionItem[]) {
    setItems(newOrder);
    pendingOrderRef.current = newOrder;
  }

  async function saveOrder() {
    const ordered = pendingOrderRef.current;
    if (!ordered.length) return;
    setReordering(true);
    await fetch("/api/recognition", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: ordered.map((i) => i._id) }),
    });
    setReordering(false);
  }

  return (
    <div className="min-h-screen p-8">
      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Entry"
        message="Are you sure you want to delete this recognition entry? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
              Recognition
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Manage awards, exhibitions &amp; features
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all shadow-lg shadow-purple-500/20"
          >
            <Plus size={16} /> Add Entry
          </button>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-white font-semibold text-sm">
                {editingId ? "Edit Entry" : "Add New Entry"}
              </h2>
              <button
                onClick={closeForm}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    value={form.year}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, year: e.target.value }))
                    }
                    placeholder="2024"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                    Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allTypes.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, type: t }))}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border capitalize transition-all ${
                          form.type === t
                            ? typeColor(t)
                            : "border-white/10 text-zinc-500 hover:text-white hover:border-white/20"
                        }`}
                      >
                        {t}
                      </button>
                    ))}

                    {/* Add custom type */}
                    {addingType ? (
                      <div className="flex items-center gap-1">
                        <input
                          ref={newTypeRef}
                          autoFocus
                          type="text"
                          value={newTypeInput}
                          onChange={(e) => setNewTypeInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              confirmNewType();
                            }
                            if (e.key === "Escape") {
                              setAddingType(false);
                              setNewTypeInput("");
                            }
                          }}
                          placeholder="new type…"
                          className="w-24 bg-white/5 border border-purple-500/50 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={confirmNewType}
                          className="px-2 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddingType(false);
                            setNewTypeInput("");
                          }}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition-colors"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAddingType(true)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold border border-dashed border-white/15 text-zinc-600 hover:text-white hover:border-white/30 transition-all"
                      >
                        + Custom
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Award or exhibition title"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                  Venue / Organisation
                </label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, venue: e.target.value }))
                  }
                  placeholder="e.g. World Photography Organization"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Brief description of the achievement..."
                  required
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                  Photo
                </label>

                {/* Current selection preview + upload button */}
                <div className="flex gap-3 items-start">
                  <div className="relative shrink-0 w-28 h-28 rounded-xl border-2 border-dashed border-white/15 overflow-hidden bg-white/5 flex items-center justify-center">
                    {form.image ? (
                      <>
                        <img
                          src={form.image}
                          alt="Selected"
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, image: "" }))}
                          className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-red-500/80 transition-colors z-10"
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <ImagePlus size={22} className="text-zinc-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* Upload new */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-medium transition-all disabled:opacity-50 w-full"
                    >
                      {uploading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <ImagePlus size={14} />
                      )}
                      {uploading ? "Uploading…" : "Upload new photo"}
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

                    {/* Manual URL input for Cloudinary or external URL */}
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, image: e.target.value }))
                      }
                      placeholder="or paste a Cloudinary URL"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
                    />
                  </div>
                </div>

                {/* Existing photos grid */}
                <div className="mt-4">
                  <p className="text-xs text-zinc-500 mb-2">
                    Pick from existing recognition photos:
                  </p>
                  {photosLoading ? (
                    <div className="flex items-center gap-2 text-zinc-600 text-xs">
                      <Loader2 size={13} className="animate-spin" /> Loading…
                    </div>
                  ) : existingPhotos.length === 0 ? (
                    <p className="text-xs text-zinc-700">
                      No photos uploaded yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                      {existingPhotos.map((src) => (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, image: src }))}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            form.image === src
                              ? "border-purple-500 ring-2 ring-purple-500/40"
                              : "border-transparent hover:border-white/30"
                          }`}
                        >
                          <img
                            src={src}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {msg && (
                <div
                  className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm ${msg.type === "success" ? "bg-green-500/10 border border-green-500/25 text-green-300" : "bg-red-500/10 border border-red-500/25 text-red-300"}`}
                >
                  {msg.type === "success" ? (
                    <CheckCircle2
                      size={16}
                      className="shrink-0 mt-0.5 text-green-400"
                    />
                  ) : (
                    <AlertCircle
                      size={16}
                      className="shrink-0 mt-0.5 text-red-400"
                    />
                  )}
                  <p>{msg.text}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-semibold transition-all"
                >
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {editingId ? "Save Changes" : "Add Entry"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-purple-400" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600 gap-3">
            <Award size={44} strokeWidth={1.2} />
            <p className="text-sm">
              No recognition entries yet. Add one to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {reordering && (
              <p className="text-xs text-zinc-500 text-center animate-pulse pb-2">
                Saving order…
              </p>
            )}
            <p className="text-xs text-zinc-600 text-center pb-2">
              Drag the <span className="text-zinc-400">⠿</span> handle to
              reorder
            </p>
            <Reorder.Group
              axis="y"
              values={items}
              onReorder={handleReorder}
              className="space-y-3"
            >
              {items.map((item) => (
                <RecognitionCard
                  key={item._id}
                  item={item}
                  onEdit={openEdit}
                  onDelete={(id) => setConfirmDeleteId(id)}
                  isDeleting={deleting === item._id}
                  onDragEnd={saveOrder}
                />
              ))}
            </Reorder.Group>
          </div>
        )}
      </div>
    </div>
  );
}
