"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Photo list for carousel
const photos = [
  "/about/man.jpeg",
  "/about/man2.jpeg",
  "/about/man3.jpeg",
];

const AboutNew = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const zoomControlRef = useRef<HTMLDivElement>(null);

  // Handle drag on zoom control
  const handleZoomDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const relativeY = clientY - rect.top;
    const percentage = Math.max(0, Math.min(1, relativeY / rect.height));
    const newIndex = Math.round(percentage * (photos.length - 1));

    setCurrentPhotoIndex(newIndex);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleZoomDrag(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const percentage = Math.max(0, Math.min(1, relativeY / rect.height));
      const newIndex = Math.round(percentage * (photos.length - 1));
      setCurrentPhotoIndex(newIndex);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  // Handle scroll only on zoom control area with wheel rotation
  useEffect(() => {
    const handleZoomScroll = (e: WheelEvent) => {
      if (!zoomControlRef.current) return;

      const rect = zoomControlRef.current.getBoundingClientRect();
      const isOverZoomControl =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isOverZoomControl) {
        e.preventDefault();

        // Rotate the wheel based on scroll delta
        setRotation((prev) => prev + e.deltaY * 0.5);

        // Scroll down = next photo, scroll up = previous photo
        if (e.deltaY > 0) {
          setCurrentPhotoIndex((prev) => {
            let newIndex = prev + 1;
            if (newIndex >= photos.length) newIndex = 0;
            return newIndex;
          });
        } else if (e.deltaY < 0) {
          setCurrentPhotoIndex((prev) => {
            let newIndex = prev - 1;
            if (newIndex < 0) newIndex = photos.length - 1;
            return newIndex;
          });
        }
      }
    };

    window.addEventListener("wheel", handleZoomScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleZoomScroll);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(".big-text-layer", { y: 100, opacity: 0 });
      gsap.set(".floating-card", { y: 50, opacity: 0 });
      gsap.set(".image-reveal", { scale: 1.2, opacity: 0 });
      gsap.set(".stat-vertical", { x: 50, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Massive Text Reveal (Background Layer)
      tl.to(".big-text-layer", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
      });

      // 2. Image Reveal
      tl.to(
        ".image-reveal",
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "expo.out",
        },
        "-=0.8"
      );

      // 3. Floating Content Card
      tl.to(
        ".floating-card",
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        },
        "-=1"
      );

      // 4. Vertical Stats
      tl.to(
        ".stat-vertical",
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      );

      // Parallax effect on scroll
      gsap.to(".big-text-layer", {
        y: (i, target) => -50 * (i + 1),
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen bg-[#050505] overflow-hidden flex items-center justify-center py-20 lg:py-32"
    >
      {/* Background Noise */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#noiseFilter)"
            opacity="1"
          />
        </svg>
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 h-full flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-24">
        {/* LAYER 1: MASSIVE TYPOGRAPHY (Background) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full select-none pointer-events-none z-0 overflow-hidden mix-blend-difference">
          <h1 className="big-text-layer text-[15vw] sm:text-[18vw] lg:text-[22vw] font-black leading-[0.8] text-[#222] tracking-tighter whitespace-nowrap pl-2 sm:pl-4 lg:pl-0">
            VISUAL
          </h1>
          <h1
            className="big-text-layer text-[15vw] sm:text-[18vw] lg:text-[22vw] font-black leading-[0.8] text-transparent stroke-text tracking-tighter ml-[8vw] sm:ml-[10vw] lg:ml-[20vw]"
            style={{ WebkitTextStroke: "1px #222" }}
          >
            ARTIST
          </h1>
        </div>

        {/* LAYER 2: ASYMMETRIC IMAGE WITH CAROUSEL */}
        <div className="relative z-10 w-full lg:w-5/12 h-[50vh] sm:h-[60vh] lg:h-[80vh] flex items-center justify-center lg:justify-end">
          <div className="image-reveal relative w-[95%] sm:w-[90%] lg:w-[80%] h-full grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out clip-path-slant overflow-hidden">
            {/* Multiple images with diagonal slide animation */}
            {photos.map((photo, index) => (
              <div
                key={photo}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  currentPhotoIndex === index
                    ? "opacity-100 translate-x-0 translate-y-0"
                    : currentPhotoIndex > index ||
                      (currentPhotoIndex === 0 && index === photos.length - 1)
                    ? "opacity-0 translate-x-[-100%] translate-y-[100%]"
                    : "opacity-0 translate-x-[-100%] translate-y-[-100%]"
                }`}
              >
                <Image
                  src={photo}
                  alt={`Portfolio ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-transparent mix-blend-overlay" />

            {/* iPhone-style Curved Camera Zoom Control - Right Side */}
            <div
              ref={zoomControlRef}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20"
            >
              {/* Curved Track Container with Continuous Wheel Rotation */}
              <div
                className="relative w-16 h-64 sm:w-20 sm:h-80 transition-transform duration-200 ease-out"
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                {/* Curved Background Track */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 80 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Curved path background */}
                  <path
                    d="M 40 20 Q 60 160 40 300"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Blur background */}
                  <path
                    d="M 40 20 Q 60 160 40 300"
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="20"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#blurZoom)"
                  />
                  <defs>
                    <filter id="blurZoom">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
                    </filter>
                  </defs>
                </svg>

                {/* Zoom Out Button (Top) */}
                <button
                  onClick={() => {
                    setCurrentPhotoIndex((prev) => {
                      let newIndex = prev - 1;
                      if (newIndex < 0) newIndex = photos.length - 1;
                      return newIndex;
                    });
                  }}
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-black/80 transition-all duration-300 active:scale-90 z-10"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M20 12H4"
                    />
                  </svg>
                </button>

                {/* Draggable Track Area */}
                <div
                  ref={trackRef}
                  onMouseDown={handleMouseDown}
                  onTouchStart={(e) => {
                    setIsDragging(true);
                    handleZoomDrag(e);
                  }}
                  onTouchMove={(e) => {
                    if (isDragging) handleZoomDrag(e);
                  }}
                  onTouchEnd={() => setIsDragging(false)}
                  className="absolute inset-0 cursor-pointer select-none"
                >
                  {/* Zoom Level Dots along curve */}
                  {photos.map((_, index) => {
                    const percentage = index / (photos.length - 1);
                    const y = 20 + percentage * 280;
                    const x = 40 + Math.sin(percentage * Math.PI) * 20;

                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`absolute rounded-full transition-all duration-300 ${
                          currentPhotoIndex === index
                            ? "w-4 h-4 bg-white scale-125 shadow-lg shadow-white/50"
                            : "w-3 h-3 bg-white/50 hover:bg-white/80 hover:scale-110"
                        }`}
                        style={{
                          left: `${x}px`,
                          top: `${y}px`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    );
                  })}
                </div>

                {/* Zoom In Button (Bottom) */}
                <button
                  onClick={() => {
                    setCurrentPhotoIndex((prev) => {
                      let newIndex = prev + 1;
                      if (newIndex >= photos.length) newIndex = 0;
                      return newIndex;
                    });
                  }}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-black/80 transition-all duration-300 active:scale-90 z-10"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              {/* Zoom Level Text */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white text-xs font-medium bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 whitespace-nowrap">
                {currentPhotoIndex + 1}x
              </div>
            </div>

            {/* Photo indicator dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    currentPhotoIndex === index ? "bg-white w-8" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* LAYER 3: FLOATING GLASS CARD (Content) */}
        <div className="relative z-20 w-full lg:w-5/12">
          <div className="floating-card bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 lg:p-12 rounded-none border-l-4 border-l-purple-500 shadow-2xl">
            <span className="block text-purple-400 text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6">
              // THE ARCHITECT OF LIGHT
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              Beyond the <br />
              <span className="italic font-serif text-white/50">Frame</span>
            </h2>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed font-light mb-6 sm:mb-8">
              My work is an exploration of the human condition. I don't just
              capture moments; I deconstruct them to reveal the raw emotion
              hidden beneath. A visual symphony where every shadow tells a story
              and every highlight sings.
            </p>

            <div className="flex gap-8 sm:gap-12 pt-6 sm:pt-8 border-t border-white/10">
              <div>
                <span className="block text-3xl sm:text-4xl font-bold text-white mb-1">
                  12
                </span>
                <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest">
                  Years Experience
                </span>
              </div>
              <div>
                <span className="block text-3xl sm:text-4xl font-bold text-white mb-1">
                  50+
                </span>
                <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest">
                  Global Exhibitions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .clip-path-slant {
          clip-path: polygon(10% 0, 100% 0, 100% 90%, 0% 100%);
        }
        .stroke-text {
          -webkit-text-stroke: 1px #333;
        }

        @media (min-width: 640px) {
          .stroke-text {
            -webkit-text-stroke: 1.5px #333;
          }
        }

        @media (min-width: 1024px) {
          .stroke-text {
            -webkit-text-stroke: 2px #333;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutNew;
