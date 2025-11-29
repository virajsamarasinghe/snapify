"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import TransitionLink from "./TransitionLink";

interface HomeNavbarProps {
  animateOnMount?: boolean;
  delay?: number;
  className?: string;
}

export default function HomeNavbar({ animateOnMount = true, delay = 0, className = "" }: HomeNavbarProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!animateOnMount) return;

    const ctx = gsap.context(() => {
      gsap.set(".hero-nav", { y: -100 });
      
      gsap.to(".hero-nav", {
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: delay + 0.6
      });
    }, navRef);

    return () => ctx.revert();
  }, [animateOnMount, delay]);

  return (
    <nav ref={navRef} className={`hero-nav fixed top-0 left-0 w-full px-8 lg:px-12 py-6 flex justify-between items-center z-30 mix-blend-difference ${className}`}>
      <div className="flex items-center gap-12">
        <TransitionLink href="/" className="text-3xl font-bold text-white">
          JK
        </TransitionLink>
        <div className="hidden lg:flex items-center gap-8">
          {/* <TransitionLink href="/work" className="text-white/80 hover:text-white transition-colors">Work</TransitionLink> */}
          <TransitionLink href="/gallery" className="text-white/80 hover:text-white transition-colors">Gallery</TransitionLink>
          <TransitionLink href="/about" className="text-white/80 hover:text-white transition-colors">About</TransitionLink>
          <TransitionLink href="/marketplace" className="text-white/80 hover:text-white transition-colors">Marketplace</TransitionLink>
        </div>
      </div>
      <TransitionLink href="#contact" className="text-white border border-white/30 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all">
        Let's Talk
      </TransitionLink>
    </nav>
  );
}
