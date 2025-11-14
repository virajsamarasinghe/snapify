"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AboutNew = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(".about-title-char", { y: 100, opacity: 0, rotation: -5 });
      gsap.set(".about-subtitle", { x: -50, opacity: 0 });
      gsap.set(".about-text", { y: 30, opacity: 0 });
      gsap.set(".about-image", { scale: 0.8, opacity: 0, rotation: -5 });
      gsap.set(".stat-card", { y: 50, opacity: 0, scale: 0.8 });
      gsap.set(".about-line", { scaleX: 0 });
      gsap.set(".about-cta", { scale: 0, opacity: 0 });
      gsap.set(".floating-element", { opacity: 0, scale: 0 });
      gsap.set(".quote-mark", { scale: 0, opacity: 0 });

      // Create main timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        }
      });

      // Animate title characters
      tl.to(".about-title-char", {
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
      tl.to(".about-subtitle", {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.4");

      // Animate image
      tl.to(".about-image", {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.6");

      // Animate text blocks
      tl.to(".about-text", {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.8");

      // Animate line
      tl.to(".about-line", {
        scaleX: 1,
        duration: 0.8,
        ease: "power3.inOut"
      }, "-=0.4");

      // Animate stats
      tl.to(".stat-card", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }, "-=0.4");

      // Animate quote marks
      tl.to(".quote-mark", {
        scale: 1,
        opacity: 0.1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.4");

      // Animate floating elements
      tl.to(".floating-element", {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)"
      }, "-=0.3");

      // Animate CTA
      tl.to(".about-cta", {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=0.2");

      // Parallax effect for image on scroll
      gsap.to(".about-image-inner", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      // Floating animation for elements
      gsap.to(".floating-element", {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        rotation: "random(-5, 5)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 2,
          from: "random"
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { number: "500+", label: "Projects", description: "Captured moments" },
    { number: "10+", label: "Years", description: "Of experience" },
    { number: "50+", label: "Awards", description: "Recognition" },
    { number: "100%", label: "Passion", description: "For photography" }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#0a0a0a] to-[#1a1a1a] overflow-hidden py-20 lg:py-32"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="floating-element absolute top-20 right-20 w-20 h-20 border border-white/10 rounded-full" />
      <div className="floating-element absolute bottom-40 left-20 w-32 h-32 border border-white/5 rounded-full" />
      <div className="floating-element absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="about-subtitle text-lg text-white/60 uppercase tracking-[0.3em] mb-4">
            The Artist
          </p>
          <h2 className="text-[3rem] lg:text-[6rem] font-bold mb-4 leading-[0.9]">
            <span className="inline-block bg-white text-black px-4">
              {Array.from("MY").map((char, i) => (
                <span
                  key={i}
                  className="about-title-char inline-block"
                >
                  {char}
                </span>
              ))}
            </span>
            <span className="inline-block mx-3">{"\u00A0"}</span>
            <span className="inline-block">
              {Array.from("STORY").map((char, i) => (
                <span
                  key={i + 10}
                  className="about-title-char inline-block text-white"
                >
                  {char}
                </span>
              ))}
            </span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-20">
          {/* Left: Image Composition */}
          <div ref={imageRef} className="relative">
            <div className="about-image relative aspect-[3/4] rounded-2xl overflow-hidden">
              <div className="about-image-inner absolute inset-0 scale-110">
                <Image
                  src="/about/man.webp"
                  alt="JK - Visual Storyteller"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 mix-blend-overlay" />

              {/* Floating text on image */}
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-white text-2xl font-bold mb-2">JK</p>
                <p className="text-white/80">Visual Storyteller & Artist</p>
              </div>
            </div>

            {/* Decorative elements around image */}
            <div className="absolute -top-4 -right-4 w-32 h-32 border-2 border-white/20 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 border border-white/10 rounded-full" />
          </div>

          {/* Right: Text Content */}
          <div ref={textRef} className="relative">
            {/* Large Quote Mark */}
            <div className="quote-mark absolute -top-10 -left-10 text-[200px] font-bold text-white/5 leading-none">
              "
            </div>

            <div className="relative z-10 space-y-6">
              <p className="about-text text-2xl lg:text-3xl font-medium text-white leading-relaxed">
                Photography isn't just about
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> capturing images</span>,
                it's about freezing emotions and telling stories that words cannot express.
              </p>

              <p className="about-text text-lg text-white/70 leading-relaxed">
                For over a decade, I've been on a journey to find beauty in the chaos,
                to reveal the extraordinary in the ordinary, and to create visual narratives
                that resonate with the human soul.
              </p>

              <p className="about-text text-lg text-white/70 leading-relaxed">
                My work spans across continents and cultures, from the bustling streets of Tokyo
                to the serene landscapes of Iceland, always seeking that perfect moment where
                light, emotion, and story converge.
              </p>
            </div>

            {/* Animated Line */}
            <div className="about-line h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-8 origin-left" />

            {/* CTA Button */}
            <div className="about-cta">
              <a
                href="#gallery"
                className="group inline-flex items-center gap-4 text-white border-2 border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 overflow-hidden relative"
              >
                <span className="relative z-10">Explore My Journey</span>
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
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card relative group"
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className={`p-8 rounded-2xl border transition-all duration-300 ${
                hoveredStat === index
                  ? 'border-white/30 bg-white/5'
                  : 'border-white/10 bg-white/[0.02]'
              }`}>
                <div className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-white/80 font-medium mb-1">{stat.label}</div>
                <div className="text-white/40 text-sm">{stat.description}</div>

                {/* Hover effect gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 transition-opacity duration-300 ${
                  hoveredStat === index ? 'opacity-100' : 'opacity-0'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutNew;