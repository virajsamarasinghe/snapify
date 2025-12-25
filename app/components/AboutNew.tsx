"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AboutNew = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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
          start: "top 60%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        }
      });

      // 1. Massive Text Reveal (Background Layer)
      tl.to(".big-text-layer", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out"
      });

      // 2. Image Reveal
      tl.to(".image-reveal", {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "expo.out"
      }, "-=0.8");

      // 3. Floating Content Card
      tl.to(".floating-card", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      }, "-=1");

      // 4. Vertical Stats
      tl.to(".stat-vertical", {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
      }, "-=0.5");

      // Parallax effect on scroll
      gsap.to(".big-text-layer", {
        y: (i, target) => -50 * (i + 1),
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[120vh] bg-[#050505] overflow-hidden flex items-center justify-center py-20 lg:py-0"
    >
      {/* Background Noise */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="1"/>
        </svg>
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12 h-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
        
        {/* LAYER 1: MASSIVE TYPOGRAPHY (Background) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full select-none pointer-events-none z-0 overflow-hidden mix-blend-difference">
          <h1 className="big-text-layer text-[18vw] lg:text-[22vw] font-black leading-[0.8] text-[#222] tracking-tighter whitespace-nowrap pl-4 lg:pl-0">
            VISUAL
          </h1>
          <h1 className="big-text-layer text-[18vw] lg:text-[22vw] font-black leading-[0.8] text-transparent stroke-text tracking-tighter ml-[10vw] lg:ml-[20vw]" style={{ WebkitTextStroke: '2px #222' }}>
            ARTIST
          </h1>
        </div>

        {/* LAYER 2: ASYMMETRIC IMAGE */}
        <div className="relative z-10 w-full lg:w-5/12 h-[60vh] lg:h-[80vh] flex items-center justify-center lg:justify-end">
          <div className="image-reveal relative w-[90%] lg:w-[80%] h-full grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out clip-path-slant">
            <Image
              src="/about/man.webp"
              alt="JK"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-transparent mix-blend-overlay" />
          </div>
        </div>

        {/* LAYER 3: FLOATING GLASS CARD (Content) */}
        <div className="relative z-20 w-full lg:w-5/12">
          <div className="floating-card bg-white/5 backdrop-blur-xl border border-white/10 p-8 lg:p-12 rounded-none border-l-4 border-l-purple-500 shadow-2xl">
            <span className="block text-purple-400 text-xs font-mono tracking-[0.3em] mb-6">
              // THE ARCHITECT OF LIGHT
            </span>
            
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              Beyond the <br/><span className="italic font-serif text-white/50">Frame</span>
            </h2>

            <p className="text-white/70 text-lg leading-relaxed font-light mb-8">
              My work is an exploration of the human condition. I don't just capture moments; I deconstruct them to reveal the raw emotion hidden beneath. A visual symphony where every shadow tells a story and every highlight sings.
            </p>

            <div className="flex gap-12 pt-8 border-t border-white/10">
              <div>
                <span className="block text-4xl font-bold text-white mb-1">12</span>
                <span className="text-xs text-white/40 uppercase tracking-widest">Years Experience</span>
              </div>
              <div>
                <span className="block text-4xl font-bold text-white mb-1">50+</span>
                <span className="text-xs text-white/40 uppercase tracking-widest">Global Exhibitions</span>
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
          -webkit-text-stroke: 2px #333;
        }
      `}</style>
    </section>
  );
};

export default AboutNew;