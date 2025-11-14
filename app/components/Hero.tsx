"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { TextPlugin } from "gsap/TextPlugin";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip, TextPlugin);
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement[]>([]);
  const counter1Ref = useRef<HTMLDivElement>(null);
  const counter2Ref = useRef<HTMLDivElement>(null);
  const counter3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    // Lock scroll during loading animation
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    // Setup text splitting manually since SplitText is a paid plugin
    const setupTextSplitting = () => {
      const textElements = heroRef.current?.querySelectorAll("h1, h2, p, a");
      textElements?.forEach((element) => {
        const text = element.textContent || "";
        element.innerHTML = `<div class="overflow-hidden"><span class="block translate-y-full transition-transform">${text}</span></div>`;
      });
    };

    // Create counter digits
    const createCounterDigits = () => {
      if (!counter1Ref.current || !counter2Ref.current || !counter3Ref.current)
        return;

      // Counter 1 (hundreds place - shows 0 then 1)
      counter1Ref.current.innerHTML = "";
      const num0 = document.createElement("div");
      num0.className = "counter-num";
      num0.textContent = "0";
      counter1Ref.current.appendChild(num0);

      const num1 = document.createElement("div");
      num1.className = "counter-num";
      num1.textContent = "1";
      counter1Ref.current.appendChild(num1);

      // Counter 2 (tens place - goes 0-9 then back to 0 for "100")
      counter2Ref.current.innerHTML = "";
      for (let i = 0; i <= 10; i++) {
        const numDiv = document.createElement("div");
        numDiv.className = "counter-num";
        numDiv.textContent = i === 10 ? "0" : i.toString();
        counter2Ref.current.appendChild(numDiv);
      }

      // Counter 3 (ones place - cycles through 0-9 three times, ending at 0)
      counter3Ref.current.innerHTML = "";
      // First cycle: 0-9
      for (let i = 0; i <= 9; i++) {
        const numDiv = document.createElement("div");
        numDiv.className = "counter-num";
        numDiv.textContent = i.toString();
        counter3Ref.current.appendChild(numDiv);
      }
      // Second cycle: 0-9
      for (let i = 0; i <= 9; i++) {
        const numDiv = document.createElement("div");
        numDiv.className = "counter-num";
        numDiv.textContent = i.toString();
        counter3Ref.current.appendChild(numDiv);
      }
      // Third cycle: 0-9
      for (let i = 0; i <= 9; i++) {
        const numDiv = document.createElement("div");
        numDiv.className = "counter-num";
        numDiv.textContent = i.toString();
        counter3Ref.current.appendChild(numDiv);
      }
      // Final 0 for "100"
      const finalNum = document.createElement("div");
      finalNum.className = "counter-num";
      finalNum.textContent = "0";
      counter3Ref.current.appendChild(finalNum);
    };

    // Animate counter
    const animateCounter = (
      counter: HTMLElement | null,
      duration: number,
      delay = 0
    ) => {
      if (!counter) return;
      const numHeight = 120; // height in px
      const totalDistance =
        (counter.querySelectorAll(".counter-num").length - 1) * numHeight;
      gsap.to(counter, {
        y: -totalDistance,
        duration: duration,
        delay: delay,
        ease: "power2.inOut",
      });
    };

    // Animate images function
    const animateImages = () => {
      const images = heroRef.current?.querySelectorAll(".img-container");
      if (!images) return;

      images.forEach((img) => {
        img.classList.remove("img-animate-out");
      });

      const state = Flip.getState(images);

      images.forEach((img) => img.classList.add("img-animate-out"));

      const mainTimeline = gsap.timeline();

      mainTimeline.add(
        Flip.from(state, {
          duration: 1,
          stagger: 0.1,
          ease: "power3.inOut",
        })
      );

      images.forEach((img, index) => {
        const scaleTimeline = gsap.timeline();

        scaleTimeline
          .to(
            img,
            {
              scale: 2.5,
              duration: 0.45,
              ease: "power3.in",
            },
            0.025
          )
          .to(
            img,
            {
              scale: 1,
              duration: 0.45,
              ease: "power3.out",
            },
            0.5
          );

        mainTimeline.add(scaleTimeline, index * 0.1);
      });

      return mainTimeline;
    };

    // Initialize animations
    setupTextSplitting();
    createCounterDigits();

    // Start animations
    animateCounter(counter3Ref.current, 2.5);
    animateCounter(counter2Ref.current, 3);
    animateCounter(counter1Ref.current, 2, 1.5);

    const tl = gsap.timeline();

    // Set initial states
    gsap.set(".img-container", { scale: 0 });
    gsap.set(".nav-cta", { opacity: 0 });

    // Hero background animation
    tl.to(".hero-bg", {
      scaleY: "100%",
      duration: 3,
      ease: "power2.inOut",
      delay: 0.25,
    });

    // Images appear
    tl.to(
      ".img-container",
      {
        scale: 1,
        duration: 1,
        stagger: 0.125,
        ease: "power3.out",
      },
      "<"
    );

    // Counter fade out and trigger image animations
    tl.to(".counter", {
      opacity: 0,
      duration: 0.3,
      ease: "power3.out",
      delay: 0.3,
      onStart: () => {
        animateImages();
      },
    });

    // Sidebar divider animation
    tl.to(".sidebar-divider", {
      scaleY: "100%",
      duration: 1,
      ease: "power3.inOut",
      delay: 1.25,
    });

    // Nav and site info dividers
    tl.to(
      [".nav-divider", ".site-info-divider"],
      {
        scaleX: "100%",
        duration: 1,
        stagger: 0.5,
        ease: "power3.inOut",
      },
      "<"
    );

    // Logo animation
    tl.to(
      ".sidebar-logo",
      {
        scale: 1,
        duration: 1,
        ease: "power4.inOut",
      },
      "<"
    );

    // Text reveal animations
    tl.to(
      heroRef.current?.querySelectorAll(".logo-name span, .nav-links span"),
      {
        y: "0%",
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.5,
      },
      "<"
    );

    // Animate Contact button separately to control opacity
    tl.to(
      ".nav-cta",
      {
        opacity: 1,
        duration: 1,
        ease: "power4.out",
      },
      "<0.5"
    );

    tl.to(
      ".nav-cta span",
      {
        y: "0%",
        duration: 1,
        ease: "power4.out",
      },
      "<"
    );

    tl.to(
      heroRef.current?.querySelectorAll(
        ".header-text span, .site-info-text span, .hero-footer-text span"
      ),
      {
        y: "0%",
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        onComplete: () => {
          // Unlock scroll after animation completes
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.height = '';
        }
      },
      "<"
    );

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  // Image paths
  const images = Array.from({ length: 15 }, (_, i) => `/hero/${i + 1}.jpg`);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden"
    >
      {/* Hero Background */}
      <div className="hero-bg absolute top-0 left-0 w-full h-full bg-[#1a1a1a] origin-bottom scale-y-0" />

      {/* Counter */}
      <div
        className="counter fixed right-12 bottom-8 flex h-[120px] text-[120px] leading-[120px]"
        style={{
          WebkitTextStroke: "2px #f5f5f5",
          WebkitTextFillColor: "transparent",
          clipPath: "polygon(0 0, 100% 0, 100% 120px, 0 120px)",
        }}
      >
        <div ref={counter1Ref} className="counter-1 relative"></div>
        <div ref={counter2Ref} className="counter-2 relative"></div>
        <div ref={counter3Ref} className="counter-3 relative"></div>
      </div>

      {/* Images Container */}
      <div className="absolute top-0 left-0 w-full h-full">
        {images.map((src, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) imagesRef.current[index] = el;
            }}
            className="img-container absolute top-6 left-6 w-1/5 aspect-[5/3] rounded-xl overflow-hidden border border-white/5 shadow-2xl"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative w-full h-20 px-6 pt-6 pb-6 pl-[120px] flex justify-between items-center">
        <div className="logo-name">
          <a
            href="#"
            className="text-2xl font-medium text-[#f5f5f5] no-underline overflow-hidden"
          >
            <span>JK</span>
          </a>
        </div>

        <div className="nav-items flex items-center gap-[120px]">
          <div className="nav-links flex items-center gap-2">
            <a
              href="#"
              className="text-base font-medium text-[#a0a0a0] hover:text-[#f5f5f5] transition-colors no-underline overflow-hidden"
            >
              <span>Gallery</span>
            </a>
            <p className="text-base font-medium text-[#a0a0a0] overflow-hidden">
              <span>/</span>
            </p>
            <a
              href="#"
              className="text-base font-medium text-[#a0a0a0] hover:text-[#f5f5f5] transition-colors no-underline overflow-hidden"
            >
              <span>About</span>
            </a>
          </div>

          <div className="nav-cta">
            <a
              href="#"
              className="text-base font-medium text-[#f5f5f5] border border-[#555] px-6 py-2 rounded-full hover:bg-[#f5f5f5] hover:text-[#0a0a0a] transition-all no-underline inline-block overflow-hidden"
            >
              <span>Contact</span>
            </a>
          </div>
        </div>

        <div className="nav-divider absolute left-0 bottom-0 w-full h-px bg-white/10 origin-left scale-x-0" />
      </nav>

      {/* Sidebar */}
      <div className="absolute top-0 left-0 w-20 h-screen pt-6 flex justify-center items-start">
        <div className="sidebar-logo w-8 aspect-square scale-0">
          <Image
            src="/hero/camera.jpg"
            alt=""
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="sidebar-divider absolute right-0 top-0 w-px h-screen bg-white/10 origin-top scale-y-0" />
      </div>

      {/* Header */}
      <div className="header-text absolute top-[35%] left-[120px] -translate-y-1/2 w-3/5">
        <h1 className="text-[6rem] font-medium tracking-[-0.1rem] leading-[1.1] text-[#f5f5f5] overflow-hidden">
          <span className="bg-gradient-to-r from-[#f5f5f5] via-[#d0d0d0] to-[#f5f5f5] bg-clip-text text-transparent">
            Love Captured in Every Frame
          </span>
        </h1>
      </div>

      {/* Site Info */}
      <div className="site-info-text absolute right-6 top-[60%] -translate-y-1/2 w-1/5 flex flex-col gap-4">
        <h2 className="text-[1.75rem] font-medium tracking-[-0.02rem] leading-[1.1] text-[#a0a0a0] overflow-hidden">
          <span>
            Unfiltered frames that speak through emotion, chaos, and silence —
            where beauty finds its own rhythm.
          </span>
        </h2>

        <div className="site-info-divider w-full h-px bg-white/10 origin-left scale-x-0" />

        <div className="flex flex-col gap-1">
          <p className="text-base font-medium text-[#808080] overflow-hidden">
            <span>Digital Creator</span>
          </p>
          <p className="text-base font-medium text-[#808080] overflow-hidden">
            <span>Capturing since 2015</span>
          </p>
        </div>
      </div>

      {/* Hero Footer */}
      <div className="hero-footer-text absolute bottom-6 left-[120px]">
        <h2 className="text-[1.75rem] font-medium tracking-[-0.02rem] leading-[1.1] text-[#f5f5f5] hover:text-[#d0d0d0] cursor-pointer transition-colors overflow-hidden">
          <span>Explore My Lens</span>
        </h2>
      </div>

      <style jsx>{`
        .img-animate-out {
          top: auto !important;
          left: auto !important;
          bottom: 1.5rem !important;
          right: 1.5rem !important;
        }

        .counter-num {
          position: relative;
          display: block;
          height: 120px;
          line-height: 120px;
        }

        .counter-1 .counter-num:nth-child(2) {
          position: relative;
          margin-left: -30px;
        }

        .counter-2 .counter-num:nth-child(2) {
          position: relative;
          margin-left: -15px;
        }

        @media (max-width: 1000px) {
          .header-text h1 {
            font-size: 2.5rem;
            letter-spacing: -0.05rem;
          }

          .site-info-text h2,
          .hero-footer-text h2 {
            font-size: 1.5rem;
          }

          .nav-links {
            display: none;
          }

          .img-container {
            width: 30%;
          }

          .header-text {
            top: 25%;
            width: calc(100% - 200px);
          }

          .site-info-text {
            width: calc(100% - 200px);
            right: auto;
            left: 120px;
          }
        }
      `}</style>
    </section>
  );
}
