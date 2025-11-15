"use client";

import GalleryNew from "@/app/components/GalleryNew";
import TransitionLink from "@/app/components/TransitionLink";

export default function Work() {
  return (
    <>
      {/* Navigation - Artistic style matching new design */}
      <nav className="fixed top-0 left-0 w-full px-8 lg:px-12 py-6 flex justify-between items-center z-[10003] mix-blend-difference">
        <div className="flex items-center gap-12">
          <TransitionLink
            href="/"
            className="text-3xl font-bold text-white"
          >
            JK
          </TransitionLink>
          <div className="hidden lg:flex items-center gap-8">
            <TransitionLink
              href="/work"
              className="text-white font-medium"
            >
              Work
            </TransitionLink>
            <TransitionLink
              href="/#gallery"
              className="text-white/60 hover:text-white transition-colors"
            >
              Gallery
            </TransitionLink>
            <TransitionLink
              href="/#about"
              className="text-white/60 hover:text-white transition-colors"
            >
              About
            </TransitionLink>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <TransitionLink
            href="#contact"
            className="text-white border border-white/30 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all"
          >
            Let&apos;s Talk
          </TransitionLink>
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
