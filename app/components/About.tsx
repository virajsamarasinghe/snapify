"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const images = ["/about/man.jpeg", "/about/man2.jpeg", "/about/man3.jpeg"];

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [yearsCount, setYearsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const next = (prev + 1) % images.length;
        console.log("Changing image from", prev, "to", next);
        return next;
      });
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(imageRef.current, { scale: 1.2, opacity: 0 });
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(".about-content", { y: 50, opacity: 0 });
      gsap.set(".about-title-char", { y: 100, opacity: 0 });
      gsap.set(".about-text", { y: 30, opacity: 0 });
      gsap.set(".about-stat-item", { y: 20, opacity: 0 });

      // Create main timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate image first
      tl.to(imageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
      });

      // Animate overlay
      tl.to(
        overlayRef.current,
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.8"
      );

      // Animate title characters
      tl.to(
        ".about-title-char",
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.03,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Animate text content
      tl.to(
        ".about-text",
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Animate stats
      tl.to(
        ".about-stat-item",
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.3"
      );

      // Counter animation with separate ScrollTrigger
      ScrollTrigger.create({
        trigger: ".about-stat-item",
        start: "top 80%",
        once: true,
        onEnter: () => {
          // Animate counter for years
          const yearsObj = { val: 0 };
          gsap.to(yearsObj, {
            val: 10,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              setYearsCount(Math.ceil(yearsObj.val));
            },
          });

          // Animate counter for projects
          const projectsObj = { val: 0 };
          gsap.to(projectsObj, {
            val: 500,
            duration: 2.5,
            ease: "power2.out",
            onUpdate: () => {
              setProjectsCount(Math.ceil(projectsObj.val));
            },
          });

          // Animate counter for clients
          const clientsObj = { val: 0 };
          gsap.to(clientsObj, {
            val: 50,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              setClientsCount(Math.ceil(clientsObj.val));
            },
          });
        },
      });

      // Parallax effect for image on scroll
      gsap.to(imageRef.current, {
        yPercent: 15,
        ease: "none",
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
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Full-screen background image */}
      <div className="absolute inset-0">
        <div ref={imageRef} className="w-full h-full relative">
          {images.map((img, index) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={img}
                alt={`JK - Photographer ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                quality={100}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Gradient overlays for better text readability */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />

      {/* Content overlay */}
      <div className="relative z-10 h-full flex items-center justify-center px-6 lg:px-20">
        <div className="max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Title and main text */}
            <div className="space-y-8">
              <div className="overflow-hidden">
                <h2 className="text-[4rem] lg:text-[6rem] xl:text-[7rem] font-bold tracking-tight leading-[0.9] text-white">
                  {"BEHIND".split("").map((char, i) => (
                    <span key={i} className="about-title-char inline-block">
                      {char}
                    </span>
                  ))}
                  <br />
                  {"THE".split("").map((char, i) => (
                    <span
                      key={i}
                      className="about-title-char inline-block text-white/60"
                    >
                      {char}
                    </span>
                  ))}{" "}
                  {"LENS".split("").map((char, i) => (
                    <span
                      key={i}
                      className="about-title-char inline-block bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent"
                    >
                      {char}
                    </span>
                  ))}
                </h2>
              </div>

              <div className="space-y-6">
                <p className="about-text text-xl lg:text-2xl font-light leading-relaxed text-white/90">
                  I&apos;m JK, a visual storyteller who finds poetry in the
                  unscripted moments of life.
                </p>

                <p className="about-text text-base lg:text-lg leading-relaxed text-white/70">
                  My journey with photography began as a whisper—a quiet
                  fascination with how light dances across surfaces, how shadows
                  tell stories, and how a single frame can hold an entire
                  universe of emotion.
                </p>

                <p className="about-text text-base lg:text-lg leading-relaxed text-white/70">
                  Through my lens, I don&apos;t just capture images; I preserve
                  feelings, freeze time, and reveal the extraordinary hidden in
                  the ordinary.
                </p>
              </div>
            </div>

            {/* Right side - Stats */}
            <div className="flex flex-col justify-center space-y-8 lg:pl-12">
              <div className="about-stat-item space-y-2 border-l-2 border-white/30 pl-6">
                <p className="text-5xl lg:text-6xl font-bold text-white">
                  {yearsCount}+
                </p>
                <p className="text-sm lg:text-base uppercase tracking-widest text-white/60">
                  Years Experience
                </p>
              </div>

              <div className="about-stat-item space-y-2 border-l-2 border-white/30 pl-6">
                <p className="text-5xl lg:text-6xl font-bold text-white">
                  {projectsCount}+
                </p>
                <p className="text-sm lg:text-base uppercase tracking-widest text-white/60">
                  Projects Completed
                </p>
              </div>

              <div className="about-stat-item space-y-2 border-l-2 border-white/30 pl-6">
                <p className="text-5xl lg:text-6xl font-bold text-white">
                  {clientsCount}+
                </p>
                <p className="text-sm lg:text-base uppercase tracking-widest text-white/60">
                  Happy Clients
                </p>
              </div>

              <div className="about-stat-item pt-4">
                <a
                  href="#gallery"
                  className="inline-flex items-center gap-3 text-base lg:text-lg font-medium text-white border-2 border-white/40 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 group backdrop-blur-sm"
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
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-white/30 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default About;
