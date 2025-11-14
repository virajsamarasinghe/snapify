"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Minimap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const translateRef = useRef({
    current: 0,
    target: 0,
    max: 0,
  });

  const [isHorizontal, setIsHorizontal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dimensionsRef = useRef({
    itemSize: 0,
    containerSize: 0,
    indicatorSize: 0,
  });

  const activeItemOpacity = 0.3;
  const images = Array.from(
    { length: 15 },
    (_, i) => `/hero/${i + 1}.jpg`
  );
  const isClickMoveRef = useRef(false);

  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const updateDimensions = () => {
    const newIsHorizontal = window.innerWidth <= 900;
    const firstItem = itemRefs.current[0];

    if (!firstItem || !itemsRef.current || !indicatorRef.current) return;

    const newDimensions = {
      itemSize: newIsHorizontal
        ? firstItem.getBoundingClientRect().width
        : firstItem.getBoundingClientRect().height,
      containerSize: newIsHorizontal
        ? itemsRef.current.scrollWidth
        : itemsRef.current.getBoundingClientRect().height,
      indicatorSize: newIsHorizontal
        ? indicatorRef.current.getBoundingClientRect().width
        : indicatorRef.current.getBoundingClientRect().height,
    };

    dimensionsRef.current = newDimensions;
    translateRef.current.max =
      newDimensions.containerSize - newDimensions.indicatorSize;

    if (isHorizontal !== newIsHorizontal) {
      setIsHorizontal(newIsHorizontal);
    }
  };

  const getItemInIndicator = () => {
    // Reset all items opacity
    itemRefs.current.forEach((item) => {
      if (item?.querySelector("img")) {
        const img = item.querySelector("img") as HTMLImageElement;
        img.style.opacity = "1";
      }
    });

    // Calculate indicator bounds based on translation
    const indicatorStart = -translateRef.current.current;
    const indicatorEnd = indicatorStart + dimensionsRef.current.indicatorSize;

    let maxOverlap = 0;
    let selectedIndex = 0;

    // Find which item has the most overlap with the indicator
    itemRefs.current.forEach((_, index) => {
      const itemStart = index * dimensionsRef.current.itemSize;
      const itemEnd = itemStart + dimensionsRef.current.itemSize;

      const overlapStart = Math.max(indicatorStart, itemStart);
      const overlapEnd = Math.min(indicatorEnd, itemEnd);
      const overlap = Math.max(0, overlapEnd - overlapStart);

      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        selectedIndex = index;
      }
    });

    // Highlight the selected item
    if (itemRefs.current[selectedIndex]?.querySelector("img")) {
      const img = itemRefs.current[selectedIndex]!.querySelector("img") as HTMLImageElement;
      img.style.opacity = String(activeItemOpacity);
    }

    return selectedIndex;
  };

  const updatePreviewImage = (index: number) => {
    if (currentImageIndex !== index) {
      setCurrentImageIndex(index);
    }
  };

  const animate = () => {
    const lerpFactor = isClickMoveRef.current ? 0.05 : 0.075;
    translateRef.current.current = lerp(
      translateRef.current.current,
      translateRef.current.target,
      lerpFactor
    );

    if (
      Math.abs(translateRef.current.current - translateRef.current.target) > 0.01
    ) {
      const transform = isHorizontal
        ? `translateX(${translateRef.current.current}px)`
        : `translateY(${translateRef.current.current}px)`;

      if (itemsRef.current) {
        itemsRef.current.style.transform = transform;
      }

      const activeIndex = getItemInIndicator();
      updatePreviewImage(activeIndex);
    } else {
      isClickMoveRef.current = false;
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      isClickMoveRef.current = false;

      const delta = e.deltaY;
      const scrollVelocity = Math.min(Math.max(delta * 0.5, -20), 20);

      translateRef.current.target = Math.min(
        Math.max(
          translateRef.current.target - scrollVelocity,
          -translateRef.current.max
        ),
        0
      );
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (isHorizontal) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isHorizontal) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;

        const scrollVelocity = Math.min(Math.max(deltaY * 0.5, -20), 20);

        translateRef.current.target = Math.min(
          Math.max(
            translateRef.current.target - scrollVelocity,
            -translateRef.current.max
          ),
          0
        );

        touchStartY = touchY;
        e.preventDefault();
      }
    };

    const handleResize = () => {
      updateDimensions();

      translateRef.current.target = Math.min(
        Math.max(translateRef.current.target, -translateRef.current.max),
        0
      );
      translateRef.current.current = translateRef.current.target;

      const transform = isHorizontal
        ? `translateX(${translateRef.current.current}px)`
        : `translateY(${translateRef.current.current}px)`;

      if (itemsRef.current) {
        itemsRef.current.style.transform = transform;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }

    window.addEventListener("resize", handleResize);

    updateDimensions();

    // Initialize the position to start at 0
    setTimeout(() => {
      if (itemRefs.current[0]?.querySelector("img")) {
        const img = itemRefs.current[0].querySelector("img") as HTMLImageElement;
        img.style.opacity = String(activeItemOpacity);
      }
      updatePreviewImage(0);
    }, 100);

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      }
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHorizontal, images]);

  const handleItemClick = (index: number) => {
    isClickMoveRef.current = true;

    // Calculate translation to center the clicked item in the indicator
    const newTranslate =
      -index * dimensionsRef.current.itemSize +
      (dimensionsRef.current.indicatorSize - dimensionsRef.current.itemSize) / 2;

    // Clamp the translation to valid bounds
    translateRef.current.target = Math.max(
      Math.min(newTranslate, 0),
      -translateRef.current.max
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a0a]" ref={containerRef}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-screen px-6 py-6 flex justify-between items-center z-10">
        <p className="text-sm font-semibold text-[#f5f5f5] select-none">JK</p>
        <p className="text-sm font-semibold text-[#f5f5f5] select-none cursor-pointer hover:text-[#a0a0a0] transition-colors">Menu</p>
      </nav>

      {/* Site Info */}
      <div className="absolute top-1/2 left-6 flex gap-1 md:top-1/2 md:left-6 max-md:top-6 max-md:left-1/2 max-md:-translate-x-1/2">
        <p className="text-sm font-semibold text-[#f5f5f5] select-none">Gallery</p>
        <p className="text-sm font-semibold select-none">
          <span className="text-[#606060]">Minimap View</span>
        </p>
      </div>

      {/* Image Preview */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-3/4 overflow-hidden max-md:top-[45%] max-md:w-3/4 max-md:h-1/2">
        <div className="relative w-full h-full">
          <Image
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Minimap */}
      <div className="absolute top-1/2 right-32 w-20 -translate-y-1/2 max-md:top-auto max-md:right-auto max-md:bottom-20 max-md:left-1/2 max-md:-translate-x-1/2 max-md:translate-y-0 max-md:h-20">
        {/* Indicator - at top/left of the minimap */}
        <div
          ref={indicatorRef}
          className="absolute top-0 left-0 w-full h-[60px] border border-[#f5f5f5] z-[2] max-md:w-[60px] max-md:h-full"
        />

        {/* Items */}
        <div
          ref={itemsRef}
          className="relative w-full h-full flex flex-col gap-0 will-change-transform max-md:flex-row max-md:w-max"
        >
          {images.map((src, index) => (
            <div
              key={src}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              onClick={() => handleItemClick(index)}
              className="w-full h-[60px] p-[5px] cursor-pointer max-md:w-[60px] max-md:h-full"
            >
              <div className="relative w-full h-full">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover transition-opacity duration-200 select-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          body {
            overflow: hidden;
            touch-action: none;
          }
        }
      `}</style>
    </div>
  );
}