"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import TransitionLink from "./TransitionLink";
import ContactPopup from "./ContactPopup";

interface HomeNavbarProps {
  animateOnMount?: boolean;
  delay?: number;
  className?: string;
}

export default function HomeNavbar({
  animateOnMount = true,
  delay = 0,
  className = "",
}: HomeNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!animateOnMount) return;

    const ctx = gsap.context(() => {
      gsap.set(".hero-nav", { y: -100 });

      gsap.to(".hero-nav", {
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: delay + 0.6,
      });
    }, navRef);

    return () => ctx.revert();
  }, [animateOnMount, delay]);

  return (
    <>
      <nav
        ref={navRef}
        className={`hero-nav fixed top-0 left-0 w-full px-8 lg:px-12 py-6 flex justify-between items-center z-50 mix-blend-difference ${className}`}
      >
        <div className="flex items-center gap-12">
          <TransitionLink
            href="/"
            className="text-3xl font-bold text-white relative z-50"
          >
            JK
          </TransitionLink>
          <div className="hidden lg:flex items-center gap-8">
            {/* <TransitionLink href="/work" className="text-white/80 hover:text-white transition-colors">Work</TransitionLink> */}
            <button
              onClick={() => {
                const gallerySection = document.getElementById("gallery");
                if (gallerySection) {
                  gallerySection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Gallery
            </button>
            {/* <TransitionLink href="#about" className="text-white/80 hover:text-white transition-colors">About</TransitionLink> */}
            <TransitionLink
              href="/marketplace"
              className="text-white/80 hover:text-white transition-colors"
            >
              Marketplace
            </TransitionLink>
          </div>
        </div>

        {/* Desktop CTA */}
        <button
          onClick={() => setIsContactOpen(true)}
          className="hidden lg:block text-white border border-white/30 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all"
        >
          Let's Talk
        </button>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-white relative z-50 p-2"
        >
          <div
            className={`w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <div
            className={`w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-transform duration-500 ease-in-out lg:hidden flex flex-col items-center justify-center gap-8 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => {
            const gallerySection = document.getElementById("gallery");
            if (gallerySection) {
              gallerySection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
            setIsMobileMenuOpen(false);
          }}
          className="text-4xl font-light text-white hover:text-purple-400 transition-colors cursor-pointer"
        >
          Gallery
        </button>
        <TransitionLink
          href="/marketplace"
          className="text-4xl font-light text-white hover:text-purple-400 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Marketplace
        </TransitionLink>
        <button
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsContactOpen(true);
          }}
          className="text-4xl font-light text-white hover:text-purple-400 transition-colors"
        >
          Let's Talk
        </button>
      </div>

      {/* Contact Popup */}
      <ContactPopup
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
}
