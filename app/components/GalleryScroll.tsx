"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function GalleryScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  // Gallery images data - using local images
  const galleryImages = [
    { id: 1, src: "/assets/img7.jpeg", alt: "Photography showcase" },
    { id: 2, src: "/assets/img8.jpeg", alt: "Creative photography" },
    { id: 3, src: "/assets/img9.jpeg", alt: "Artistic capture" },
    { id: 4, src: "/assets/img10.jpeg", alt: "Visual storytelling" },
    { id: 5, src: "/assets/img11.jpeg", alt: "Nature photography" },
    { id: 6, src: "/assets/img12.jpeg", alt: "Landscape capture" },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const quote = quoteRef.current;
    const images = imagesRef.current;
    if (!section || !quote || !images) return;

    // Set initial states
    gsap.set(".quote-line", { opacity: 0, y: 50 });
    gsap.set(".quote-author", { opacity: 0, y: 30 });
    gsap.set(".gallery-image-wrapper", { opacity: 0, y: 100, scale: 0.8 });

    // Create timeline for quote animation
    const quoteTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate quote lines
    quoteTl.to(".quote-line", {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    })
    .to(".quote-author", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4");

    // Staggered reveal animation for images
    gsap.to(".gallery-image-wrapper", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      stagger: {
        each: 0.15,
        from: 0,  // Start from first element (top-left)
        grid: [3, 2]
      },
      ease: "power3.out",
      scrollTrigger: {
        trigger: images,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Parallax effect on scroll for images
    gsap.utils.toArray(".gallery-image-wrapper").forEach((element: any, index) => {
      gsap.to(element, {
        y: -50 * (1 - index * 0.1),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-20 lg:py-32 overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Side - Quote */}
          <div ref={quoteRef} className="relative">
            <div className="lg:sticky lg:top-32">
              {/* Quote mark */}
              <div className="absolute -top-10 -left-4 text-white/10 text-[150px] leading-none font-serif">
                "
              </div>

              {/* Quote content */}
              <div className="relative z-10 space-y-6">
                <h2 className="quote-line text-3xl lg:text-5xl font-light leading-tight text-white">
                  Photography is the
                </h2>
                <h2 className="quote-line text-3xl lg:text-5xl font-light leading-tight text-white">
                  <span className="font-bold italic">story</span> I fail to put
                </h2>
                <h2 className="quote-line text-3xl lg:text-5xl font-light leading-tight text-white">
                  into words.
                </h2>
              </div>

              {/* Author */}
              <div className="quote-author mt-12 flex items-center gap-4">
                <div className="w-16 h-[1px] bg-white/40"></div>
                <p className="text-white/60 text-sm uppercase tracking-widest">
                  Destin Sparks
                </p>
              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* Right Side - Images Grid */}
          <div ref={imagesRef} className="relative">
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              {galleryImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`gallery-image-wrapper relative group cursor-pointer ${
                    index === 1 || index === 4 ? 'mt-12' : ''
                  }`}
                >
                  <div className={`relative overflow-hidden rounded-lg ${
                    index === 0 || index === 3 ? 'h-[250px] lg:h-[350px]' : 'h-[200px] lg:h-[280px]'
                  }`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Image number */}
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="text-white text-xs font-light tracking-wider">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button */}
            <div className="mt-12 text-center lg:text-right">
              <button className="group relative inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300">
                <span className="text-sm uppercase tracking-wider">View Gallery</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl opacity-20"></div>
    </section>
  );
}