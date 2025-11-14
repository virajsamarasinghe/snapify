"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
  CustomEase.create("smooth", "0.25, 0.46, 0.45, 0.94");
}

interface PageRevealProps {
  onRevealComplete?: () => void;
}

export default function PageReveal({ onRevealComplete }: PageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create main timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        if (onRevealComplete) {
          onRevealComplete();
        }
      }
    });

    // Set initial states
    gsap.set(".reveal-overlay", {
      scaleY: 1,
      transformOrigin: "bottom"
    });

    gsap.set(".reveal-text-wrapper", {
      opacity: 1
    });

    gsap.set(".reveal-letter", {
      y: 50,
      opacity: 0
    });

    gsap.set(".reveal-line", {
      scaleX: 0,
      transformOrigin: "left"
    });

    gsap.set(".reveal-counter", {
      opacity: 1
    });

    // Counter animation
    let counter = { value: 0 };

    // Start animations
    tl.to(counter, {
      value: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const progress = Math.round(counter.value);
        const counterElement = document.querySelector(".counter-number");
        if (counterElement) {
          counterElement.textContent = progress.toString().padStart(3, '0');
        }
      }
    })
    // Animate letters smoothly without rotation
    .to(".reveal-letter", {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: {
        each: 0.02,
        from: "start"
      },
      ease: "power2.out"
    }, 0.3)
    // Animate decorative lines
    .to(".reveal-line", {
      scaleX: 1,
      duration: 1,
      stagger: 0.2,
      ease: "power3.inOut"
    }, 0.5)
    // Fade out counter
    .to(".reveal-counter", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    }, 2)
    // Fade out text without scaling
    .to(".reveal-text-wrapper", {
      opacity: 0,
      duration: 0.6,
      ease: "power2.in"
    }, 2.2)
    // Split screen reveal effect
    .to(".reveal-overlay-left", {
      xPercent: -100,
      duration: 1.2,
      ease: "power4.inOut"
    }, 2.8)
    .to(".reveal-overlay-right", {
      xPercent: 100,
      duration: 1.2,
      ease: "power4.inOut"
    }, 2.8)
    // Scale and fade the entire container
    .to(container, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        container.style.display = 'none';
      }
    }, 3.5);

    // Add floating particles animation
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'reveal-particle';
      container.appendChild(particle);

      const size = gsap.utils.random(2, 6);
      const duration = gsap.utils.random(2, 4);

      gsap.set(particle, {
        width: size,
        height: size,
        left: gsap.utils.random(0, window.innerWidth),
        bottom: -20,
        opacity: gsap.utils.random(0.3, 0.7)
      });

      gsap.to(particle, {
        y: -(window.innerHeight + 100),
        x: gsap.utils.random(-100, 100),
        opacity: 0,
        duration: duration,
        ease: "power1.out",
        onComplete: () => {
          particle.remove();
        }
      });
    };

    // Generate particles periodically during loading
    const particleInterval = setInterval(() => {
      if (isAnimating) {
        createParticle();
      }
    }, 150);

    // Cleanup
    return () => {
      clearInterval(particleInterval);
      tl.kill();
    };
  }, [onRevealComplete, isAnimating]);

  if (!isAnimating) return null;

  // Split text into individual letters for animation
  const splitText = (text: string) => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className="reveal-letter inline-block"
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
    >
      {/* Split screen overlays */}
      <div className="reveal-overlay reveal-overlay-left absolute left-0 top-0 w-1/2 h-full bg-black z-30" />
      <div className="reveal-overlay reveal-overlay-right absolute right-0 top-0 w-1/2 h-full bg-black z-30" />

      {/* Main content */}
      <div className="reveal-text-wrapper relative z-40">
        {/* Decorative lines */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[200px]">
          <div className="reveal-line h-[1px] bg-gradient-to-r from-transparent via-white to-transparent mb-2" />
        </div>

        {/* Main text */}
        <div className="text-center">
          <h1 className="text-7xl lg:text-9xl font-bold text-white mb-4 tracking-tight">
            {splitText("SNAPIFY")}
          </h1>

          <div className="overflow-hidden">
            <p className="text-white/60 text-sm uppercase tracking-[0.5em] transform">
              {splitText("VISUAL ARTISTRY")}
            </p>
          </div>
        </div>

        {/* Bottom decorative lines */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[200px]">
          <div className="reveal-line h-[1px] bg-gradient-to-r from-transparent via-white to-transparent mt-2" />
        </div>

        {/* Counter */}
        <div className="reveal-counter absolute -bottom-32 left-1/2 -translate-x-1/2">
          <div className="flex items-baseline gap-2">
            <span className="counter-number text-white text-2xl font-light tracking-wider">000</span>
            <span className="text-white/40 text-xs">%</span>
          </div>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-white/20" />
      <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-white/20" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-white/20" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-white/20" />

      {/* Animated gradient background */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <style jsx>{`
        .reveal-particle {
          position: absolute;
          background: linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #ec4899 100%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 20;
        }

        .reveal-letter {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}