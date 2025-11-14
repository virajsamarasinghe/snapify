"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GalleryItem {
  id: number;
  src: string;
  title: string;
  category: string;
  year: string;
}

const galleryItems: GalleryItem[] = [
  { id: 1, src: "/img1.jpg", title: "Urban Dreams", category: "Street", year: "2024" },
  { id: 2, src: "/img2.jpg", title: "Silent Echoes", category: "Portrait", year: "2024" },
  { id: 3, src: "/img3.jpg", title: "Neon Nights", category: "Urban", year: "2023" },
  { id: 4, src: "/img4.jpg", title: "Raw Emotions", category: "Documentary", year: "2024" },
  { id: 5, src: "/img5.jpg", title: "Golden Hour", category: "Landscape", year: "2023" },
  { id: 6, src: "/img6.jpg", title: "Street Poetry", category: "Street", year: "2024" },
  { id: 7, src: "/img7.jpg", title: "Intimate Moments", category: "Portrait", year: "2023" },
  { id: 8, src: "/img8.jpg", title: "City Lights", category: "Urban", year: "2024" },
  { id: 9, src: "/img9.jpg", title: "Natural Beauty", category: "Landscape", year: "2023" },
  { id: 10, src: "/img10.jpg", title: "Human Stories", category: "Documentary", year: "2024" },
  { id: 11, src: "/img11.jpg", title: "Abstract Reality", category: "Experimental", year: "2024" },
  { id: 12, src: "/img12.jpg", title: "Timeless", category: "Portrait", year: "2023" },
];

const GalleryShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [filteredItems, setFilteredItems] = useState(galleryItems);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const categories = ["All", "Street", "Portrait", "Urban", "Landscape", "Documentary", "Experimental"];

  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredItems(galleryItems);
    } else {
      setFilteredItems(galleryItems.filter(item => item.category === activeFilter));
    }
  }, [activeFilter]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(".gallery-title-word", { y: 100, opacity: 0 });
      gsap.set(".gallery-subtitle", { y: 30, opacity: 0 });
      gsap.set(".filter-button", { y: 20, opacity: 0 });
      gsap.set(".gallery-item", { scale: 0.8, opacity: 0 });
      gsap.set(".gallery-divider", { scaleX: 0 });
      gsap.set(".gallery-sidebar-left", { scaleY: 0 });
      gsap.set(".gallery-sidebar-right", { scaleY: 0 });
      gsap.set(".gallery-top-divider", { scaleX: 0 });

      // Create main timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        }
      });

      // Animate vertical dividers
      tl.to([".gallery-sidebar-left", ".gallery-sidebar-right"], {
        scaleY: 1,
        duration: 0.6,
        ease: "power3.inOut",
        stagger: 0.1
      });

      // Animate top horizontal divider
      tl.to(".gallery-top-divider", {
        scaleX: 1,
        duration: 0.6,
        ease: "power3.inOut"
      }, "-=0.3");

      // Animate title
      tl.to(".gallery-title-word", {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out"
      }, "-=0.3");

      // Animate subtitle
      tl.to(".gallery-subtitle", {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out"
      }, "-=0.4");

      // Animate divider
      tl.to(".gallery-divider", {
        scaleX: 1,
        duration: 0.5,
        ease: "power3.inOut"
      }, "-=0.3");

      // Animate filter buttons
      tl.to(".filter-button", {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.03,
        ease: "power3.out"
      }, "-=0.3");

      // Animate gallery items
      tl.to(".gallery-item", {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: {
          amount: 0.4,
          from: "start"
        },
        ease: "power3.out"
      }, "-=0.3");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate filter changes
  useEffect(() => {
    if (!galleryRef.current) return;

    gsap.fromTo(".gallery-item",
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out"
      }
    );
  }, [filteredItems]);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative w-full min-h-screen bg-[#1a1a1a] overflow-hidden pt-24 pb-24 pl-6 lg:pl-[120px] pr-6 lg:pr-[120px]"
    >
      {/* Left sidebar with vertical divider */}
      <div className="absolute top-0 left-0 w-20 h-full">
        <div className="gallery-sidebar-left absolute right-0 top-0 w-px h-full bg-white/10 origin-top" />
      </div>

      {/* Right sidebar with vertical divider */}
      <div className="absolute top-0 right-0 w-20 h-full">
        <div className="gallery-sidebar-right absolute left-0 top-0 w-px h-full bg-white/10 origin-top" />
      </div>

      {/* Top horizontal divider */}
      <div className="gallery-top-divider absolute left-0 top-20 w-full h-px bg-white/10 origin-left" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-[3rem] lg:text-[4rem] font-medium tracking-[-0.05rem] leading-[1.1] text-[#f5f5f5] mb-4">
            <span className="gallery-title-word inline-block">Selected</span>{" "}
            <span className="gallery-title-word inline-block bg-gradient-to-r from-[#f5f5f5] via-[#d0d0d0] to-[#f5f5f5] bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="gallery-subtitle text-lg text-[#a0a0a0] max-w-2xl mx-auto">
            A curated collection of moments frozen in time, each telling its own unique story through light and shadow
          </p>
        </div>

        {/* Divider */}
        <div className="gallery-divider h-px bg-white/10 mb-12 origin-left" />

        {/* Filter Buttons */}
        <div ref={filterRef} className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`filter-button px-6 py-2 rounded-full border transition-all duration-300 ${
                activeFilter === category
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-[#a0a0a0] border-[#555] hover:text-white hover:border-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div
          ref={galleryRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="gallery-item group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Image */}
              <div className="absolute inset-0 bg-black">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className={`transform transition-all duration-500 ${
                  hoveredItem === item.id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}>
                  <h3 className="text-xl font-medium text-white mb-1">{item.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <span>{item.category}</span>
                    <span className="w-1 h-1 bg-white/50 rounded-full" />
                    <span>{item.year}</span>
                  </div>
                </div>
              </div>

              {/* Border effect on hover */}
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-colors duration-500 rounded-xl pointer-events-none" />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <a
            href="/work"
            className="inline-flex items-center gap-3 text-lg font-medium text-[#f5f5f5] border border-[#555] px-8 py-4 rounded-full hover:bg-[#f5f5f5] hover:text-[#0a0a0a] transition-all group"
          >
            <span>Explore Full Portfolio</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default GalleryShowcase;