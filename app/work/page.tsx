"use client";

import GalleryNew from "@/app/components/GalleryNew";
import Image from "next/image";

export default function Work() {
  return (
    <>
      {/* Navigation - Artistic style matching new design */}
      <nav className="fixed top-0 left-0 w-full px-8 lg:px-12 py-6 flex justify-between items-center z-[10003] mix-blend-difference">
        <div className="flex items-center gap-12">
          <a
            href="/"
            className="text-3xl font-bold text-white"
          >
            JK
          </a>
          <div className="hidden lg:flex items-center gap-8">
            <a
              href="/work"
              className="text-white font-medium"
            >
              Work
            </a>
            <a
              href="/#gallery"
              className="text-white/60 hover:text-white transition-colors"
            >
              Gallery
            </a>
            <a
              href="/#about"
              className="text-white/60 hover:text-white transition-colors"
            >
              About
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-white border border-white/30 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all"
          >
            Let's Talk
          </a>
        </div>
      </nav>

      {/* Page Title */}
      <div className="fixed top-24 left-8 lg:left-12 z-[10003]">
        <p className="text-white/60 text-sm uppercase tracking-[0.3em] mb-2">Portfolio</p>
        <h1 className="text-3xl font-bold text-white">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Explore Collection
          </span>
        </h1>
        <p className="text-white/40 text-sm mt-2">Drag to explore • Click to view</p>
      </div>

      <GalleryNew />
    </>
  );
}
