"use client";

import GalleryNew from "@/app/components/GalleryNew";
import HomeNavbar from "@/app/components/HomeNavbar";

export default function Work() {
  return (
    <>
      {/* Navigation - Artistic style matching new design */}
      {/* Navigation - Artistic style matching new design */}
      <HomeNavbar className="z-[10003]" />

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
