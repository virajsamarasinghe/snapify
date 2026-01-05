"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import TransitionLink from "./TransitionLink";
import HomeNavbar from "./HomeNavbar";

interface HeroNewProps {
  animationReady?: boolean;
}

export default function HeroNew({ animationReady = true }: HeroNewProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(0);

  // Featured images for the hero
  const featuredImages = [
    { src: "/hero/1.jpg", title: "Urban Dreams", category: "Street" },
    { src: "/hero/2.jpg", title: "Silent Moments", category: "Portrait" },
    { src: "/hero/3.jpg", title: "Neon Nights", category: "Urban" },
    { src: "/hero/4.jpg", title: "Raw Emotions", category: "Documentary" },
    { src: "/hero/5.jpg", title: "Golden Hour", category: "Landscape" },
  ];

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
      gsap.set(".floating-text", { opacity: 0, y: 20 });
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
        "-=0.6"
      );

      // Animate sidebar
      tl.to(
        ".hero-sidebar",
        {
          x: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.8"
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
        "-=0.5"
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
        "-=0.3"
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
        "-=0.5"
      );

      // Animate floating elements
      tl.to(
        ".floating-text",
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.5"
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
        "-=0.3"
      );

      // Animate image counter
      tl.to(
        ".image-counter",
        {
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.2"
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
      className="relative w-full h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] overflow-hidden"
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
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-social-link text-white/60 hover:text-white transition-colors transform -rotate-90 whitespace-nowrap text-sm"
          >
            Instagram
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-social-link text-white/60 hover:text-white transition-colors transform -rotate-90 whitespace-nowrap text-sm"
          >
            Facebook
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-social-link text-white/60 hover:text-white transition-colors transform -rotate-90 whitespace-nowrap text-sm"
          >
            TikTok
          </a>
        </div>
      </div>


      {/* Main Content */}
      <div className="relative h-full px-8 lg:px-20">
        {/* Full Background Images */}
        <div className="absolute inset-0">
          {featuredImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  className={`object-cover transition-transform duration-[8000ms] ${
                    index === currentImage ? "scale-110" : "scale-100"
                  }`}
                  priority={index === 0}
                />
              </div>
              {/* Subtle bottom gradient for text readability only */}
              <div className="absolute bottom-0 left-0 right-0 h-[70vh] bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>
          ))}
        </div>

        {/* Hero Text - Positioned Bottom Left */}
        <div className="absolute bottom-12 left-8 lg:left-20 z-20 text-left max-w-4xl">
          <div className="mb-4">
            <p className="hero-subtitle text-lg lg:text-xl text-white/60 uppercase tracking-[0.3em] font-light">
              Visual Storyteller
            </p>
          </div>

          <h1 className="hero-title text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7.5rem] font-bold leading-[0.9] mb-6">
            {Array.from("CAPTURING").map((char, i) => (
              <span
                key={i}
                className="hero-title-char inline-block text-white"
                style={{
                  textShadow: "0 0 80px rgba(255,255,255,0.5)",
                }}
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

          <p className="hero-description text-base sm:text-lg md:text-xl text-white/70 max-w-xl mb-8 leading-relaxed">
            Through my lens, I transform fleeting instants into timeless art,
            revealing beauty in the raw, unscripted moments of life.
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
              className="hero-cta group relative inline-flex items-center justify-center gap-4 bg-white text-black px-8 py-4 rounded-full text-lg font-medium overflow-hidden cursor-pointer z-50"
            >
              <span className="relative z-10 whitespace-nowrap">
                View My Portfolio
              </span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform relative z-10"
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
          </div>
        </div>

        {/* Image Counter / Indicators - Bottom Right on Desktop, Top Right on Mobile */}
        <div className="image-counter absolute top-28 right-8 lg:top-auto lg:bottom-12 lg:right-20 flex flex-col items-end gap-4 z-30">
           {/* Current Image Category Display */}
           <div className="mb-4 text-right">
             <p className="text-white/40 text-sm uppercase tracking-widest mb-1">Current Collection</p>
             <p className="text-white text-xl font-light tracking-wide">
               {featuredImages[currentImage].category}
             </p>
           </div>
           
           <div className="flex items-center gap-3">
            {featuredImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className="relative group"
                aria-label={`View ${img.title}`}
              >
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${
                    index === currentImage
                      ? "bg-white w-16"
                      : "bg-white/30 w-8 hover:w-12 hover:bg-white/50"
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
