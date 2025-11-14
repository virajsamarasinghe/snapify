"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    const progress = progressRef.current;
    const percentage = percentageRef.current;
    const text = textRef.current;

    if (!loader || !progress || !percentage || !text) return;

    // Create loading animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Animate out the loading screen
        gsap.to(loader, {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
          onComplete: () => {
            if (onLoadingComplete) {
              onLoadingComplete();
            }
            // Don't manually remove from DOM - let React handle it
          }
        });
      }
    });

    // Set initial states
    gsap.set(progress, { width: "0%" });
    gsap.set(".loading-text-char", { y: 100, opacity: 0 });
    gsap.set(".loading-subtitle", { opacity: 0, y: 20 });

    // Animate loading text characters
    tl.to(".loading-text-char", {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.05,
      ease: "power3.out"
    })
    .to(".loading-subtitle", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4");

    // Animate progress bar with percentage counter
    let progressObj = { value: 0 };
    tl.to(progressObj, {
      value: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const currentProgress = Math.round(progressObj.value);
        if (percentage) {
          percentage.textContent = currentProgress + "%";
        }
        gsap.set(progress, { width: currentProgress + "%" });
      }
    }, "-=1");

    // Add pulsing effect to loading text
    gsap.to(".loading-text-char", {
      scale: 1.05,
      duration: 0.6,
      stagger: {
        each: 0.1,
        repeat: -1,
        yoyo: true
      },
      ease: "power2.inOut"
    });

    // Cleanup
    return () => {
      tl.kill();
    };
  }, [onLoadingComplete]);

  // Split text into characters for animation
  const splitText = (text: string) => {
    return text.split("").map((char, i) => (
      <span key={i} className="loading-text-char inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background gradient animation */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-[#1a1a1a] to-black animate-gradient" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo/Brand */}
        <div ref={textRef} className="mb-8 overflow-hidden">
          <h1 className="text-6xl lg:text-8xl font-bold text-white mb-4">
            {splitText("SNAPIFY")}
          </h1>
          <p className="loading-subtitle text-white/60 text-sm uppercase tracking-[0.3em]">
            Loading Your Visual Journey
          </p>
        </div>

        {/* Progress bar container */}
        <div className="w-[300px] lg:w-[400px] mx-auto mb-6">
          <div className="relative h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full"
              style={{
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)"
              }}
            />
          </div>
        </div>

        {/* Percentage counter */}
        <div className="text-white/80 text-2xl font-light">
          <span ref={percentageRef}>0</span>
        </div>

        {/* Loading dots animation */}
        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1.4s"
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-white/40 text-xs uppercase tracking-wider">
          Preparing Your Experience
        </p>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.1);
          }
        }

        .animate-gradient {
          animation: gradient 20s ease infinite;
        }

        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
}