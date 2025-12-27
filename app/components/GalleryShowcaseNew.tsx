"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import TransitionLink from "./TransitionLink";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CategoryItem {
  id: number;
  title: string;
  images: string[]; // Multiple images for rotation
  description: string;
  size: "small" | "medium" | "large";
}

const categories: CategoryItem[] = [
  {
    id: 1,
    title: "University",
    images: ["/img1.jpg", "/img2.jpg", "/img3.jpg"],
    description: "Capturing academic life and campus moments.",
    size: "large",
  },
  {
    id: 2,
    title: "Weddings",
    images: ["/img4.jpg", "/img5.jpg", "/img6.jpg"],
    description: "Preserving the magic of your special day.",
    size: "medium",
  },
  {
    id: 3,
    title: "Army",
    images: ["/img7.jpg", "/img8.jpg", "/img9.jpg"],
    description: "Documenting military life and ceremonies.",
    size: "medium",
  },
  {
    id: 4,
    title: "Events Coverage",
    images: ["/img10.jpg", "/img11.jpg", "/img12.jpg"],
    description: "Professional coverage of corporate and social events.",
    size: "large",
  },
  {
    id: 5,
    title: "School Events",
    images: [
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
    description: "Capturing the joy and energy of school activities.",
    size: "medium",
  },
  {
    id: 6,
    title: "World Photography",
    images: [
      "/gallery/world-photography/WhatsApp Image 2025-12-28 at 02.43.09.jpeg",
      "/gallery/world-photography/WhatsApp Image 2025-12-28 at 02.43.10.jpeg",
      "/gallery/world-photography/WhatsApp Image 2025-12-28 at 02.43.11.jpeg",
      "/gallery/world-photography/WhatsApp Image 2025-12-28 at 02.43.09 (1).jpeg",
      "/gallery/world-photography/WhatsApp Image 2025-12-28 at 02.43.10 (1).jpeg",
    ],
    description: "Exploring cultures and landscapes around the globe.",
    size: "medium",
  },
  {
    id: 7,
    title: "Wildlife",
    images: [
      "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.25.jpeg",
      "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.26.jpeg",
      "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.27.jpeg",
      "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.28.jpeg",
      "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.29.jpeg",
      "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.30.jpeg",
      "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.31.jpeg",
      "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.32.jpeg",
      "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.33.jpeg",
      "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.34.jpeg",
    ],
    description: "The beauty and wonder of nature's creatures.",
    size: "medium",
  },
];

const GalleryShowcaseNew = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [currentImages, setCurrentImages] = useState<{ [key: number]: number }>(
    {}
  );
  const [activeColorCard, setActiveColorCard] = useState<number | null>(null);
  const colorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize current image index for each category
  useEffect(() => {
    const initialImages: { [key: number]: number } = {};
    categories.forEach((cat) => {
      initialImages[cat.id] = 0;
    });
    setCurrentImages(initialImages);
  }, []);

  // Auto-rotate images for each category
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    categories.forEach((category, index) => {
      // Different interval for each category (5-8 seconds)
      const interval = setInterval(
        () => {
          setCurrentImages((prev) => ({
            ...prev,
            [category.id]: (prev[category.id] + 1) % category.images.length,
          }));
        },
        5000 + index * 500 // Stagger: 5s, 5.5s, 6s, 6.5s, 7s, 7.5s, 8s
      );
      intervals.push(interval);
    });

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, []);

  // Auto-cycle color through cards randomly
  useEffect(() => {
    let lastIndex = -1;

    const pickRandomCard = () => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * categories.length);
      } while (randomIndex === lastIndex && categories.length > 1);
      lastIndex = randomIndex;
      return categories[randomIndex].id;
    };

    const activateCard = () => {
      const cardId = pickRandomCard();
      console.log("Activating card:", cardId); // Debug log
      setActiveColorCard(cardId);

      // Clear any existing timeout
      if (colorTimeoutRef.current) {
        clearTimeout(colorTimeoutRef.current);
      }

      // After 2 seconds, remove color
      colorTimeoutRef.current = setTimeout(() => {
        console.log("Deactivating card"); // Debug log
        setActiveColorCard(null);
      }, 2000);
    };

    // Start immediately
    activateCard();

    // Then repeat every 4 seconds
    const colorCycle = setInterval(activateCard, 4000);

    return () => {
      clearInterval(colorCycle);
      if (colorTimeoutRef.current) {
        clearTimeout(colorTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(".gallery-header-line", { scaleX: 0 });
      gsap.set(".gallery-title-word", { y: 100, opacity: 0 });
      gsap.set(".gallery-subtitle", { y: 30, opacity: 0 });
      gsap.set(".gallery-item", {
        y: 80,
        opacity: 0,
      });
      gsap.set(".category-number", { opacity: 0, x: -20 });

      // Create main timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate header line
      tl.to(".gallery-header-line", {
        scaleX: 1,
        duration: 1,
        ease: "power3.inOut",
      });

      // Animate title
      tl.to(
        ".gallery-title-word",
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.5"
      );

      // Animate subtitle
      tl.to(
        ".gallery-subtitle",
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Animate gallery items
      tl.to(
        ".gallery-item",
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.3"
      );

      // Animate numbers
      tl.to(
        ".category-number",
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getItemClass = (size: string) => {
    switch (size) {
      case "large":
        return "lg:col-span-2 lg:row-span-2";
      case "medium":
        return "lg:col-span-1 lg:row-span-2";
      default:
        return "lg:col-span-1 lg:row-span-1";
    }
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#0a0a0a] to-[#0a0a0a] overflow-hidden py-20 lg:py-32"
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating Shapes */}
      <div className="floating-shape absolute top-20 left-20 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
      <div className="floating-shape absolute bottom-20 right-20 w-60 h-60 rounded-full bg-gradient-to-br from-blue-500 to-green-500" />
      <div className="floating-shape absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[6rem] font-bold mb-4 leading-[0.9]">
            <span className="inline-block bg-white text-black px-4">
              {Array.from("ART").map((char, i) => (
                <span key={i} className="gallery-title-char inline-block">
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
          <p className="gallery-subtitle text-base sm:text-lg md:text-xl text-white/60 max-w-3xl mx-auto px-4">
            Explore our curated collections by genre
          </p>
        </div>

        {/* Categories Grid */}
        <div
          ref={galleryRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20"
        >
          {categories.map((item, index) => (
            <TransitionLink
              key={item.id}
              href={`/gallery?category=${encodeURIComponent(item.title)}`}
              className={`gallery-item group relative ${getItemClass(
                item.size
              )} cursor-pointer block`}
              data-speed={0.5 + (index % 3) * 0.3}
            >
              <div
                className="relative w-full h-full min-h-[250px] sm:min-h-[300px] rounded-xl sm:rounded-2xl overflow-hidden"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Multiple Images with crossfade */}
                {item.images.map((img, imgIndex) => (
                  <div
                    key={imgIndex}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      currentImages[item.id] === imgIndex
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${item.title} ${imgIndex + 1}`}
                      fill
                      className={`object-cover transition-all duration-1000 ${
                        activeColorCard === item.id || hoveredItem === item.id
                          ? "grayscale-0"
                          : "grayscale"
                      }`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                ))}

                {/* Gradient Overlays */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 pointer-events-none ${
                    activeColorCard === item.id || hoveredItem === item.id
                      ? "opacity-100"
                      : "opacity-80"
                  }`}
                />

                {/* Content Overlay - shows on hover or when active */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 pointer-events-none">
                  <h3
                    className={`text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 transform transition-all duration-500 ${
                      activeColorCard === item.id || hoveredItem === item.id
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm sm:text-base text-white/70 leading-relaxed transform transition-all duration-500 ${
                      activeColorCard === item.id || hoveredItem === item.id
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    {item.description}
                  </p>

                  <div
                    className={`mt-4 inline-flex items-center gap-2 text-purple-400 font-medium transform transition-all duration-500 ${
                      activeColorCard === item.id || hoveredItem === item.id
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4"
                    }`}
                  >
                    <span>Explore Collection</span>
                    <svg
                      className="w-5 h-5"
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
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div
                  className={`absolute inset-0 border-2 transition-colors duration-500 rounded-2xl pointer-events-none ${
                    activeColorCard === item.id || hoveredItem === item.id
                      ? "border-white/20"
                      : "border-white/0"
                  }`}
                />
              </div>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryShowcaseNew;
