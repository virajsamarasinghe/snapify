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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN */}
          <div className="about-left-content lg:col-span-4 space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-6 mb-6">
                <svg className="w-12 h-12 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/>
                </svg>
                <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-wide">JK</h2>
              </div>
              <div className="h-0.5 w-20 bg-gradient-to-r from-purple-500 to-transparent mb-8 mx-auto lg:mx-0" />
              
              <p className="text-white/80 leading-relaxed text-lg lg:text-xl font-light">
                Crafting visual symphonies where light meets emotion. With over a decade of dedication, I don't just capture moments; I immortalize the untold stories hidden within them. My lens is a bridge between the seen and the unseen, revealing the extraordinary in the everyday.
              </p>
            </div>
          </div>

          {/* CENTER IMAGE */}
          <div className="lg:col-span-4 relative flex justify-center items-center order-1 lg:order-2 py-12 lg:py-0">
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
                 <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="about-right-content lg:col-span-4 space-y-10 text-center lg:text-left order-3">
            
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-6 mb-6">
                <svg className="w-12 h-12 text-pink-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="currentColor"/>
                </svg>
                <h3 className="text-3xl lg:text-4xl font-bold text-white tracking-wide">Beyond the Frame</h3>
              </div>
              <p className="text-white/80 text-lg lg:text-xl leading-relaxed font-light">
                An exploration of the human condition through the lens. My work invites you to pause, reflect, and see the world with renewed wonder. Spanning continents and cultures, each image is a testament to the universal language of visual art.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutNew;