"use client";

import { useEffect, useRef } from "react";
import { usePageTransition } from "../contexts/PageTransitionContext";
import gsap from "gsap";

export default function PageTransition() {
  const { isTransitioning, endTransition } = usePageTransition();
  const transitionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!isTransitioning || !transitionRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        // End transition after animation completes
        setTimeout(() => {
          endTransition();
        }, 200); // Small delay for smooth fade out
      }
    });

    timelineRef.current = tl;

    // Camera shutter effect - starts closed, opens to reveal new page
    tl.set(".transition-shutter-blade", {
      scaleY: 0,
      transformOrigin: "center"
    })
    .to(".transition-shutter-blade", {
      scaleY: 1,
      duration: 0.4,
      stagger: {
        each: 0.05,
        from: "edges"
      },
      ease: "power2.inOut"
    })

    // Aperture animation during shutter close
    .fromTo(".transition-aperture-blade",
      {
        scale: 0,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.03,
        ease: "back.out(1.2)"
      },
      "-=0.2"
    )

    // Focus ring pulse
    .fromTo(".transition-focus-ring",
      {
        scale: 0.8,
        opacity: 0
      },
      {
        scale: 1.2,
        opacity: 0.5,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      },
      "-=0.4"
    )

    // Loading text
    .fromTo(".transition-text",
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      },
      "-=0.6"
    )

    // Hold for a moment
    .set({}, {}, "+=0.3")

    // Fade out loading text
    .to(".transition-text", {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: "power2.in"
    })

    // Open shutter to reveal new page
    .to(".transition-aperture-blade", {
      scale: 3,
      opacity: 0,
      duration: 0.5,
      stagger: 0.02,
      ease: "power2.in"
    }, "-=0.1")

    .to(".transition-focus-ring", {
      scale: 2,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    }, "-=0.4")

    .to(".transition-shutter-blade:nth-child(odd)", {
      scaleY: 0,
      duration: 0.4,
      ease: "power2.inOut"
    }, "-=0.2")

    .to(".transition-shutter-blade:nth-child(even)", {
      scaleY: 0,
      duration: 0.4,
      ease: "power2.inOut"
    }, "-=0.3")

    // Fade out the entire overlay
    .to(transitionRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out"
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isTransitioning, endTransition]);

  if (!isTransitioning) return null;

  return (
    <div
      ref={transitionRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Camera Shutter Blades */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="transition-shutter-blade absolute w-full h-[12.5%] bg-black"
            style={{
              top: `${i * 12.5}%`,
              transformOrigin: i % 2 === 0 ? "top" : "bottom"
            }}
          />
        ))}
      </div>

      {/* Aperture Blades */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="transition-aperture-blade absolute"
              style={{
                width: "0",
                height: "0",
                borderLeft: "40px solid transparent",
                borderRight: "40px solid transparent",
                borderBottom: "150px solid rgba(255, 255, 255, 0.1)",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                transformOrigin: "50% 150px"
              }}
            />
          ))}
        </div>
      </div>

      {/* Focus Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3].map((ring) => (
          <div
            key={ring}
            className="transition-focus-ring absolute rounded-full border-2 border-white/20"
            style={{
              width: `${ring * 150}px`,
              height: `${ring * 150}px`
            }}
          />
        ))}
      </div>

      {/* Loading Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="transition-text text-white/60 text-sm tracking-[0.3em] uppercase">
          Loading
        </div>
      </div>
    </div>
  );
}