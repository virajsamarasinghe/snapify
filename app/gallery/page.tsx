"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "../components/TransitionLink";
import HomeNavbar from "../components/HomeNavbar";

gsap.registerPlugin(ScrollTrigger);

interface Artwork {
  id: number;
  src: string;
  title: string;
  category: string;
  year: string;
  description?: string;
  size: "small" | "medium" | "large" | "tall" | "wide";
}

// Category image mappings - maps category names to their folder images
const categoryImages: { [key: string]: string[] } = {
  "School Events": [
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.12.jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.12 (1).jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.13.jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.13 (1).jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.13 (2).jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.14.jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.14 (1).jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.14 (2).jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.15.jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.15 (1).jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.16.jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.16 (1).jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.16 (2).jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.17.jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.17 (1).jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.17 (2).jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.18.jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.19.jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.19 (1).jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.20.jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.20 (1).jpeg",
    "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.20 (2).jpeg",
  ],
  Wildlife: [
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.25.jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.25 (1).jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.26.jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.26 (1).jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.27.jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.27 (1).jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.27 (2).jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.28.jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.28 (1).jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.28 (2).jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.29.jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.29 (1).jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.29 (2).jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.30.jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.30 (1).jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.30 (2).jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.31.jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.31 (1).jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.32.jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.32 (1).jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.32 (2).jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.33.jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.33 (1).jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.33 (2).jpeg",
    "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.34.jpeg",
  ],
  University: [
    "/gallery/mountain-solitude.jpg",
    "/gallery/desert-dreams.jpg",
    "/gallery/abstract-reality.jpg",
  ],
  Weddings: [
    "/gallery/silent-moments.jpg",
    "/gallery/time-suspended.jpg",
    "/gallery/rhythm-of-life.jpg",
  ],
  Army: ["/gallery/urban-poetry.jpg", "/gallery/neon-nights.jpg"],
  "Events Coverage": [
    "/gallery/dance-of-shadows.jpg",
    "/gallery/mountain-solitude.jpg",
  ],
  "World Photography": [
    "/gallery/world-photography/WhatsApp Image 2025-12-28 at 02.43.09.jpeg",
    "/gallery/world-photography/WhatsApp Image 2025-12-28 at 02.43.09 (1).jpeg",
    "/gallery/world-photography/WhatsApp Image 2025-12-28 at 02.43.09 (2).jpeg",
    "/gallery/world-photography/WhatsApp Image 2025-12-28 at 02.43.10.jpeg",
    "/gallery/world-photography/WhatsApp Image 2025-12-28 at 02.43.10 (1).jpeg",
    "/gallery/world-photography/WhatsApp Image 2025-12-28 at 02.43.11.jpeg",
    "/gallery/world-photography/WhatsApp Image 2025-12-28 at 02.43.11 (1).jpeg",
  ],
};

// Generate artworks from category images
const generateArtworks = (): Artwork[] => {
  const artworks: Artwork[] = [];
  let id = 1;

  Object.entries(categoryImages).forEach(([category, images]) => {
    images.forEach((imagePath, index) => {
      const fileName = imagePath.split("/").pop() || "";
      const sizes: Array<"small" | "medium" | "large" | "tall" | "wide"> = [
        "small",
        "medium",
        "large",
        "tall",
        "wide",
      ];

      artworks.push({
        id: id++,
        src: imagePath,
        title: `${category} ${index + 1}`,
        category: category,
        year: "2024",
        size: sizes[index % sizes.length],
      });
    });
  });

  return artworks;
};

const artworks: Artwork[] = generateArtworks();

const categories = [
  "All",
  "University",
  "Weddings",
  "Army",
  "Events Coverage",
  "School Events",
  "World Photography",
  "Wildlife",
];

function GalleryContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Set category from URL on mount
  useEffect(() => {
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const filteredArtworks = useMemo(
    () =>
      selectedCategory === "All"
        ? artworks
        : artworks.filter((art) => art.category === selectedCategory),
    [selectedCategory]
  );

  // Animation for category change with creative image reveal
  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(".gallery-item");

      // Set initial state
      gsap.set(items, {
        opacity: 0,
        scale: 0.85,
        rotationY: -20,
        transformOrigin: "center center",
      });

      // Staggered reveal with 3D rotation
      gsap.to(items, {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 1.2,
        stagger: {
          each: 0.1,
          from: "start",
          ease: "sine.inOut",
        },
        ease: "expo.out",
      });
    }, gridRef);

    return () => ctx.revert();
  }, [selectedCategory]);

  // Initial Page Animation
  useEffect(() => {
    if (!galleryRef.current) return;

    const ctx = gsap.context(() => {
      // Creative Title Animation - Split reveal with glitch effect
      const titleChars = gsap.utils.toArray(".hero-text-char");

      gsap.set(titleChars, {
        y: 200,
        opacity: 0,
        rotationX: -90,
        transformOrigin: "50% 50%",
      });

      gsap.to(titleChars, {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 1.8,
        stagger: {
          each: 0.04,
          from: "start",
          ease: "sine.inOut",
        },
        ease: "expo.out",
      });

      // Subtle glitch effect on title
      gsap.to(titleChars, {
        x: "random(-2, 2)",
        duration: 0.15,
        repeat: 2,
        yoyo: true,
        delay: 1.2,
        stagger: 0.03,
        ease: "sine.inOut",
      });

      // Subtitle fade in
      gsap.fromTo(
        ".gallery-subtitle",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.8, ease: "expo.out" }
      );

      // Back button slide in
      gsap.fromTo(
        ".back-button",
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, delay: 0.4, ease: "expo.out" }
      );
    }, galleryRef);

    return () => ctx.revert();
  }, [selectedCategory]);

  const openImage = (id: number) => setSelectedImage(id);
  const closeImage = () => setSelectedImage(null);

  const navigateImage = (direction: "prev" | "next") => {
    if (!selectedImage) return;
    const currentIndex = filteredArtworks.findIndex(
      (art) => art.id === selectedImage
    );
    let newIndex = currentIndex;
    if (direction === "prev" && currentIndex > 0) newIndex = currentIndex - 1;
    else if (direction === "next" && currentIndex < filteredArtworks.length - 1)
      newIndex = currentIndex + 1;
    setSelectedImage(filteredArtworks[newIndex].id);
  };

  const selectedArtwork = artworks.find((art) => art.id === selectedImage);

  // Helper to determine grid span classes
  const getGridClass = (size: string) => {
    switch (size) {
      case "large":
        return "md:col-span-2 md:row-span-2";
      case "wide":
        return "md:col-span-2 md:row-span-1";
      case "tall":
        return "md:col-span-1 md:row-span-2";
      default:
        return "md:col-span-1 md:row-span-1";
    }
  };

  return (
    <div
      ref={galleryRef}
      className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black"
    >
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }

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
      {/* Navigation */}
      {/* Navigation */}
      <HomeNavbar />

      {/* Hero Section */}
      <header className="pt-32 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-12 container mx-auto">
        {/* Back Button */}
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
          <h1 className="text-[8vw] sm:text-[10vw] lg:text-[12vw] leading-[0.8] font-bold tracking-tighter uppercase text-white/90 mb-6 sm:mb-8 whitespace-nowrap perspective-1000">
            {Array.from(selectedCategory).map((char, i) => (
              <span key={i} className="hero-text-char inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <p className="gallery-subtitle text-white/60 text-base sm:text-lg lg:text-xl font-light">
            Explore our collection of {selectedCategory.toLowerCase()}{" "}
            photography
          </p>
        </div>
      </header>

      {/* Masonry Grid - No gaps, larger photos with margins */}
      <main className="px-4 sm:px-6 lg:px-12 pb-32 container mx-auto">
        <div
          ref={gridRef}
          className="columns-1 sm:columns-2 lg:columns-3 gap-0"
        >
          {filteredArtworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className="gallery-item group relative overflow-hidden cursor-pointer break-inside-avoid mb-0"
              onClick={() => openImage(artwork.id)}
              onMouseEnter={() => setHoveredId(artwork.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                perspective: "1000px",
              }}
            >
              <div className="relative w-full transform-gpu transition-all duration-1000 ease-out group-hover:scale-[1.02]">
                <Image
                  src={artwork.src}
                  alt={artwork.title}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover transition-all duration-1000 ease-out group-hover:brightness-110 group-hover:contrast-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index < 6}
                />

                {/* Gradient Overlay with slide effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Info Overlay with slide up animation */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                  <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                    <p className="text-xs font-mono text-white/80 mb-2 uppercase tracking-widest">
                      {artwork.category}
                    </p>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                      {artwork.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <span>{artwork.year}</span>
                      <span>•</span>
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

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white/0 group-hover:border-white/30 transition-all duration-700" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modern Lightbox */}
      {selectedImage && selectedArtwork && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center">
          {/* Controls */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[110]">
            <div className="text-white/50 font-mono text-sm">
              {String(
                filteredArtworks.findIndex((a) => a.id === selectedImage) + 1
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

          {/* Main Content */}
          <div className="w-full h-full flex flex-col lg:flex-row">
            {/* Image Area */}
            <div className="flex-1 relative h-full flex items-center justify-center p-4 lg:p-12">
              <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
                <Image
                  src={selectedArtwork.src}
                  alt={selectedArtwork.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Nav Buttons */}
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

            {/* Info Sidebar */}
            <div className="lg:w-[400px] bg-[#0f0f0f] border-l border-white/5 p-8 lg:p-12 flex flex-col justify-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">
                    {selectedArtwork.title}
                  </h2>
                  <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
                    {selectedArtwork.category} — {selectedArtwork.year}
                  </p>
                </div>

                <div className="space-y-6 text-white/60 leading-relaxed font-light">
                  <p>
                    Captured in {selectedArtwork.year}, this piece explores the
                    relationship between{" "}
                    {selectedArtwork.category.toLowerCase()} and light. The
                    composition invites the viewer to pause and reflect on the
                    subtle details often overlooked in our daily lives.
                  </p>
                  <p>
                    {selectedArtwork.description ||
                      "A unique perspective that challenges traditional boundaries of photography, creating a dialogue between the subject and the observer."}
                  </p>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
                  <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-white/90 transition-colors">
                    Acquire Print
                  </button>
                  <button className="w-full py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Gallery() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <GalleryContent />
    </Suspense>
  );
}
