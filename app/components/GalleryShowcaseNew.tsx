"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CategoryItem {
  id: number;
  title: string;
  image: string;
  description: string;
  size: 'small' | 'medium' | 'large';
}

const categories: CategoryItem[] = [
  { 
    id: 1, 
    title: "Street Photography", 
    image: "/img1.jpg", 
    description: "Capturing the raw and candid moments of urban life.",
    size: "large" 
  },
  { 
    id: 2, 
    title: "Portrait", 
    image: "/img2.jpg", 
    description: "Exploring the depth of human emotion and character.",
    size: "medium" 
  },
  { 
    id: 3, 
    title: "Urban Architecture", 
    image: "/img8.jpg", 
    description: "The geometry and soul of modern cityscapes.",
    size: "medium" 
  },
  { 
    id: 4, 
    title: "Landscape", 
    image: "/img5.jpg", 
    description: "The breathtaking beauty of the natural world.",
    size: "large" 
  },
  { 
    id: 5, 
    title: "Documentary", 
    image: "/img4.jpg", 
    description: "Telling powerful stories through visual narratives.",
    size: "medium" 
  },
  { 
    id: 6, 
    title: "Experimental", 
    image: "/img11.jpg", 
    description: "Pushing the boundaries of traditional photography.",
    size: "medium" 
  },
];

const GalleryShowcaseNew = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(".gallery-title-char", { y: 100, opacity: 0, rotation: 5 });
      gsap.set(".gallery-subtitle", { x: 50, opacity: 0 });
      gsap.set(".gallery-item", { scale: 0.7, opacity: 0, rotation: "random(-10, 10)" });
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



    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
          <h2 className="text-[3rem] lg:text-[6rem] font-bold mb-4 leading-[0.9]">
            <span className="inline-block bg-white text-black px-4">
              {Array.from("ART").map((char, i) => (
                <span
                  key={i}
                  className="gallery-title-char inline-block"
                >
                  {char}
                </span>
              ))}
            </span>
            <br />
            <span className="inline-block">
              {Array.from("CATEGORIES").map((char, i) => (
                <span
                  key={i + 20}
                  className="gallery-title-char inline-block text-white"
                >
                  {char}
                </span>
              ))}
            </span>
          </h2>
          <p className="gallery-subtitle text-xl text-white/60 max-w-3xl mx-auto">
            Explore our curated collections by genre
          </p>
        </div>

        {/* Categories Grid */}
        <div
          ref={galleryRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {categories.map((item, index) => (
            <div
              key={item.id}
              className={`gallery-item group relative ${getItemClass(item.size)} cursor-pointer`}
              data-speed={0.5 + (index % 3) * 0.3}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => setSelectedCategory(item)}
            >
              <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden">
                {/* Image */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-all duration-500">
                  <h3 className="text-3xl font-bold text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">{item.title}</h3>
                  <p className={`text-white/70 transform transition-all duration-500 ${
                    hoveredItem === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    {item.description}
                  </p>

                  <div className={`mt-4 inline-flex items-center gap-2 text-purple-400 font-medium transform transition-all duration-500 ${
                    hoveredItem === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}>
                    <span>Explore Collection</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 transition-colors duration-500 rounded-2xl pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Modal */}
      {selectedCategory && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setSelectedCategory(null)}
        >
          <div 
            className="relative bg-[#1a1a1a] rounded-3xl overflow-hidden max-w-4xl w-full border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2">
              {/* Image Side */}
              <div className="relative h-[300px] md:h-auto min-h-[400px]">
                <Image
                  src={selectedCategory.image}
                  alt={selectedCategory.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content Side */}
              <div className="p-8 md:p-12 flex flex-col justify-center bg-[#1a1a1a]">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">{selectedCategory.title}</h3>
                <p className="text-white/60 text-lg mb-8 leading-relaxed">
                  {selectedCategory.description}
                </p>
                <div className="space-y-4">
                  <Link
                    href="/gallery"
                    className="block w-full text-center bg-white text-black font-bold py-4 px-8 rounded-full hover:bg-white/90 transition-colors uppercase tracking-wider"
                  >
                    Go to Gallery
                  </Link>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="block w-full text-center border border-white/20 text-white font-medium py-4 px-8 rounded-full hover:bg-white/5 transition-colors uppercase tracking-wider"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            {/* Close Button Top Right */}
            <button
              onClick={() => setSelectedCategory(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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