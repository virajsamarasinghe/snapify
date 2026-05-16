"use client";

import ConfirmDialog from "@/app/components/admin/ConfirmDialog";
import {
    AlertCircle,
    CheckCircle2,
    Eye,
    EyeOff,
    Globe,
    Lock,
    Mail,
    MapPin,
    Phone,
    Save,
    Shield,
    ShoppingBag,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Msg = { type: "success" | "error"; text: string } | null;

function PasswordInput({
  value,
  onChange,
  placeholder,
  show,
  onToggle,
  autoComplete = "current-password",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  show: boolean;
  onToggle: () => void;
  autoComplete?: string;
}) {
  return (
    <div className="relative">
      <Lock
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
      />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        autoComplete={autoComplete}
        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

const ERROR_MAP: Record<string, string> = {
  "Current password is incorrect":
    "The password you entered is wrong. Please try again.",
  "Current password is required":
    "Please enter your current password to continue.",
  "That email is already in use":
    "That email address is already registered to another account.",
  "User not found":
    "Your account could not be found. Please sign out and try again.",
  Unauthorized: "Your session has expired. Please sign in again.",
  "New password must be at least 8 characters":
    "Your new password must be at least 8 characters long.",
  "Provide a new email or new password to update":
    "Please enter a new email or new password.",
};

function friendlyError(raw: string): string {
  return ERROR_MAP[raw] ?? raw;
}

function Feedback({ msg }: { msg: Msg }) {
  if (!msg) return null;
  const isSuccess = msg.type === "success";
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm ${
        isSuccess
          ? "bg-green-500/10 border border-green-500/25 text-green-300"
          : "bg-red-500/10 border border-red-500/25 text-red-300"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 size={17} className="shrink-0 mt-0.5 text-green-400" />
      ) : (
        <AlertCircle size={17} className="shrink-0 mt-0.5 text-red-400" />
      )}
      <div>
        <p className="font-semibold text-xs uppercase tracking-wide mb-0.5">
          {isSuccess ? "Success" : "Error"}
        </p>
        <p className="leading-snug">
          {isSuccess ? msg.text : friendlyError(msg.text)}
        </p>
      </div>
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-purple-500/20"
    >
      {loading ? (
        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
      ) : (
        <Save size={16} />
      )}
      {loading ? "Saving…" : label}
    </button>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession();

  // --- Change Email state ---
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    confirmPassword: "",
  });
  const [showEmailPw, setShowEmailPw] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMsg, setEmailMsg] = useState<Msg>(null);

  // --- Change Password state ---
  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<Msg>(null);

  // --- Marketplace visibility state ---
  const [showMarketplace, setShowMarketplace] = useState<boolean | null>(null);
  const [marketplaceLoading, setMarketplaceLoading] = useState(false);
  const [marketplaceMsg, setMarketplaceMsg] = useState<Msg>(null);
  const [confirmMarketplace, setConfirmMarketplace] = useState(false);

  // --- Contact & Social state ---
  const [contact, setContact] = useState({
    email1: "",
    email2: "",
    phone1: "",
    phone2: "",
    studioAddress: "",
    studioCity: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
    twitter: "",
    linkedin: "",
    footerTagline: "",
    copyrightName: "",
    galleryQuote: "",
    galleryQuoteAuthor: "",
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactMsg, setContactMsg] = useState<Msg>(null);

  useEffect(() => {
    fetch("/api/settings/public", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setShowMarketplace(d.showMarketplace))
      .catch(() => setShowMarketplace(true));
  }, []);

  useEffect(() => {
    fetch("/api/settings/public", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setContact((prev) => ({ ...prev, ...d })))
      .catch(() => {});
  }, []);

  async function toggleMarketplace() {
    if (showMarketplace === null) return;
    const next = !showMarketplace;
    setMarketplaceLoading(true);
    setMarketplaceMsg(null);
    try {
      const res = await fetch("/api/settings/marketplace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showMarketplace: next }),
      });
      if (res.ok) {
        setShowMarketplace(next);
        setMarketplaceMsg({
          type: "success",
          text: next
            ? "Marketplace is now visible."
            : "Marketplace is now hidden.",
        });
      } else {
        setMarketplaceMsg({ type: "error", text: "Failed to update setting." });
      }
    } catch {
      setMarketplaceMsg({ type: "error", text: "Something went wrong." });
    } finally {
      setMarketplaceLoading(false);
    }
  }

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault();
    setEmailMsg(null);
    setEmailLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: emailForm.confirmPassword,
          newEmail: emailForm.newEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEmailMsg({ type: "error", text: data.error });
      } else {
        setEmailMsg({
          type: "success",
          text: "Email updated. Signing you out…",
        });
        setEmailForm({ newEmail: "", confirmPassword: "" });
        setTimeout(() => signOut({ callbackUrl: "/admin/login" }), 2000);
      }
    } catch {
      setEmailMsg({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setEmailLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwMsg({
        type: "error",
        text: "New password must be at least 8 characters",
      });
      return;
    }
    if (pwForm.oldPassword === pwForm.newPassword) {
      setPwMsg({
        type: "error",
        text: "New password must be different from the current one",
      });
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: pwForm.oldPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwMsg({ type: "error", text: data.error });
      } else {
        setPwMsg({
          type: "success",
          text: "Password updated. Signing you out…",
        });
        setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => signOut({ callbackUrl: "/admin/login" }), 2000);
      }
    } catch {
      setPwMsg({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setPwLoading(false);
    }
  }

  async function handleContactSave(e: React.FormEvent) {
    e.preventDefault();
    setContactLoading(true);
    setContactMsg(null);
    try {
      const res = await fetch("/api/settings/public", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      if (res.ok) {
        setContactMsg({
          type: "success",
          text: "Contact & social settings saved.",
        });
      } else {
        const d = await res.json();
        setContactMsg({ type: "error", text: d.error ?? "Failed to save." });
      }
    } catch {
      setContactMsg({ type: "error", text: "Something went wrong." });
    } finally {
      setContactLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-8">
      <ConfirmDialog
        open={confirmMarketplace}
        title={showMarketplace ? "Hide Marketplace?" : "Show Marketplace?"}
        message={
          showMarketplace
            ? "This will hide the Marketplace link and CTA from the entire site. Visitors won't be able to access it until you turn it back on."
            : "This will make the Marketplace link and CTA visible to all visitors on the site."
        }
        confirmLabel={showMarketplace ? "Yes, Hide it" : "Yes, Show it"}
        onConfirm={() => {
          setConfirmMarketplace(false);
          toggleMarketplace();
        }}
        onCancel={() => setConfirmMarketplace(false)}
      />
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div id="account">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Shield size={22} className="text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Account Settings
            </h1>
          </div>
          <p className="text-zinc-500 text-sm ml-1">
            Manage your admin credentials
          </p>
        </div>

        {/* Current account info */}
        <div className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
            {session?.user?.email?.[0].toUpperCase() || "A"}
          </div>
          <div>
            <p className="text-white font-medium text-sm">
              {session?.user?.email}
            </p>
            <p className="text-zinc-500 text-xs capitalize">
              {session?.user?.role || "Administrator"}
            </p>
          </div>
        </div>

        {/* ── Side-by-side cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* ── Change Email ── */}
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <Mail size={18} className="text-purple-400" />
              <h2 className="text-white font-semibold text-sm tracking-wide">
                Change Email
              </h2>
            </div>
            <form
              onSubmit={handleEmailChange}
              className="p-6 flex flex-col gap-4 flex-1"
            >
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                  New Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="email"
                    value={emailForm.newEmail}
                    onChange={(e) =>
                      setEmailForm((f) => ({ ...f, newEmail: e.target.value }))
                    }
                    placeholder="Enter new email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                  Confirm with Current Password
                </label>
                <PasswordInput
                  value={emailForm.confirmPassword}
                  onChange={(v) =>
                    setEmailForm((f) => ({ ...f, confirmPassword: v }))
                  }
                  placeholder="Enter your current password"
                  show={showEmailPw}
                  onToggle={() => setShowEmailPw((v) => !v)}
                  autoComplete="current-password"
                />
              </div>
              <Feedback msg={emailMsg} />
              <div className="mt-auto">
                <SubmitButton loading={emailLoading} label="Update Email" />
              </div>
            </form>
          </div>

          {/* ── Change Password ── */}
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <Lock size={18} className="text-purple-400" />
              <h2 className="text-white font-semibold text-sm tracking-wide">
                Change Password
              </h2>
            </div>
            <form
              onSubmit={handlePasswordChange}
              className="p-6 flex flex-col gap-4 flex-1"
            >
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                  Current Password
                </label>
                <PasswordInput
                  value={pwForm.oldPassword}
                  onChange={(v) => setPwForm((f) => ({ ...f, oldPassword: v }))}
                  placeholder="Enter current password"
                  show={showOld}
                  onToggle={() => setShowOld((v) => !v)}
                  autoComplete="current-password"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                  New Password
                </label>
                <PasswordInput
                  value={pwForm.newPassword}
                  onChange={(v) => setPwForm((f) => ({ ...f, newPassword: v }))}
                  placeholder="Min. 8 characters"
                  show={showNew}
                  onToggle={() => setShowNew((v) => !v)}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                  Confirm New Password
                </label>
                <PasswordInput
                  value={pwForm.confirmPassword}
                  onChange={(v) =>
                    setPwForm((f) => ({ ...f, confirmPassword: v }))
                  }
                  placeholder="Re-enter new password"
                  show={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                  autoComplete="new-password"
                />
              </div>
              <Feedback msg={pwMsg} />
              <div className="mt-auto">
                <SubmitButton loading={pwLoading} label="Update Password" />
              </div>
            </form>
          </div>
        </div>
        {/* end grid */}

        {/* Marketplace visibility */}
        <div
          id="features"
          className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <ShoppingBag size={18} className="text-purple-400" />
            <h2 className="text-white font-semibold text-sm tracking-wide">
              Site Features
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-white text-sm font-medium">Marketplace</p>
                <p className="text-zinc-500 text-xs mt-0.5">
                  Show or hide the Marketplace link in the site navigation and
                  all related buttons.
                </p>
              </div>
              <button
                onClick={() => setConfirmMarketplace(true)}
                disabled={marketplaceLoading || showMarketplace === null}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium disabled:opacity-50 ${
                  showMarketplace
                    ? "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                    : "border-zinc-600/40 bg-white/5 text-zinc-400 hover:bg-white/10"
                }`}
              >
                {marketplaceLoading ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                ) : showMarketplace ? (
                  <ToggleRight size={20} />
                ) : (
                  <ToggleLeft size={20} />
                )}
                {showMarketplace ? "Visible" : "Hidden"}
              </button>
            </div>
            <Feedback msg={marketplaceMsg} />
          </div>
        </div>

        {/* Contact & Social Settings */}
        <div
          id="contact"
          className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <Globe size={18} className="text-purple-400" />
            <h2 className="text-white font-semibold text-sm tracking-wide">
              Contact & Social Media
            </h2>
          </div>
          <form onSubmit={handleContactSave} className="p-6 space-y-6">
            {/* Contact Info */}
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                <Mail size={13} className="text-purple-400" /> Email Addresses
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(["email1", "email2"] as const).map((k, i) => (
                  <input
                    key={k}
                    type="email"
                    value={contact[k]}
                    onChange={(e) =>
                      setContact((p) => ({ ...p, [k]: e.target.value }))
                    }
                    placeholder={`Email ${i + 1}`}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                <Phone size={13} className="text-purple-400" /> Phone Numbers
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(["phone1", "phone2"] as const).map((k, i) => (
                  <input
                    key={k}
                    type="text"
                    value={contact[k]}
                    onChange={(e) =>
                      setContact((p) => ({ ...p, [k]: e.target.value }))
                    }
                    placeholder={`Phone ${i + 1}`}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                <MapPin size={13} className="text-purple-400" /> Studio Address
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={contact.studioAddress}
                  onChange={(e) =>
                    setContact((p) => ({ ...p, studioAddress: e.target.value }))
                  }
                  placeholder="Street address"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
                />
                <input
                  type="text"
                  value={contact.studioCity}
                  onChange={(e) =>
                    setContact((p) => ({ ...p, studioCity: e.target.value }))
                  }
                  placeholder="City, Country"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
                />
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                Social Media URLs
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(
                  [
                    { key: "instagram", label: "Instagram URL" },
                    { key: "facebook", label: "Facebook URL" },
                    { key: "tiktok", label: "TikTok URL" },
                    { key: "youtube", label: "YouTube URL" },
                    { key: "twitter", label: "Twitter / X URL" },
                    { key: "linkedin", label: "LinkedIn URL" },
                  ] as { key: keyof typeof contact; label: string }[]
                ).map(({ key, label }) => (
                  <input
                    key={key}
                    type="url"
                    value={contact[key]}
                    onChange={(e) =>
                      setContact((p) => ({ ...p, [key]: e.target.value }))
                    }
                    placeholder={label}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
                  />
                ))}
              </div>
            </div>

            {/* WhatsApp — Marketplace only */}
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                WhatsApp Number
              </p>
              <p className="text-xs text-zinc-600 mb-3">
                Used for the &ldquo;Inquire on WhatsApp&rdquo; button in the
                Marketplace. Enter digits only (e.g. 94777901129).
              </p>
              <input
                type="text"
                value={contact.whatsapp}
                onChange={(e) =>
                  setContact((p) => ({ ...p, whatsapp: e.target.value }))
                }
                placeholder="e.g. 94777901129"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-green-500/60 transition-all"
              />
            </div>

            {/* Footer text */}
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                Footer Text
              </p>
              <div className="space-y-3">
                <textarea
                  value={contact.footerTagline}
                  onChange={(e) =>
                    setContact((p) => ({ ...p, footerTagline: e.target.value }))
                  }
                  placeholder="Footer tagline / description"
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all resize-none"
                />
                <input
                  type="text"
                  value={contact.copyrightName}
                  onChange={(e) =>
                    setContact((p) => ({ ...p, copyrightName: e.target.value }))
                  }
                  placeholder="Copyright name (e.g. Studio Nethma)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
                />
              </div>
            </div>

            {/* Gallery Quote */}
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                Gallery Section Quote
              </p>
              <p className="text-xs text-zinc-600 mb-3">
                Displayed in the scrolling gallery section on the home page.
              </p>
              <div className="space-y-3">
                <textarea
                  value={contact.galleryQuote}
                  onChange={(e) =>
                    setContact((p) => ({ ...p, galleryQuote: e.target.value }))
                  }
                  placeholder="e.g. Photography is the story I fail to put into words."
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all resize-none"
                />
                <input
                  type="text"
                  value={contact.galleryQuoteAuthor}
                  onChange={(e) =>
                    setContact((p) => ({
                      ...p,
                      galleryQuoteAuthor: e.target.value,
                    }))
                  }
                  placeholder="Quote author (e.g. Destin Sparks)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 transition-all"
                />
              </div>
            </div>

            <Feedback msg={contactMsg} />
            <SubmitButton
              loading={contactLoading}
              label="Save Contact & Social"
            />
          </form>
        </div>

        {/* Security note */}
        <div className="px-5 py-4 rounded-2xl bg-white/3 border border-white/8">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
            Security
          </p>
          <ul className="space-y-2 text-xs text-zinc-500">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              Passwords are hashed with{" "}
              <strong className="text-zinc-400">bcrypt (cost 12)</strong> —
              plain text is never stored.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              Your current password must be verified before any change is
              applied.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              After saving, you are signed out so the new credentials take
              effect immediately.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
