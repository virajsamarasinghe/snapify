"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";

gsap.registerPlugin(ScrollTrigger);

interface Artwork {
  id: number;
  src: string;
  category: string;
  album: string | null;
}

interface GalleryAlbumProp {
  id: string;
  name: string;
  images: string[];
}

interface GalleryCategoryProp {
  id: string;
  name: string;
  images: string[];
  albums?: GalleryAlbumProp[];
}

interface GalleryClientProps {
  galleryCategories: GalleryCategoryProp[];
}

const PAGE_SIZE = 24;

function GalleryContent({ galleryCategories }: GalleryClientProps) {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const albumFromUrl = searchParams.get("album");

  // Build flat artwork list from DB categories
  const artworks: Artwork[] = useMemo(() => {
    let id = 1;
    const list: Artwork[] = [];
    galleryCategories.forEach((cat) => {
      const albumImageMap = new Map<string, string>();
      (cat.albums || []).forEach((album) => {
        album.images.forEach((src) => {
          if (!albumImageMap.has(src)) albumImageMap.set(src, album.name);
        });
      });
      cat.images.forEach((src) => {
        list.push({
          id: id++,
          src,
          category: cat.name,
          album: albumImageMap.get(src) ?? null,
        });
      });
    });
    return list;
  }, [galleryCategories]);

  const categoryNames = useMemo(
    () => ["All", ...galleryCategories.map((c) => c.name)],
    [galleryCategories],
  );

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAlbum, setSelectedAlbum] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Album names for the currently selected category
  const albumNames = useMemo(() => {
    if (selectedCategory === "All") return [];
    const cat = galleryCategories.find((c) => c.name === selectedCategory);
    if (!cat?.albums?.length) return [];
    return ["All", ...cat.albums.map((a) => a.name)];
  }, [selectedCategory, galleryCategories]);

  // Set category/album from URL on mount
  useEffect(() => {
    if (categoryFromUrl && categoryNames.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
      if (albumFromUrl) {
        const cat = galleryCategories.find((c) => c.name === categoryFromUrl);
        if (cat?.albums?.some((a) => a.name === albumFromUrl)) {
          setSelectedAlbum(albumFromUrl);
        }
      }
    }
  }, [categoryFromUrl, albumFromUrl, categoryNames, galleryCategories]);

  const filteredArtworks = useMemo(() => {
    let list =
      selectedCategory === "All"
        ? artworks
        : artworks.filter((art) => art.category === selectedCategory);
    if (selectedCategory !== "All" && selectedAlbum !== "All") {
      list = list.filter((art) => art.album === selectedAlbum);
    }
    return list;
  }, [selectedCategory, selectedAlbum, artworks]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, selectedAlbum]);

  const visibleArtworks = useMemo(
    () => filteredArtworks.slice(0, visibleCount),
    [filteredArtworks, visibleCount],
  );

  // Animation for category change
  useEffect(() => {
    // Animate title characters
    const titleChars = gsap.utils.toArray(".hero-text-char");
    if (titleChars.length) {
      gsap.fromTo(
        titleChars,
        { y: 120, opacity: 0, rotationX: -80, transformOrigin: "50% 50%" },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1.4,
          stagger: { each: 0.03, from: "start" },
          ease: "expo.out",
        },
      );
    }

    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(".gallery-item");
      gsap.set(items, { opacity: 0, scale: 0.85 });
      gsap.to(items, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        stagger: { each: 0.05, from: "start", ease: "sine.inOut" },
        ease: "expo.out",
      });
    }, gridRef);
    return () => ctx.revert();
  }, [selectedCategory, selectedAlbum]);

  // Initial Page Animation (subtitle + back button only — title is handled by category change effect)
  useEffect(() => {
    if (!galleryRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gallery-subtitle",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.8, ease: "expo.out" },
      );
      gsap.fromTo(
        ".back-button",
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, delay: 0.4, ease: "expo.out" },
      );
    }, galleryRef);
    return () => ctx.revert();
  }, []);

  const openImage = (id: number) => setSelectedImage(id);
  const closeImage = () => setSelectedImage(null);

  const navigateImage = (direction: "prev" | "next") => {
    if (!selectedImage) return;
    const currentIndex = filteredArtworks.findIndex(
      (art) => art.id === selectedImage,
    );
    let newIndex = currentIndex;
    if (direction === "prev" && currentIndex > 0) newIndex = currentIndex - 1;
    else if (direction === "next" && currentIndex < filteredArtworks.length - 1)
      newIndex = currentIndex + 1;
    setSelectedImage(filteredArtworks[newIndex].id);
  };

  const selectedArtwork = artworks.find((art) => art.id === selectedImage);

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (!selectedImage) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
      else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const dir = e.key === "ArrowLeft" ? -1 : 1;
        const currentIndex = filteredArtworks.findIndex(
          (art) => art.id === selectedImage,
        );
        const newIndex = currentIndex + dir;
        if (newIndex >= 0 && newIndex < filteredArtworks.length) {
          setSelectedImage(filteredArtworks[newIndex].id);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedImage, filteredArtworks]);

  return (
    <div
      ref={galleryRef}
      className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black"
    >
      <style jsx global>{`
        .gallery-item {
          will-change: transform, opacity;
        }
        .gallery-item img {
          will-change: transform, filter;
        }
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .gallery-item:hover::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 1.5s;
          z-index: 1;
          pointer-events: none;
        }
      `}</style>

      <Navbar className="bg-transparent backdrop-blur-none" />

      {/* Hero Section */}
      <header className="pt-32 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-12 container mx-auto">
        <div className="mb-6 sm:mb-8 back-button">
          <a
            href="/#gallery"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-xs sm:text-sm uppercase tracking-wider">
              Back to Categories
            </span>
          </a>
        </div>

        <div className="overflow-hidden">
          <h1 className="text-[8vw] sm:text-[10vw] lg:text-[12vw] leading-[0.8] font-bold tracking-tighter uppercase text-white/90 mb-6 sm:mb-8 perspective-1000">
            {["Events Coverage", "School Events", "World Photography"].includes(
              selectedCategory,
            )
              ? selectedCategory.split(" ").map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    className="block whitespace-nowrap leading-[0.9]"
                  >
                    {Array.from(word).map((char, charIndex) => (
                      <span
                        key={charIndex}
                        className="hero-text-char inline-block"
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                ))
              : Array.from(selectedCategory).map((char, i) => (
                  <span key={i} className="hero-text-char inline-block">
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
          </h1>
          <p className="gallery-subtitle text-white/60 text-base sm:text-lg lg:text-xl font-light">
            photography
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-nowrap sm:flex-wrap gap-2.5 sm:gap-4 mt-8 sm:mt-12 overflow-x-auto sm:overflow-visible pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedAlbum("All");
                const url = new URL(window.location.href);
                url.searchParams.delete("album");
                if (cat === "All") url.searchParams.delete("category");
                else url.searchParams.set("category", cat);
                window.history.replaceState({}, "", url);
              }}
              className={`shrink-0 snap-start px-4 sm:px-6 py-2 sm:py-3 rounded-full border text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white/50 border-white/20 hover:text-white hover:border-white/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Album Filters (shown when a category with albums is selected) */}
        {albumNames.length > 0 && (
          <div className="mt-4 sm:mt-6">
            <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-[0.25em] mb-3">
              Albums
            </p>
            <div className="flex flex-nowrap sm:flex-wrap gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none">
              {albumNames.map((album) => (
                <button
                  key={album}
                  onClick={() => {
                    setSelectedAlbum(album);
                    const url = new URL(window.location.href);
                    if (album === "All") url.searchParams.delete("album");
                    else url.searchParams.set("album", album);
                    window.history.replaceState({}, "", url);
                  }}
                  className={`shrink-0 snap-start max-w-[70vw] truncate px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border text-[11px] sm:text-xs tracking-wider transition-all duration-300 whitespace-nowrap ${
                    selectedAlbum === album
                      ? "bg-white/90 text-black border-white"
                      : "bg-transparent text-white/50 border-white/15 hover:text-white hover:border-white/40"
                  }`}
                >
                  {album === "All" ? "All Albums" : album}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Masonry Grid */}
      <main className="px-4 sm:px-6 lg:px-12 pb-32 container mx-auto">
        {filteredArtworks.length === 0 ? (
          <div className="text-center text-white/40 py-32">
            No photos found for this category.
          </div>
        ) : (
          <>
            <div
              ref={gridRef}
              className="columns-1 sm:columns-2 lg:columns-3 gap-0"
            >
              {visibleArtworks.map((artwork, index) => (
                <div
                  key={artwork.id}
                  className="gallery-item group relative overflow-hidden cursor-pointer break-inside-avoid mb-0"
                  onClick={() => openImage(artwork.id)}
                  onMouseEnter={() => setHoveredId(artwork.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative w-full transform-gpu transition-all duration-1000 ease-out group-hover:scale-[1.02]">
                    <Image
                      src={artwork.src}
                      alt={`${artwork.category} photo`}
                      width={1200}
                      height={800}
                      className="w-full h-auto object-cover transition-all duration-1000 ease-out group-hover:brightness-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 6}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                      <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                        <p className="text-xs font-mono text-white/80 mb-2 uppercase tracking-widest">
                          {artwork.category}
                          {artwork.album ? ` — ${artwork.album}` : ""}
                        </p>
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                          <span className="flex items-center gap-1">
                            View
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white/0 group-hover:border-white/30 transition-all duration-700" />
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < filteredArtworks.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-8 py-3 rounded-full border border-white/20 text-white/70 text-sm uppercase tracking-widest hover:text-white hover:border-white/50 transition-all duration-300"
                >
                  Load More ({filteredArtworks.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Lightbox */}
      {selectedImage && selectedArtwork && (
        <div className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex items-center justify-center">
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-110">
            <div className="text-white/50 font-mono text-sm">
              {String(
                filteredArtworks.findIndex((a) => a.id === selectedImage) + 1,
              ).padStart(2, "0")}{" "}
              / {String(filteredArtworks.length).padStart(2, "0")}
            </div>
            <button
              onClick={closeImage}
              className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <span className="text-sm font-mono uppercase tracking-widest">
                Close
              </span>
              <div className="w-8 h-8 flex items-center justify-center border border-white/20 rounded-full group-hover:border-white transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </button>
          </div>

          <div className="w-full h-full flex flex-col lg:flex-row">
            <div className="flex-1 relative min-h-0 flex items-center justify-center p-4 pt-20 lg:pt-12 lg:p-12">
              <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
                <Image
                  src={selectedArtwork.src}
                  alt={selectedArtwork.category}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("prev");
                }}
                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("next");
                }}
                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <div className="lg:w-[360px] bg-[#0f0f0f] border-t lg:border-t-0 lg:border-l border-white/5 p-6 lg:p-12 flex flex-col justify-center shrink-0">
              <div className="space-y-4 lg:space-y-6">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {selectedArtwork.category}
                  </h2>
                  <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
                    {selectedArtwork.album ?? "Photography"}
                  </p>
                </div>
                <p className="text-white/60 leading-relaxed font-light">
                  A captured moment from the{" "}
                  {selectedArtwork.album
                    ? `${selectedArtwork.album} album`
                    : `${selectedArtwork.category.toLowerCase()} collection`}
                  . Each image tells a unique story through light and
                  composition.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Gallery({ galleryCategories }: GalleryClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <GalleryContent galleryCategories={galleryCategories} />
    </Suspense>
  );
}
