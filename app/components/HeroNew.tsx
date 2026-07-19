"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import HomeNavbar from "./HomeNavbar";

interface HeroImage {
  src: string;
  title?: string;
  category?: string;
}

interface HeroNewProps {
  animationReady?: boolean;
  heroImages?: HeroImage[];
}

export default function HeroNew({
  animationReady = true,
  heroImages = [],
}: HeroNewProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    facebook: "",
    tiktok: "",
  });

  useEffect(() => {
    fetch("/api/settings/public", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) =>
        setSocialLinks({
          instagram: d.instagram || "",
          facebook: d.facebook || "",
          tiktok: d.tiktok || "",
        }),
      )
      .catch(() => {});
  }, []);

  // Default fallback images
  const defaultImages = [
    {
      src: "https://res.cloudinary.com/deu8faspx/image/upload/v1780906950/snapify/hero/itubfpcrg8yaie5cjsvg.jpg",
      title: "Urban Dreams",
      category: "Street",
    },
    {
      src: "https://res.cloudinary.com/deu8faspx/image/upload/v1780906917/snapify/hero/cuqs4e2sdzrlv2asytz0.jpg",
      title: "Silent Moments",
      category: "Portrait",
    },
  ];

  // Only use defaultImages if heroImages is completely undefined,
  // if it's an empty array (meaning they hid everything), use a safe fallback.
  const featuredImages =
    heroImages && heroImages.length > 0 ? heroImages : defaultImages;

  // Indicator lines: show at most 5, as a sliding window following the current slide
  const indicatorWindowSize = Math.min(5, featuredImages.length);
  const indicatorStart = Math.max(
    0,
    Math.min(
      currentImage - Math.floor(indicatorWindowSize / 2),
      featuredImages.length - indicatorWindowSize,
    ),
  );
  const indicatorItems = featuredImages
    .slice(indicatorStart, indicatorStart + indicatorWindowSize)
    .map((img, i) => ({ img, index: indicatorStart + i }));

  useEffect(() => {
    // Mouse movement effect
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX - 100,
          y: e.clientY - 100,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Auto-rotate images
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % featuredImages.length);
    }, 4000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, [featuredImages.length]);

  useEffect(() => {
    if (!heroRef.current || !animationReady) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(".hero-title-char", { y: 120, opacity: 0, rotation: 5 });
      gsap.set(".hero-subtitle", { y: 30, opacity: 0 });
      gsap.set(".hero-description", { y: 30, opacity: 0 });
      gsap.set(".hero-nav", { y: -100 });
      gsap.set(".hero-sidebar", { x: -100 });
      gsap.set(".hero-cta", { scale: 0, opacity: 0 });
      gsap.set(".image-counter", { opacity: 0 });
      gsap.set(".hero-overlay", { scaleY: 1 });

      const tl = gsap.timeline();

      // Reveal overlay animation
      tl.to(".hero-overlay", {
        scaleY: 0,
        duration: 1.2,
        ease: "power3.inOut",
        transformOrigin: "bottom",
      });

      // Animate navigation
      tl.to(
        ".hero-nav",
        {
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.6",
      );

      // Animate sidebar
      tl.to(
        ".hero-sidebar",
        {
          x: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.8",
      );

      // Animate main title with staggered characters
      tl.to(
        ".hero-title-char",
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 1,
          stagger: {
            amount: 0.8,
            from: "random",
          },
          ease: "back.out(1.7)",
        },
        "-=0.5",
      );

      // Animate subtitle
      tl.to(
        ".hero-subtitle",
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.3",
      );

      // Animate description
      tl.to(
        ".hero-description",
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5",
      );

      // Animate CTA
      tl.to(
        ".hero-cta",
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.3",
      );

      // Animate image counter
      tl.to(
        ".image-counter",
        {
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.2",
      );
    }, heroRef);

    return () => ctx.revert();
  }, [animationReady]);

  // Separate effect for social links pulsing animation
  useEffect(() => {
    const socialLinks = document.querySelectorAll(".sidebar-social-link");
    if (!socialLinks.length) return;

    const pulseAnimation = () => {
      socialLinks.forEach((link, index) => {
        setTimeout(() => {
          gsap.to(link, {
            color: "#ffffff",
            duration: 1.2,
            ease: "sine.inOut",
            onComplete: () => {
              gsap.to(link, {
                color: "rgba(255, 255, 255, 0.6)",
                duration: 1.2,
                ease: "sine.inOut",
              });
            },
          });
        }, index * 1200); // Stagger by 1200ms for smoother sequence
      });
    };

    // Start first pulse after initial animations complete (around 8 seconds)
    const initialDelay = setTimeout(() => {
      pulseAnimation();
      // Repeat every 10 seconds for a more relaxed rhythm
      const interval = setInterval(pulseAnimation, 10000);

      return () => clearInterval(interval);
    }, 8000);

    return () => clearTimeout(initialDelay);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full bg-black overflow-hidden h-screen min-h-screen"
      style={{ height: "100dvh", minHeight: "100dvh" }}
    >
      {/* Overlay for entrance animation */}
      <div className="hero-overlay absolute inset-0 bg-[#0a0a0a] z-50 pointer-events-none" />

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-[200px] h-[200px] pointer-events-none z-40 mix-blend-difference hidden lg:block"
      >
        <div className="w-full h-full border border-white/20 rounded-full flex items-center justify-center">
          <span className="text-white/60 text-xs uppercase tracking-widest">
            Explore
          </span>
        </div>
      </div>

      {/* Navigation */}
      <HomeNavbar animateOnMount={false} />

      {/* Sidebar */}
      <div className="hero-sidebar fixed left-0 top-0 h-full w-20 hidden lg:flex flex-col items-center justify-center z-20">
        <div className="flex flex-col items-center gap-16">
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-social-link text-white/60 hover:text-white transition-colors transform -rotate-90 whitespace-nowrap text-sm"
            >
              Instagram
            </a>
          )}
          {socialLinks.facebook && (
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-social-link text-white/60 hover:text-white transition-colors transform -rotate-90 whitespace-nowrap text-sm"
            >
              Facebook
            </a>
          )}
          {socialLinks.tiktok && (
            <a
              href={socialLinks.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-social-link text-white/60 hover:text-white transition-colors transform -rotate-90 whitespace-nowrap text-sm"
            >
              TikTok
            </a>
          )}
        </div>
      </div>

      {/* Full Background Images */}
      <div className="absolute inset-0">
        {featuredImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img.src}
              alt={img.title || "Hero Image"}
              fill
              className={`object-cover transition-transform duration-8000 ${
                index === currentImage ? "scale-110" : "scale-100"
              }`}
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}

        {/* Mobile full-screen overlay \u2014 prevents bright image center showing */}
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/0 to-black/95 lg:hidden" />
        {/* Desktop overlay \u2014 subtle bottom fade only */}
        <div className="absolute bottom-0 left-0 right-0 h-[70vh] bg-linear-to-t from-black/90 via-black/40 to-transparent hidden lg:block" />
      </div>

      {/* Main Content */}
      <div className="relative h-full lg:px-20">
        {/* Hero Text - Positioned Bottom Left */}
        <div
          className="absolute bottom-16 sm:bottom-12 left-5 sm:left-8 lg:left-20 z-20 text-left w-[calc(100%-2.5rem)] sm:w-auto sm:max-w-2xl lg:max-w-4xl"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mb-2 sm:mb-4">
            <p className="hero-subtitle text-xs sm:text-base lg:text-xl text-white/70 uppercase tracking-[0.25em] font-light">
              Professional Photographer &middot; Ratmalana, Sri Lanka
            </p>
          </div>

          <h1 className="hero-title text-[2.6rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7.5rem] font-bold leading-[0.95] mb-3 sm:mb-5">
            <span className="sr-only">
              Jagath Kalupahana &mdash; Professional Photographer in Sri Lanka
            </span>
            {Array.from("CAPTURING").map((char, i) => (
              <span
                key={i}
                className="hero-title-char inline-block text-white"
                style={{ textShadow: "0 0 80px rgba(255,255,255,0.5)" }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
            <br />
            {Array.from("MOMENTS").map((char, i) => (
              <span
                key={i}
                className="hero-title-char inline-block"
                style={{
                  background: "linear-gradient(90deg, #fff, #888, #fff)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "none",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>

          <p className="hero-description text-xs sm:text-base lg:text-xl text-white/70 max-w-sm sm:max-w-lg mb-5 sm:mb-7 leading-relaxed">
            Award-winning photographer based in Ratmalana, Sri Lanka &mdash;
            specialising in weddings, wildlife, graduation events &amp; fine-art
            photography for over 12 years.
          </p>

          <div className="hero-cta-wrapper inline-block">
            <button
              onClick={() => {
                const gallerySection = document.getElementById("gallery");
                if (gallerySection) {
                  gallerySection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="hero-cta group relative inline-flex items-center justify-center gap-3 bg-white text-black px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm sm:text-lg font-medium overflow-hidden cursor-pointer z-50"
            >
              <span className="relative z-10 whitespace-nowrap">
                View My Portfolio
              </span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform relative z-10"
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
              <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
          </div>
        </div>

        {/* Image Indicators \u2014 bottom-right desktop, bottom-right mobile (above text area) */}
        <div className="image-counter absolute bottom-4 left-1/2 -translate-x-1/2 sm:bottom-12 sm:left-auto sm:translate-x-0 sm:right-8 lg:right-20 flex flex-col items-center sm:items-end gap-3 z-30 max-w-[calc(100%-2.5rem)]">
          {/* Category label \u2014 desktop only */}
          <div className="hidden lg:block mb-2 text-right">
            <p className="text-white/40 text-sm uppercase tracking-widest mb-1">
              Current Collection
            </p>
            <p className="text-white text-xl font-light tracking-wide">
              {featuredImages[currentImage]?.category || "Featured"}
            </p>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-3">
            {indicatorItems.map(({ img, index }) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className="relative group py-2"
                aria-label={`View ${img.title || "Image"}`}
              >
                <div
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    index === currentImage
                      ? "bg-white w-6 sm:w-16"
                      : "bg-white/40 w-3 sm:w-8 sm:hover:w-10 hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
