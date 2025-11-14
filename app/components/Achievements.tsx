"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Achievement {
  year: string;
  title: string;
  venue: string;
  description: string;
  type: "award" | "exhibition" | "feature";
  image: string;
}

const achievements: Achievement[] = [
  {
    year: "2024",
    title: "International Photography Excellence",
    venue: "World Photography Organization",
    description: "Awarded for innovative approach to contemporary portrait photography, capturing the essence of human emotion.",
    type: "award",
    image: "/img4.jpg"
  },
  {
    year: "2024",
    title: "Shadows & Light",
    venue: "Modern Art Gallery, New York",
    description: "A solo exhibition featuring 50 pieces exploring the interplay between darkness and illumination.",
    type: "exhibition",
    image: "/img7.jpg"
  },
  {
    year: "2023",
    title: "Contemporary Visions",
    venue: "Tate Modern, London",
    description: "Group exhibition alongside renowned international artists, showcasing the future of visual storytelling.",
    type: "exhibition",
    image: "/img9.jpg"
  },
  {
    year: "2023",
    title: "Wildlife Series",
    venue: "National Geographic",
    description: "Featured photographer for an exclusive series documenting endangered species.",
    type: "feature",
    image: "/img11.jpg"
  },
  {
    year: "2022",
    title: "Architecture Category Winner",
    venue: "Sony World Photography Awards",
    description: "Recognition for capturing the poetry of modern architecture through unique perspectives.",
    type: "award",
    image: "/img13.jpg"
  },
  {
    year: "2021",
    title: "Urban Narratives",
    venue: "MoMA PS1, New York",
    description: "Breakthrough exhibition exploring the stories hidden within city streets.",
    type: "exhibition",
    image: "/img15.jpg"
  }
];

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(".achievement-title-char", { y: 100, opacity: 0, rotation: -5 });
      gsap.set(".achievement-subtitle", { x: -50, opacity: 0 });
      gsap.set(".achievement-card", { y: 50, opacity: 0, scale: 0.9 });
      gsap.set(".achievement-line", { scaleX: 0 });
      gsap.set(".floating-shape", { opacity: 0, scale: 0 });

      // Create main timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        }
      });

      // Animate title characters
      tl.to(".achievement-title-char", {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        stagger: {
          amount: 0.5,
          from: "random"
        },
        ease: "back.out(1.7)"
      });

      // Animate subtitle
      tl.to(".achievement-subtitle", {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.4");

      // Animate line
      tl.to(".achievement-line", {
        scaleX: 1,
        duration: 0.8,
        ease: "power3.inOut"
      }, "-=0.4");

      // Animate achievement cards with stagger
      tl.to(".achievement-card", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      }, "-=0.4");

      // Animate floating shapes
      tl.to(".floating-shape", {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)"
      }, "-=0.3");

      // Parallax effect for images
      gsap.utils.toArray(".achievement-image-inner").forEach((image: any) => {
        gsap.to(image, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: image.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      });

      // Floating animation for shapes
      gsap.to(".floating-shape", {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        rotation: "random(-5, 5)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 2,
          from: "random"
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getTypeLabel = (type: Achievement['type']) => {
    switch(type) {
      case 'award': return 'Award';
      case 'exhibition': return 'Exhibition';
      case 'feature': return 'Featured';
      default: return '';
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] overflow-hidden py-20 lg:py-32"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`,
        }} />
      </div>

      {/* Floating Shapes */}
      <div className="floating-shape absolute top-20 left-20 w-24 h-24 border border-white/10 rounded-full" />
      <div className="floating-shape absolute bottom-40 right-20 w-32 h-32 border border-white/5 rounded-full" />
      <div className="floating-shape absolute top-1/2 left-1/3 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full" />
      <div className="floating-shape absolute bottom-1/3 right-1/4 w-16 h-16 border border-white/10 rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-12">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-20">
          <p className="achievement-subtitle text-lg text-white/60 uppercase tracking-[0.3em] mb-4">
            Recognition & Excellence
          </p>
          <h2 className="text-[3rem] lg:text-[6rem] font-bold mb-6 leading-[0.9]">
            <span className="inline-block bg-white text-black px-4">
              {Array.from("ACHIEVE").map((char, i) => (
                <span
                  key={i}
                  className="achievement-title-char inline-block"
                >
                  {char}
                </span>
              ))}
            </span>
            <span className="inline-block">
              {Array.from("MENTS").map((char, i) => (
                <span
                  key={i + 10}
                  className="achievement-title-char inline-block text-white"
                >
                  {char}
                </span>
              ))}
            </span>
          </h2>
          <div className="achievement-line h-px bg-gradient-to-r from-transparent via-white/30 to-transparent max-w-md mx-auto origin-center" />
        </div>

        {/* Timeline Layout */}
        <div ref={gridRef} className="relative">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

          {/* Achievement Items */}
          <div className="space-y-20">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`achievement-card flex items-center gap-8 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Content Side */}
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'}`}>
                  <div className="space-y-4">
                    <div className={`inline-flex items-center gap-3 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                      <span className="text-2xl">
                        {achievement.type === 'award' && '🏆'}
                        {achievement.type === 'exhibition' && '🎨'}
                        {achievement.type === 'feature' && '✨'}
                      </span>
                      <span className="text-white/40 text-sm uppercase tracking-wider">{achievement.year}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">{achievement.title}</h3>
                    <p className="text-white/60 text-lg">{achievement.venue}</p>
                    <p className="text-white/40 max-w-md mx-auto">{achievement.description}</p>
                  </div>
                </div>

                {/* Center Dot */}
                <div className="relative z-20">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 ring-4 ring-[#0a0a0a]">
                    <div className="absolute inset-0 rounded-full animate-ping opacity-30"></div>
                  </div>
                </div>

                {/* Image Side */}
                <div className="flex-1">
                  <div className="achievement-image-container group cursor-pointer max-w-md mx-auto">
                    <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                      <div className="achievement-image-inner absolute inset-0 scale-110">
                        <Image
                          src={achievement.image}
                          alt={achievement.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-125"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { number: "50+", label: "Awards Won" },
            { number: "120+", label: "Exhibitions" },
            { number: "30+", label: "Countries" },
            { number: "15M+", label: "Views" }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/5 transition-colors duration-300"
            >
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-white/60 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}