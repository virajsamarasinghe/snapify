"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(".about-title-word", { y: 100, opacity: 0 });
      gsap.set(imageContainerRef.current, { scale: 0.8, opacity: 0 });
      gsap.set(".about-text-line", { y: 30, opacity: 0 });
      gsap.set(".about-stat", { y: 20, opacity: 0 });
      gsap.set(".about-divider", { scaleX: 0 });
      gsap.set(".about-cta", { y: 20, opacity: 0 });
      gsap.set(".about-sidebar-divider", { scaleY: 0 });
      gsap.set(".about-sidebar-divider-right", { scaleY: 0 });
      gsap.set(".about-top-divider", { scaleX: 0 });

      // Create main timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate dividers first (similar to Hero section)
      tl.to([".about-sidebar-divider", ".about-sidebar-divider-right"], {
        scaleY: 1,
        duration: 0.6,
        ease: "power3.inOut",
        stagger: 0.1,
      });

      tl.to(
        ".about-top-divider",
        {
          scaleX: 1,
          duration: 0.6,
          ease: "power3.inOut",
        },
        "-=0.3"
      );

      // Animate title words
      tl.to(
        ".about-title-word",
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "power3.out",
        },
        "-=0.3"
      );

      // Animate image container
      tl.to(
        imageContainerRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Animate text lines
      tl.to(
        ".about-text-line",
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power3.out",
        },
        "-=0.5"
      );

      // Animate divider
      tl.to(
        ".about-divider",
        {
          scaleX: 1,
          duration: 0.5,
          ease: "power3.inOut",
        },
        "-=0.3"
      );

      // Animate stats
      tl.to(
        ".about-stat",
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power3.out",
        },
        "-=0.3"
      );

      // Animate CTA button
      tl.to(
        ".about-cta",
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
        },
        "-=0.2"
      );

      // Parallax effect for image on scroll
      gsap.to(imageRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: imageContainerRef.current,
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
      className="relative w-full min-h-screen bg-[#1a1a1a] overflow-hidden pt-24 pb-24 pl-6 lg:pl-[120px] pr-6 lg:pr-[120px]"
    >
      {/* Sidebar with vertical divider on left - matching Hero */}
      <div className="absolute top-0 left-0 w-20 h-full">
        <div className="about-sidebar-divider absolute right-0 top-0 w-px h-full bg-white/10 origin-top scale-y-0" />
      </div>

      {/* Right sidebar with vertical divider */}
      <div className="absolute top-0 right-0 w-20 h-full">
        <div className="about-sidebar-divider-right absolute left-0 top-0 w-px h-full bg-white/10 origin-top scale-y-0" />
      </div>

      {/* Top horizontal divider */}
      <div className="about-top-divider absolute left-0 top-20 w-full h-px bg-white/10 origin-left scale-x-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Section Title */}
        <div ref={titleRef} className="mb-16 overflow-hidden">
          <h2 className="text-[3rem] lg:text-[4rem] font-medium tracking-[-0.05rem] leading-[1.1] text-[#f5f5f5]">
            <span className="about-title-word inline-block">Behind</span>{" "}
            <span className="about-title-word inline-block">the</span>{" "}
            <span className="about-title-word inline-block bg-gradient-to-r from-[#f5f5f5] via-[#d0d0d0] to-[#f5f5f5] bg-clip-text text-transparent">
              Lens
            </span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left: Artist Image */}
          <div ref={imageContainerRef} className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
              <div ref={imageRef} className="absolute inset-0 scale-110">
                <Image
                  src="/about/man.jpeg"
                  alt="JK - Photographer"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent" />
            </div>

            {/* Floating accent elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border border-white/10 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-white/5 rounded-full" />
          </div>

          {/* Right: Artist Description */}
          <div ref={textContentRef} className="space-y-8">
            {/* Main description */}
            <div className="space-y-6">
              <p className="text-[1.5rem] lg:text-[1.75rem] font-medium leading-[1.4] text-[#f5f5f5]">
                <span className="about-text-line block">
                  I&apos;m JK, a visual storyteller who finds
                </span>
                <span className="about-text-line block">
                  poetry in the unscripted moments of life.
                </span>
              </p>

              <div className="space-y-4">
                <p className="text-base lg:text-lg leading-relaxed text-[#a0a0a0]">
                  <span className="about-text-line block">
                    My journey with photography began as a whisper—a quiet
                    fascination with how light dances across surfaces, how
                    shadows tell stories, and how a single frame can hold an
                    entire universe of emotion.
                  </span>
                </p>

                <p className="text-base lg:text-lg leading-relaxed text-[#a0a0a0]">
                  <span className="about-text-line block">
                    What started as curiosity evolved into passion, and passion
                    transformed into purpose. Through my lens, I don&apos;t just
                    capture images; I preserve feelings, freeze time, and reveal
                    the extraordinary hidden in the ordinary.
                  </span>
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="about-divider h-px bg-white/10 origin-left" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="about-stat">
                <p className="text-3xl font-medium text-[#f5f5f5]">10+</p>
                <p className="text-sm text-[#808080] mt-1">Years Experience</p>
              </div>
              <div className="about-stat">
                <p className="text-3xl font-medium text-[#f5f5f5]">500+</p>
                <p className="text-sm text-[#808080] mt-1">Projects Done</p>
              </div>
              <div className="about-stat">
                <p className="text-3xl font-medium text-[#f5f5f5]">50+</p>
                <p className="text-sm text-[#808080] mt-1">Happy Clients</p>
              </div>
            </div>

            {/* CTA */}
            <div className="about-cta">
              <a
                href="#gallery"
                className="inline-flex items-center gap-3 text-lg font-medium text-[#f5f5f5] border border-[#555] px-8 py-4 rounded-full hover:bg-[#f5f5f5] hover:text-[#0a0a0a] transition-all group"
              >
                <span>View My Work</span>
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
        </div>
      </div>
    </section>
  );
};

export default About;
