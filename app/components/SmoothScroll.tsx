"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger and scroll to top immediately
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Scroll to top immediately when script loads
  window.scrollTo(0, 0);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Force scroll to top on page load/refresh
    window.scrollTo(0, 0);
    window.history.scrollRestoration = 'manual';

    // Hide scrollbar and disable scroll during loading
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Initialize Lenis but keep it stopped initially
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Stop Lenis initially during loading and ensure it's at top
    lenis.stop();
    lenis.scrollTo(0, { immediate: true });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis tick to GSAP ticker
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);

    // Disable GSAP's default lag smoothing
    gsap.ticker.lagSmoothing(0);

    // Enable scroll after loading animation completes
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      lenis.start();
    }, 3800); // After counter animation (3.5s) + small buffer

    // Update ScrollTrigger on resize
    const handleResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearTimeout(loadingTimer);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <>{children}</>;
}