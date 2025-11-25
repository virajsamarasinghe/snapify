"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "../components/TransitionLink";

gsap.registerPlugin(ScrollTrigger);

interface Artwork {
  id: number;
  src: string;
  title: string;
  category: string;
  year: string;
  description?: string;
  size: 'small' | 'medium' | 'large' | 'tall' | 'wide';
}

// Extended artwork collection with size attributes for the mosaic layout
const artworks: Artwork[] = [
  { id: 1, src: "/gallery/mountain-solitude.jpg", title: "Mountain Solitude", category: "Landscape", year: "2024", size: "large" },
  { id: 2, src: "/gallery/desert-dreams.jpg", title: "Desert Dreams", category: "Landscape", year: "2024", size: "tall" },
  { id: 3, src: "/gallery/abstract-reality.jpg", title: "Abstract Reality", category: "Abstract", year: "2023", size: "small" },
  { id: 4, src: "/gallery/urban-poetry.jpg", title: "Urban Poetry", category: "Street", year: "2024", size: "wide" },
  { id: 5, src: "/gallery/neon-nights.jpg", title: "Neon Nights", category: "Urban", year: "2023", size: "medium" },
  { id: 6, src: "/gallery/silent-moments.jpg", title: "Silent Moments", category: "Portrait", year: "2024", size: "tall" },
  { id: 7, src: "/gallery/time-suspended.jpg", title: "Time Suspended", category: "Conceptual", year: "2023", size: "small" },
  { id: 8, src: "/gallery/rhythm-of-life.jpg", title: "Rhythm of Life", category: "Music", year: "2024", size: "medium" },
  { id: 9, src: "/gallery/dance-of-shadows.jpg", title: "Dance of Shadows", category: "Performance", year: "2023", size: "wide" },
  { id: 10, src: "/gallery/mountain-solitude.jpg", title: "Morning Light", category: "Landscape", year: "2024", size: "small" },
  { id: 11, src: "/gallery/desert-dreams.jpg", title: "Golden Hour", category: "Landscape", year: "2024", size: "medium" },
  { id: 12, src: "/gallery/abstract-reality.jpg", title: "Color Theory", category: "Abstract", year: "2023", size: "tall" },
  { id: 13, src: "/gallery/urban-poetry.jpg", title: "City Lights", category: "Street", year: "2024", size: "large" },
  { id: 14, src: "/gallery/neon-nights.jpg", title: "Night Life", category: "Urban", year: "2023", size: "wide" },
  { id: 15, src: "/gallery/silent-moments.jpg", title: "Reflection", category: "Portrait", year: "2024", size: "medium" },
];

const categories = ["All", "Landscape", "Portrait", "Street", "Urban", "Abstract", "Conceptual"];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredArtworks = useMemo(() => selectedCategory === "All"
    ? artworks
    : artworks.filter(art => art.category === selectedCategory), [selectedCategory]);

  // Animation for category change
  useEffect(() => {
    if (!gridRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(".gallery-item", 
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [selectedCategory]);

  // Initial Page Animation
  useEffect(() => {
    if (!galleryRef.current) return;

    const ctx = gsap.context(() => {
      // Hero Text Animation
      gsap.fromTo(".hero-text-char",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.02, ease: "power4.out" }
      );

      gsap.fromTo(".category-pill",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.5, ease: "back.out(1.7)" }
      );
    }, galleryRef);

    return () => ctx.revert();
  }, []);

  const openImage = (id: number) => setSelectedImage(id);
  const closeImage = () => setSelectedImage(null);

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    const currentIndex = filteredArtworks.findIndex(art => art.id === selectedImage);
    let newIndex = currentIndex;
    if (direction === 'prev' && currentIndex > 0) newIndex = currentIndex - 1;
    else if (direction === 'next' && currentIndex < filteredArtworks.length - 1) newIndex = currentIndex + 1;
    setSelectedImage(filteredArtworks[newIndex].id);
  };

  const selectedArtwork = artworks.find(art => art.id === selectedImage);

  // Helper to determine grid span classes
  const getGridClass = (size: string) => {
    switch (size) {
      case 'large': return 'md:col-span-2 md:row-span-2';
      case 'wide': return 'md:col-span-2 md:row-span-1';
      case 'tall': return 'md:col-span-1 md:row-span-2';
      default: return 'md:col-span-1 md:row-span-1';
    }
  };

  return (
    <div ref={galleryRef} className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <TransitionLink href="/" className="text-xl font-bold tracking-tighter uppercase">
          Snapify
        </TransitionLink>
        <div className="flex gap-6 text-sm font-medium uppercase tracking-widest">
          <TransitionLink href="/" className="hover:opacity-50 transition-opacity">Home</TransitionLink>
          <TransitionLink href="/work" className="hover:opacity-50 transition-opacity">Work</TransitionLink>
          <span className="opacity-50 cursor-default">Gallery</span>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-20 px-6 lg:px-12 container mx-auto">
        <div className="overflow-hidden">
          <h1 className="text-[12vw] leading-[0.8] font-bold tracking-tighter uppercase text-white/90 mb-8">
            {Array.from("Visuals").map((char, i) => (
              <span key={i} className="hero-text-char inline-block">{char}</span>
            ))}
            <br />
            {Array.from("Archive").map((char, i) => (
              <span key={i + 10} className="hero-text-char inline-block text-white/40">{char}</span>
            ))}
          </h1>
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-3 mt-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-pill px-6 py-2 rounded-full border border-white/10 text-sm uppercase tracking-wider transition-all duration-300 hover:border-white/40 ${
                selectedCategory === category ? 'bg-white text-black border-white' : 'bg-transparent text-white/60'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Mosaic Grid */}
      <main className="px-4 lg:px-12 pb-32 container mx-auto">
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[300px]">
          {filteredArtworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className={`gallery-item group relative overflow-hidden rounded-sm bg-white/5 cursor-pointer ${getGridClass(artwork.size)}`}
              onClick={() => openImage(artwork.id)}
              onMouseEnter={() => setHoveredId(artwork.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Image
                src={artwork.src}
                alt={artwork.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 4}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs font-mono text-white/70 mb-2 uppercase tracking-widest">{artwork.category}</p>
                  <h3 className="text-xl font-bold text-white">{artwork.title}</h3>
                </div>
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
              {String(filteredArtworks.findIndex(a => a.id === selectedImage) + 1).padStart(2, '0')} / {String(filteredArtworks.length).padStart(2, '0')}
            </div>
            <button 
              onClick={closeImage}
              className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <span className="text-sm font-mono uppercase tracking-widest">Close</span>
              <div className="w-8 h-8 flex items-center justify-center border border-white/20 rounded-full group-hover:border-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
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
                onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Info Sidebar */}
            <div className="lg:w-[400px] bg-[#0f0f0f] border-l border-white/5 p-8 lg:p-12 flex flex-col justify-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">{selectedArtwork.title}</h2>
                  <p className="text-white/40 font-mono text-sm uppercase tracking-widest">{selectedArtwork.category} — {selectedArtwork.year}</p>
                </div>
                
                <div className="space-y-6 text-white/60 leading-relaxed font-light">
                  <p>
                    Captured in {selectedArtwork.year}, this piece explores the relationship between {selectedArtwork.category.toLowerCase()} and light. The composition invites the viewer to pause and reflect on the subtle details often overlooked in our daily lives.
                  </p>
                  <p>
                    {selectedArtwork.description || "A unique perspective that challenges traditional boundaries of photography, creating a dialogue between the subject and the observer."}
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
