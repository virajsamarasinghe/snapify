"use client";

import gsap from "gsap";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const ctx = gsap.context(() => {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" },
        );
        gsap.fromTo(
          popupRef.current,
          { scale: 0.9, opacity: 0, y: 50 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            delay: 0.1,
          },
        );
      });

      return () => ctx.revert();
    } else {
      document.body.style.overflow = "auto";
      // Reset form when closed
      setTimeout(() => {
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        setStatus("idle");
        setErrorMsg("");
      }, 400);
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(popupRef.current, {
      scale: 0.9,
      opacity: 0,
      y: 50,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      } else {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-9999 flex items-center justify-center px-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* Popup */}
      <div
        ref={popupRef}
        className="relative z-10 w-full max-w-2xl bg-linear-to-b from-black/95 to-black/90 border border-white/10 rounded-2xl p-8 lg:p-12 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-2">
              Let's Talk
            </h2>
            <p className="text-white/60 text-lg">
              Get in touch and let's create something amazing together
            </p>
          </div>

          {/* Contact Form */}
          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <CheckCircle2 size={52} className="text-green-400" />
              <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
              <p className="text-white/60">
                Thanks for reaching out. We'll get back to you soon.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all duration-300"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm text-white/60 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-white/60 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm text-white/60 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="+94 77 123 4567"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm text-white/60 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={form.subject}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, subject: e.target.value }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="What's this about?"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm text-white/60 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
                  placeholder="Tell me about your project..."
                  required
                />
              </div>

              {status === "error" && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-sm">
                  <AlertCircle
                    size={17}
                    className="shrink-0 mt-0.5 text-red-400"
                  />
                  <div>
                    <p className="font-semibold text-xs uppercase tracking-wide mb-0.5">
                      Error
                    </p>
                    <p>{errorMsg}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-white text-black font-medium py-4 rounded-full hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
                ) : (
                  <Send size={17} />
                )}
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}

          {/* Contact Info */}
          <div className="pt-6 border-t border-white/10 flex flex-col items-center gap-4 text-sm text-white/60">
            <div className="flex gap-4 flex-wrap justify-center">
              <a
                href="mailto:studionethma@yahoo.com"
                className="hover:text-white transition-colors"
              >
                studionethma@yahoo.com
              </a>
              <span className="text-white/20 hidden sm:inline">|</span>
              <a
                href="mailto:studionethma3@gmail.com"
                className="hover:text-white transition-colors"
              >
                studionethma3@gmail.com
              </a>
            </div>
            <div className="flex gap-4 flex-wrap justify-center">
              <a
                href="tel:+94777901129"
                className="hover:text-white transition-colors"
              >
                +94 777 901 129
              </a>
              <span className="text-white/20 hidden sm:inline">|</span>
              <a
                href="tel:+94112624725"
                className="hover:text-white transition-colors"
              >
                +94 112 624 725
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
