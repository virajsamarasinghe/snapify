"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

interface HeroNewProps {
  animationReady?: boolean;
}

export default function HeroNew({ animationReady = true }: HeroNewProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      setMousePosition({ x: e.clientX, y: e.clientY });

      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX - 100,
          y: e.clientY - 100,
          duration: 0.5,
          ease: "power2.out"
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
      gsap.set(".hero-image", { scale: 1.2, opacity: 0 });
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
        transformOrigin: "bottom"
      });

      // Animate navigation
      tl.to(".hero-nav", {
        y: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.6");

      // Animate sidebar
      tl.to(".hero-sidebar", {
        x: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8");

      // Animate main title with staggered characters
      tl.to(".hero-title-char", {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 1,
        stagger: {
          amount: 0.8,
          from: "random"
        },
        ease: "back.out(1.7)"
      }, "-=0.5");

      // Animate subtitle
      tl.to(".hero-subtitle", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.3");

      // Animate images
      tl.to(".hero-image", {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out"
      }, "-=0.5");

      // Animate floating elements
      tl.to(".floating-text", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.5");

      // Animate CTA
      tl.to(".hero-cta", {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.3");

      // Animate image counter
      tl.to(".image-counter", {
        opacity: 1,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.2");

      // Parallax effect on scroll
      gsap.to(".hero-image", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, [animationReady]);

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
          <span className="text-white/60 text-xs uppercase tracking-widest">Explore</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hero-nav fixed top-0 left-0 w-full px-8 lg:px-12 py-6 flex justify-between items-center z-30 mix-blend-difference">
        <div className="flex items-center gap-12">
          <a href="/" className="text-3xl font-bold text-white">
            JK
          </a>
          <div className="hidden lg:flex items-center gap-8">
            <a href="/work" className="text-white/80 hover:text-white transition-colors">Work</a>
            <a href="#gallery" className="text-white/80 hover:text-white transition-colors">Gallery</a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
            <a href="/marketplace" className="text-white/80 hover:text-white transition-colors">Marketplace</a>
          </div>
        </div>
        <a href="#" className="text-white border border-white/30 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all">
          Let's Talk
        </a>
      </nav>

      {/* Sidebar */}
      <div className="hero-sidebar fixed left-0 top-0 h-full w-20 flex flex-col items-center justify-center z-20">
        <div className="flex flex-col items-center gap-16">
          <a href="#" className="text-white/60 hover:text-white transition-colors transform -rotate-90 whitespace-nowrap text-sm">
            Instagram
          </a>
          <a href="#" className="text-white/60 hover:text-white transition-colors transform -rotate-90 whitespace-nowrap text-sm">
            Behance
          </a>
          <a href="#" className="text-white/60 hover:text-white transition-colors transform -rotate-90 whitespace-nowrap text-sm">
            Dribbble
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative h-full flex items-center justify-center px-8 lg:px-20">
        {/* Background Images Grid */}
        <div className="absolute inset-0 grid grid-cols-3 gap-4 p-20 opacity-30">
          {featuredImages.map((img, index) => (
            <div
              key={index}
              className={`hero-image relative overflow-hidden rounded-2xl ${
                index === currentImage ? 'z-10 scale-105' : 'z-0'
              }`}
              style={{
                gridColumn: index === 0 ? 'span 2' : 'span 1',
                gridRow: index === 0 ? 'span 2' : 'span 1',
              }}
            >
              <Image
                src={img.src}
                alt={img.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ))}
        </div>

        {/* Hero Text */}
        <div className="relative z-20 text-center max-w-6xl mx-auto">
          <div className="mb-6">
            <p className="hero-subtitle text-lg lg:text-xl text-white/60 uppercase tracking-[0.3em] font-light">
              Visual Storyteller
            </p>
          </div>

          <h1 className="text-[4rem] lg:text-[8rem] font-bold leading-[0.9] mb-8">
            {Array.from("CAPTURING").map((char, i) => (
              <span
                key={i}
                className="hero-title-char inline-block text-white"
                style={{
                  textShadow: '0 0 80px rgba(255,255,255,0.5)',
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
                  background: 'linear-gradient(90deg, #fff, #888, #fff)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none',
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>

          <p className="hero-subtitle text-xl lg:text-2xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            Through my lens, I transform fleeting instants into timeless art,
            revealing beauty in the raw, unscripted moments of life.
          </p>

          <div className="hero-cta inline-block">
            <a
              href="/work"
              className="group relative inline-flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full text-lg font-medium overflow-hidden"
            >
              <span className="relative z-10">View My Portfolio</span>
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
            </a>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="floating-text absolute top-1/4 right-12 lg:right-20 text-right">
          <p className="text-white/40 text-sm uppercase tracking-widest mb-2">Portfolio</p>
          <p className="text-4xl font-bold text-white">500+</p>
          <p className="text-white/60">Projects</p>
        </div>

        <div className="floating-text absolute bottom-1/4 left-12 lg:left-20">
          <p className="text-white/40 text-sm uppercase tracking-widest mb-2">Experience</p>
          <p className="text-4xl font-bold text-white">10+</p>
          <p className="text-white/60">Years</p>
        </div>

        {/* Image Counter */}
        <div className="image-counter absolute bottom-8 right-8 lg:right-12 flex items-center gap-2">
          {featuredImages.map((_, index) => (
            <div
              key={index}
              className={`w-12 h-1 rounded-full transition-all duration-500 ${
                index === currentImage ? 'bg-white w-24' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-white/30 relative overflow-hidden">
          <div className="absolute top-0 w-full h-1/3 bg-white animate-bounce" />
        </div>
      </div>
    </section>
  );
}