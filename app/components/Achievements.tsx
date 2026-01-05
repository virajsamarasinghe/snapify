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
    description:
      "Awarded for innovative approach to contemporary portrait photography, capturing the essence of human emotion.",
    type: "award",
    image: "/img4.jpg",
  },
  {
    year: "2024",
    title: "Shadows & Light",
    venue: "Modern Art Gallery, New York",
    description:
      "A solo exhibition featuring 50 pieces exploring the interplay between darkness and illumination.",
    type: "exhibition",
    image: "/img7.jpg",
  },
  {
    year: "2023",
    title: "Contemporary Visions",
    venue: "Tate Modern, London",
    description:
      "Group exhibition alongside renowned international artists, showcasing the future of visual storytelling.",
    type: "exhibition",
    image: "/img9.jpg",
  },
  {
    year: "2023",
    title: "Wildlife Series",
    venue: "National Geographic",
    description:
      "Featured photographer for an exclusive series documenting endangered species.",
    type: "feature",
    image: "/img11.jpg",
  },
  {
    year: "2022",
    title: "Architecture Category Winner",
    venue: "Sony World Photography Awards",
    description:
      "Recognition for capturing the poetry of modern architecture through unique perspectives.",
    type: "award",
    image: "/img13.jpg",
  },
  {
    year: "2021",
    title: "Urban Narratives",
    venue: "MoMA PS1, New York",
    description:
      "Breakthrough exhibition exploring the stories hidden within city streets.",
    type: "exhibition",
    image: "/img15.jpg",
  },
];

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);
  const [pathD, setPathD] = useState("");

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current || !pathRef.current) return;

    // Wait for layout to be stable
    const timer = setTimeout(() => {
      calculatePath();
    }, 100);

    const calculatePath = () => {
      if (!gridRef.current) return;

      const dots = gridRef.current.querySelectorAll(".timeline-dot");
      const containerRect = gridRef.current.getBoundingClientRect();
      const startX = containerRect.width / 2;

      setSvgHeight(containerRect.height);

      // Start path
      let pathString = `M ${startX} 0`;

      // Init previous point at top center
      let prevX = startX;
      let prevY = 0;

      dots.forEach((dot, index) => {
        const dotRect = dot.getBoundingClientRect();
        const x = dotRect.left + dotRect.width / 2 - containerRect.left;
        const y = dotRect.top + dotRect.height / 2 - containerRect.top;

        // Calculate curve
        // We want a curve that swings out between points
        const midY = (prevY + y) / 2;
        // Alternate swing direction: Left (-x), Right (+x)
        const swing = index % 2 === 0 ? 60 : -60;

        // Cubic Bezier: C Cp1x Cp1y, Cp2x Cp2y, x y
        // Control Point 1: vertically down from prev, pushed out
        // Control Point 2: vertically up from curr, pushed out

        pathString += ` C ${prevX + swing} ${prevY + (y - prevY) * 0.5}, ${
          x + swing
        } ${y - (y - prevY) * 0.5}, ${x} ${y}`;

        prevX = x;
        prevY = y;
      });

      // Extend to bottom
      pathString += ` L ${startX} ${containerRect.height}`;
      setPathD(pathString);
    };

    window.addEventListener("resize", calculatePath);

    return () => {
      window.removeEventListener("resize", calculatePath);
      clearTimeout(timer);
    };
  }, []);

  // Separate effect for animation once pathD is ready
  useEffect(() => {
    if (!pathD || !sectionRef.current || !pathRef.current) return;

    const pathLength = pathRef.current.getTotalLength();

    // Set initial path state (hidden)
    gsap.set(pathRef.current, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });
    // Set initial card state
    gsap.set(".achievement-card", { y: 50, opacity: 0, scale: 0.95 });

    const ctx = gsap.context(() => {
      // 1. Draw Line on Scroll
      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 70%",
          end: "bottom 90%",
          scrub: 1,
          onUpdate: (self) => {
            if (!gridRef.current || !pathRef.current) return;
            
            const drawLength = self.progress * pathLength;

            const containerRect = gridRef.current.getBoundingClientRect();

            // Check Checkpoints
            const dots = document.querySelectorAll(".timeline-dot-wrapper");
            dots.forEach((dotWrapper, i) => {
              const dotRect = dotWrapper.getBoundingClientRect();
              // Use top edge instead of center to trigger "on reach"
              const dotTopY = dotRect.top - containerRect.top;

              const pointAtLength =
                pathRef.current!.getPointAtLength(drawLength);
              const card = dotWrapper.closest(".achievement-card");

              if (pointAtLength.y >= dotTopY) {
                if (!dotWrapper.classList.contains("ignited")) {
                  dotWrapper.classList.add("ignited");
                  gsap.to(dotWrapper, {
                    scale: 1.5,
                    opacity: 1,
                    boxShadow: "0 0 20px 5px rgba(168, 85, 247, 0.6)",
                    backgroundColor: "#fff",
                    duration: 0.3,
                  });
                }
                // Reveal Card
                if (card && !card.classList.contains("revealed")) {
                  card.classList.add("revealed");
                  gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out",
                  });
                }
              } else {
                if (dotWrapper.classList.contains("ignited")) {
                  dotWrapper.classList.remove("ignited");
                  gsap.to(dotWrapper, {
                    scale: 1,
                    opacity: 0.5,
                    boxShadow: "none",
                    backgroundColor: "transparent",
                    duration: 0.5,
                  });
                }
                // Hide Card
                if (card && card.classList.contains("revealed")) {
                  card.classList.remove("revealed");
                  gsap.to(card, {
                    opacity: 0,
                    y: 50,
                    scale: 0.95,
                    duration: 0.5,
                    ease: "power2.in",
                  });
                }
              }
            });
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [pathD]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#0a0a0a] overflow-hidden py-20 lg:py-32"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20 md:mb-24">
          <p className="text-purple-400 text-xs sm:text-sm font-mono tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4">
            // Milestones
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6">
            Recognition
          </h2>
        </div>

        {/* Timeline Layout */}
        <div ref={gridRef} className="relative">
          {/* Dynamic SVG Path */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible">
            {/* Glow filter */}
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="lineGap" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              ref={pathRef}
              d={pathD}
              fill="none"
              stroke="url(#lineGap)"
              strokeWidth="3"
              filter="url(#glow)"
              strokeLinecap="round"
            />
          </svg>

          {/* Achievement Items */}
          <div className="space-y-32 py-20">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`achievement-card flex items-center gap-12 lg:gap-24 relative ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Content Side */}
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? "text-right" : "text-left"
                  }`}
                >
                  <span className="text-purple-400 font-mono text-xs tracking-widest block mb-2">
                    {achievement.year}
                  </span>
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    {achievement.title}
                  </h3>
                  <p className="text-white/40 max-w-sm ml-auto mr-0">
                    {achievement.description}
                  </p>
                </div>

                {/* Center Connector (Invisible Anchor for path, but visual feedback) */}
                <div className="relative z-20 flex-shrink-0 timeline-dot-wrapper opacity-50 transition-all duration-500 rounded-full p-1">
                  <div className="timeline-dot w-6 h-6 rounded-full bg-[#1a1a1a] border-2 border-white/20" />
                </div>

                {/* Image Side */}
                <div className="flex-1">
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-white/10 group">
                    <Image
                      src={achievement.image}
                      alt={achievement.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
