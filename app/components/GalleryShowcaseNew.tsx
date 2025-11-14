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
  size: 'small' | 'medium' | 'large';
}

const galleryItems: GalleryItem[] = [
  { id: 1, src: "/img1.jpg", title: "Urban Dreams", category: "Street", size: "large" },
  { id: 2, src: "/img2.jpg", title: "Silent Echoes", category: "Portrait", size: "medium" },
  { id: 3, src: "/img3.jpg", title: "Neon Nights", category: "Urban", size: "small" },
  { id: 4, src: "/img4.jpg", title: "Raw Emotions", category: "Documentary", size: "medium" },
  { id: 5, src: "/img5.jpg", title: "Golden Hour", category: "Landscape", size: "large" },
  { id: 6, src: "/img6.jpg", title: "Street Poetry", category: "Street", size: "small" },
  { id: 7, src: "/img7.jpg", title: "Intimate Moments", category: "Portrait", size: "medium" },
  { id: 8, src: "/img8.jpg", title: "City Lights", category: "Urban", size: "large" },
  { id: 9, src: "/img9.jpg", title: "Natural Beauty", category: "Landscape", size: "small" },
  { id: 10, src: "/img10.jpg", title: "Human Stories", category: "Documentary", size: "medium" },
  { id: 11, src: "/img11.jpg", title: "Abstract Reality", category: "Experimental", size: "large" },
  { id: 12, src: "/img12.jpg", title: "Timeless", category: "Portrait", size: "small" },
];

const GalleryShowcaseNew = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [filteredItems, setFilteredItems] = useState(galleryItems);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

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
      gsap.set(".gallery-title-char", { y: 100, opacity: 0, rotation: 5 });
      gsap.set(".gallery-subtitle", { x: 50, opacity: 0 });
      gsap.set(".filter-pill", { scale: 0, opacity: 0 });
      gsap.set(".gallery-item", { scale: 0.7, opacity: 0, rotation: "random(-10, 10)" });
      gsap.set(".gallery-cta", { y: 50, opacity: 0 });
      gsap.set(".floating-shape", { scale: 0, opacity: 0 });

      // Create main timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        }
      });

      // Animate title
      tl.to(".gallery-title-char", {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        stagger: {
          amount: 0.5,
          from: "random"
        },
        ease: "back.out(1.7)"
      });

      // Animate subtitle
      tl.to(".gallery-subtitle", {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.4");

      // Animate filter pills
      tl.to(".filter-pill", {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.out(1.7)"
      }, "-=0.3");

      // Animate gallery items with creative stagger
      tl.to(".gallery-item", {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        stagger: {
          amount: 0.8,
          grid: "auto",
          from: "center"
        },
        ease: "power3.out"
      }, "-=0.4");

      // Animate floating shapes
      tl.to(".floating-shape", {
        scale: 1,
        opacity: 0.1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      }, "-=0.5");

      // Animate CTA
      tl.to(".gallery-cta", {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.3");

      // Parallax effect for items on scroll
      gsap.to(".gallery-item", {
        y: (i, el) => {
          const speed = el.dataset.speed || 1;
          return -100 * speed;
        },
        ease: "none",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      // Floating animation for shapes
      gsap.to(".floating-shape", {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        rotation: "random(-15, 15)",
        duration: "random(4, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 3,
          from: "random"
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate filter changes
  useEffect(() => {
    if (!galleryRef.current) return;

    gsap.fromTo(".gallery-item",
      { scale: 0.7, opacity: 0, rotation: "random(-10, 10)" },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.5,
        stagger: {
          amount: 0.4,
          from: "random"
        },
        ease: "power3.out"
      }
    );
  }, [filteredItems]);

  const getItemClass = (size: string) => {
    switch(size) {
      case 'large':
        return 'lg:col-span-2 lg:row-span-2';
      case 'medium':
        return 'lg:col-span-1 lg:row-span-2';
      default:
        return 'lg:col-span-1 lg:row-span-1';
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#0a0a0a] to-[#0a0a0a] overflow-hidden py-20 lg:py-32"
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Shapes */}
      <div className="floating-shape absolute top-20 left-20 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
      <div className="floating-shape absolute bottom-20 right-20 w-60 h-60 rounded-full bg-gradient-to-br from-blue-500 to-green-500" />
      <div className="floating-shape absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="gallery-subtitle text-lg text-white/60 uppercase tracking-[0.3em] mb-4">
            Portfolio
          </p>
          <h2 className="text-[3rem] lg:text-[6rem] font-bold mb-4 leading-[0.9]">
            {Array.from("SELECTED").map((char, i) => (
              <span
                key={i}
                className="gallery-title-char inline-block text-white"
                style={{
                  textShadow: '0 0 60px rgba(255,255,255,0.3)',
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
            <br />
            {Array.from("WORKS").map((char, i) => (
              <span
                key={i}
                className="gallery-title-char inline-block"
                style={{
                  background: 'linear-gradient(90deg, #a855f7, #ec4899, #a855f7)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
          <p className="gallery-subtitle text-xl text-white/60 max-w-3xl mx-auto">
            A curated collection of moments that define my artistic journey
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`filter-pill px-6 py-3 rounded-full border-2 transition-all duration-300 font-medium ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent'
                  : 'bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid - Masonry Style */}
        <div
          ref={galleryRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`gallery-item group relative ${getItemClass(item.size)} cursor-pointer`}
              data-speed={0.5 + (index % 3) * 0.3}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => setSelectedImage(item)}
            >
              <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden">
                {/* Image */}
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500" />

                {/* Content Overlay */}
                <div className={`absolute bottom-0 left-0 right-0 p-6 transform transition-all duration-500 ${
                  hoveredItem === item.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70">{item.category}</p>

                  {/* View Icon */}
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 transition-colors duration-500 rounded-2xl pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center gallery-cta">
          <a
            href="/work"
            className="group inline-flex items-center gap-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-5 rounded-full text-lg font-medium hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1"
          >
            <span>View Full Portfolio</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-2 transition-transform"
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
          <p className="text-white/40 mt-4 text-sm">
            500+ projects waiting to inspire you
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            <Image
              src={selectedImage.src}
              alt={selectedImage.title}
              width={1200}
              height={800}
              className="object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GalleryShowcaseNew;