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
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(".about-left-content", { x: -50, opacity: 0 });
      gsap.set(".about-right-content", { x: 50, opacity: 0 });
      gsap.set(".center-image-container", { scale: 0.8, opacity: 0 });
      gsap.set(".circle-decoration", { scale: 0, opacity: 0 });
      gsap.set(".stat-item", { y: 30, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        }
      });

      // 1. Marquee Animation
      gsap.to(".marquee-container", {
        xPercent: -50,
        duration: 20,
        ease: "none",
        repeat: -1
      });

      // 2. Center Image & Circles
      tl.to(".center-image-container", {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "back.out(1.2)"
      }, "-=0.5");

      tl.to(".circle-decoration", {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      }, "-=0.8");

      // 3. Side Content
      tl.to([".about-left-content", ".about-right-content"], {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5");

      // 4. Stats
      tl.to(".stat-item", {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }, "-=0.3");

      // Floating animation for circles
      gsap.to(".circle-decoration.floating", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#0a0a0a] overflow-hidden py-20 lg:py-0 flex items-center"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Large Background Text - Marquee */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full pointer-events-none z-0 select-none overflow-hidden">
        <div className="marquee-container flex whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <h1 key={i} className="text-[15vw] lg:text-[18vw] font-bold leading-none text-white opacity-[0.03] px-10">
              VISUAL ARTIST
            </h1>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN */}
          <div className="about-left-content lg:col-span-3 space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <span className="text-purple-500 text-2xl">✻</span>
                <h2 className="text-3xl font-bold text-white">JK</h2>
              </div>
              <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 mx-auto lg:mx-0" />
              
              <p className="text-white/70 leading-relaxed text-sm lg:text-base">
                I'm a passionate Visual Storyteller with over a decade of experience crafting intuitive and emotion-driven digital experiences. 
                Specialized in capturing the raw beauty of the world, I turn complex moments into clean, elegant visual narratives.
              </p>
            </div>

            <div className="pt-4">
              {/* Buttons removed as requested */}
            </div>
          </div>

          {/* CENTER IMAGE */}
          <div className="lg:col-span-6 relative flex justify-center items-center order-1 lg:order-2">
            <div className="center-image-container relative w-full max-w-[500px] aspect-square flex items-center justify-center">
              
              {/* Decorative Circles Behind - Wrapped for perfect centering */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="circle-decoration w-[120%] h-[120%] border border-purple-500/20 rounded-full" />
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="circle-decoration floating w-[110%] h-[110%] border border-pink-500/20 rounded-full border-dashed" />
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="circle-decoration w-[100%] h-[100%] bg-gradient-to-b from-purple-500/10 to-transparent rounded-full blur-2xl" />
              </div>

              {/* Main Image */}
              <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 border-white/5">
                 <Image
                  src="/about/man.webp"
                  alt="JK"
                  fill
                  className="object-cover object-top"
                  priority
                 />
                 
                 {/* Gradient Overlay at bottom for seamless blend */}
                 <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="about-right-content lg:col-span-3 space-y-10 text-center lg:text-left order-3">
            
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <span className="text-pink-500 text-2xl">✻</span>
                <h3 className="text-xl font-bold text-white">Digital Domination</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Focused on user needs, interaction flow, and pixel-perfect detail to create products that truly connect.
                My work spans across continents and cultures.
              </p>
            </div>

            {/* Stats removed as requested */}

          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutNew;