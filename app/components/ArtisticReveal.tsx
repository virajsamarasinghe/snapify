"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface ArtisticRevealProps {
  onRevealComplete?: () => void;
}

export default function ArtisticReveal({ onRevealComplete }: ArtisticRevealProps) {
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
    gsap.set(".shutter-blade", {
      scaleY: 1
    });

    gsap.set(".aperture-blade", {
      scale: 0,
      rotation: (i) => i * 45
    });

    gsap.set(".focus-ring", {
      scale: 0,
      opacity: 0
    });

    gsap.set(".artist-text", {
      opacity: 0,
      y: 30
    });

    gsap.set(".lens-flare", {
      scale: 0,
      opacity: 0
    });

    // Camera shutter effect animation
    tl.to(".shutter-blade:nth-child(odd)", {
      scaleY: 0,
      duration: 0.6,
      ease: "power2.inOut",
      stagger: 0.1
    })
    .to(".shutter-blade:nth-child(even)", {
      scaleY: 0,
      duration: 0.6,
      ease: "power2.inOut",
      stagger: 0.1
    }, "-=0.5")

    // Aperture blades animation
    .to(".aperture-blade", {
      scale: 1,
      duration: 0.8,
      stagger: 0.05,
      ease: "back.out(1.5)"
    }, "-=0.3")

    // Focus rings animation
    .to(".focus-ring", {
      scale: 1,
      opacity: 0.3,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out"
    }, "-=0.5")

    // Artist text reveal
    .to(".artist-text", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.8")

    // Lens flare effect
    .to(".lens-flare", {
      scale: 2,
      opacity: 0.6,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")
    .to(".lens-flare", {
      scale: 3,
      opacity: 0,
      duration: 0.8,
      ease: "power2.in"
    })

    // Aperture closing and rotating
    .to(".aperture-blade", {
      scale: 0,
      rotation: "+=180",
      duration: 0.8,
      stagger: 0.03,
      ease: "power2.in"
    }, "-=0.4")

    // Final fade out
    .to(container, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        container.style.display = 'none';
      }
    });

    // Film grain effect
    const grainAnimation = () => {
      const grain = document.querySelector('.film-grain');
      if (grain) {
        gsap.to(grain, {
          opacity: gsap.utils.random(0.03, 0.08),
          duration: 0.1,
          onComplete: grainAnimation
        });
      }
    };
    grainAnimation();

    // Cleanup
    return () => {
      tl.kill();
    };
  }, [onRevealComplete]);

  if (!isAnimating) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-black overflow-hidden"
    >
      {/* Camera shutter effect */}
      <div className="absolute inset-0 flex flex-col">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="shutter-blade flex-1 bg-black origin-top"
            style={{
              background: i % 2 === 0 ? '#0a0a0a' : '#141414'
            }}
          />
        ))}
      </div>

      {/* Aperture blades in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[400px] h-[400px]">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aperture-blade absolute inset-0"
              style={{
                transformOrigin: 'center'
              }}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: '30px solid transparent',
                  borderRight: '30px solid transparent',
                  borderTop: '200px solid rgba(255, 255, 255, 0.1)',
                  filter: 'blur(1px)'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Focus rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="focus-ring absolute rounded-full border border-white/20"
            style={{
              width: `${300 + i * 150}px`,
              height: `${300 + i * 150}px`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <div className="artist-text mb-2">
            <p className="text-white/60 text-xs uppercase tracking-[0.5em]">
              Photography & Visual Arts
            </p>
          </div>

          <div className="artist-text mb-4">
            <h1 className="text-6xl lg:text-8xl font-bold text-white">
              SNAPIFY
            </h1>
          </div>

          <div className="artist-text">
            <p className="text-white/40 text-sm">
              Capturing Moments • Creating Art
            </p>
          </div>

          {/* Camera viewfinder corners */}
          <div className="absolute -inset-20">
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white/30" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-white/30" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-white/30" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-white/30" />

            {/* Center focus point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 border border-white/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-red-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Lens flare */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="lens-flare w-96 h-96 rounded-full bg-gradient-radial from-white/30 via-purple-500/10 to-transparent blur-xl" />
      </div>

      {/* Film grain overlay */}
      <div className="film-grain absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply'
        }}
      />

      {/* Photography metadata display */}
      <div className="absolute bottom-8 left-8 text-white/30 text-xs font-mono">
        <div className="artist-text">f/1.4 • 1/125 • ISO 100</div>
      </div>

      <div className="absolute bottom-8 right-8 text-white/30 text-xs font-mono">
        <div className="artist-text">35mm • RAW</div>
      </div>

      <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .lens-flare {
          animation: flicker 3s infinite;
        }
      `}</style>
    </div>
  );
}