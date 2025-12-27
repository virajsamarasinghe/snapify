"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const ctx = gsap.context(() => {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
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
          }
        );
      });

      return () => ctx.revert();
    } else {
      document.body.style.overflow = "auto";
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

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* Popup */}
      <div
        ref={popupRef}
        className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-black/95 to-black/90 border border-white/10 rounded-2xl p-8 lg:p-12 shadow-2xl"
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
          <form className="space-y-6">
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
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="Your name"
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
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
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
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="What's this about?"
              />
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
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-medium py-4 rounded-full hover:bg-white/90 transition-all duration-300"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap gap-6 justify-center text-sm text-white/60">
            <a
              href="mailto:hello@jk.com"
              className="hover:text-white transition-colors"
            >
              hello@jk.com
            </a>
            <span className="text-white/20">|</span>
            <a
              href="tel:+1234567890"
              className="hover:text-white transition-colors"
            >
              +1 (234) 567-890
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
