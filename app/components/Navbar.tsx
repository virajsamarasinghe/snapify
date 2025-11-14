"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Initial animation on mount
    gsap.fromTo(".nav-item",
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3
      }
    );

    gsap.fromTo(".nav-divider",
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1,
        ease: "power2.inOut",
        delay: 0.8
      }
    );
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md">
      <div className="relative">
        {/* Main Navigation */}
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="nav-item flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <Image
                  src="/hero/camera.jpg"
                  alt="Snapify"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-bold text-white">SNAPIFY</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="nav-item text-white/60 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/#about" className="nav-item text-white/60 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/#gallery" className="nav-item text-white/60 hover:text-white transition-colors">
                Gallery
              </Link>
              <Link href="/marketplace" className="nav-item text-white/60 hover:text-white transition-colors">
                Marketplace
              </Link>
              <Link
                href="#contact"
                className="nav-item px-6 py-2 border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="nav-divider absolute bottom-0 left-0 right-0 h-[1px] bg-white/10 origin-left"></div>
      </div>
    </nav>
  );
}