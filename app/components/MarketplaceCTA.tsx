"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "./TransitionLink";

gsap.registerPlugin(ScrollTrigger);

export default function MarketplaceCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(".cta-content > *", {
        opacity: 0,
        y: 30
      });

      gsap.set(".cta-bg-element", {
        scale: 0,
        opacity: 0
      });

      // Create timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate background elements
      tl.to(".cta-bg-element", {
        scale: 1,
        opacity: 0.1,
        duration: 1.5,
        stagger: 0.2,
        ease: "power2.out"
      })
      // Animate content
      .to(".cta-content > *", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      }, "-=1");

      // Button hover animation
      const button = section.querySelector(".cta-button");
      if (button) {
        button.addEventListener("mouseenter", () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        button.addEventListener("mouseleave", () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      }

    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[50vh] bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] py-20 lg:py-32 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="cta-bg-element absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="cta-bg-element absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="cta-bg-element absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="cta-content max-w-4xl mx-auto text-center">
          {/* Small heading */}
          <p className="text-white/60 text-sm uppercase tracking-[0.3em] mb-6">
            Own a Piece of Art
          </p>

          {/* Main heading with highlight pattern */}
          <h2 className="text-[2.5rem] lg:text-[5rem] font-bold mb-8 leading-[0.9]">
            <span className="inline-block bg-white text-black px-4">
              BE PART
            </span>
            <span className="inline-block mx-3">{"\u00A0"}</span>
            <span className="inline-block text-white">
              OF THE
            </span>
            <br />
            <span className="inline-block text-white mt-2">
              COLLECTION
            </span>
          </h2>

          {/* Description */}
          <p className="text-white/70 text-lg lg:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Transform your space with exclusive artwork. Each piece tells a unique story,
            captured through the lens of artistic vision. Join collectors worldwide who
            appreciate the beauty of authentic photography.
          </p>

          {/* CTA Button */}
          <TransitionLink
            href="/marketplace"
            className="cta-button inline-flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 group"
          >
            <span>Explore Marketplace</span>
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </TransitionLink>

          {/* Additional info */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/50 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Authenticated Originals</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Limited Editions</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>Worldwide Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </section>
  );
}