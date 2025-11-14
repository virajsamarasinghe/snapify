"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { CustomEase } from "gsap/dist/CustomEase";
import items from "./items";

let SplitType: any;

export default function GalleryNew() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const projectTitleRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [initialized, setInitialized] = useState(false);
  const [cursorText, setCursorText] = useState("DRAG");

  useEffect(() => {
    const importSplitType = async () => {
      const SplitTypeModule = await import("split-type");
      SplitType = SplitTypeModule.default;

      initializeGallery();
      setInitialized(true);
    };

    gsap.registerPlugin(CustomEase);
    CustomEase.create("hop", "0.9, 0, 0.1, 1");

    importSplitType();

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousedown", handleMouseDown);
        containerRef.current.removeEventListener("touchstart", handleTouchStart);
      }

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);

      if (stateRef.current.animationFrameId) {
        cancelAnimationFrame(stateRef.current.animationFrameId);
      }
    };
  }, []);

  const itemCount = 20;
  const itemGap = 180;
  const columns = 4;
  const itemWidth = 140;
  const itemHeight = 180;

  const stateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    dragVelocityX: 0,
    dragVelocityY: 0,
    lastDragTime: 0,
    mouseHasMoved: false,
    visibleItems: new Set(),
    lastUpdateTime: 0,
    lastX: 0,
    lastY: 0,
    isExpanded: false,
    activeItem: null as HTMLElement | null,
    canDrag: true,
    originalPosition: null as any,
    expandedItem: null as HTMLElement | null,
    activeItemId: null as string | null,
    titleSplit: null as any,
    animationFrameId: null as number | null,
  });

  // Custom cursor movement
  useEffect(() => {
    const handleCursorMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX - 50,
          y: e.clientY - 50,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener("mousemove", handleCursorMove);
    return () => window.removeEventListener("mousemove", handleCursorMove);
  }, []);

  const setAndAnimateTitle = (title: string) => {
    const { titleSplit } = stateRef.current;
    const projectTitleElement = projectTitleRef.current!.querySelector("p")!;

    if (titleSplit) titleSplit.revert();
    projectTitleElement.textContent = title;

    stateRef.current.titleSplit = new SplitType(projectTitleElement, {
      types: "chars",
    });
    gsap.set(stateRef.current.titleSplit.chars, { y: "120%", opacity: 0, rotation: 10 });
  };

  const animateTitleIn = () => {
    gsap.to(stateRef.current.titleSplit.chars, {
      y: "0%",
      opacity: 1,
      rotation: 0,
      duration: 0.8,
      stagger: 0.02,
      ease: "back.out(1.7)",
    });
  };

  const animateTitleOut = () => {
    gsap.to(stateRef.current.titleSplit.chars, {
      y: "-120%",
      opacity: 0,
      rotation: -10,
      duration: 0.6,
      stagger: 0.02,
      ease: "power3.in",
    });
  };

  const updateVisibleItems = () => {
    const state = stateRef.current;
    const canvas = canvasRef.current;

    if (!canvas) return;

    const buffer = 2.5;
    const viewWidth = window.innerWidth * (1 + buffer);
    const viewHeight = window.innerHeight * (1 + buffer);
    const movingRight = state.targetX > state.currentX;
    const movingDown = state.targetY > state.currentY;
    const directionBufferX = movingRight ? -300 : 300;
    const directionBufferY = movingDown ? -300 : 300;

    const startCol = Math.floor(
      (-state.currentX - viewWidth / 2 + (movingRight ? directionBufferX : 0)) /
        (itemWidth + itemGap)
    );
    const endCol = Math.ceil(
      (-state.currentX +
        viewWidth * 1.5 +
        (!movingRight ? directionBufferX : 0)) /
        (itemWidth + itemGap)
    );
    const startRow = Math.floor(
      (-state.currentY - viewHeight / 2 + (movingDown ? directionBufferY : 0)) /
        (itemHeight + itemGap)
    );
    const endRow = Math.ceil(
      (-state.currentY +
        viewHeight * 1.5 +
        (!movingDown ? directionBufferY : 0)) /
        (itemHeight + itemGap)
    );

    const currentItems = new Set();

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const itemId = `${col},${row}`;
        currentItems.add(itemId);

        if (state.visibleItems.has(itemId)) continue;
        if (state.activeItemId === itemId && state.isExpanded) continue;

        const item = document.createElement("div");
        item.className = "gallery-grid-item group";
        item.id = itemId;
        item.style.left = `${col * (itemWidth + itemGap)}px`;
        item.style.top = `${row * (itemHeight + itemGap)}px`;
        item.style.width = `${itemWidth}px`;
        item.style.height = `${itemHeight}px`;
        item.dataset.col = String(col);
        item.dataset.row = String(row);

        const itemNum = (Math.abs(row * columns + col) % itemCount) + 1;
        const imgContainer = document.createElement("div");
        imgContainer.className = "relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20";

        const img = document.createElement("img");
        img.src = `/img${itemNum}.jpg`;
        img.alt = `Image ${itemNum}`;
        img.className = "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110";
        imgContainer.appendChild(img);

        // Add gradient overlay
        const overlay = document.createElement("div");
        overlay.className = "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500";
        imgContainer.appendChild(overlay);

        // Add title on hover
        const titleDiv = document.createElement("div");
        titleDiv.className = "absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500";
        titleDiv.innerHTML = `
          <p class="text-white font-bold text-sm">${items[(itemNum - 1) % items.length]}</p>
          <p class="text-white/60 text-xs">Click to view</p>
        `;
        imgContainer.appendChild(titleDiv);

        // Add border effect
        const border = document.createElement("div");
        border.className = "absolute inset-0 rounded-xl border-2 border-white/0 group-hover:border-white/30 transition-colors duration-500";
        imgContainer.appendChild(border);

        item.appendChild(imgContainer);

        item.addEventListener("click", (e) => {
          if (state.mouseHasMoved || state.isDragging) return;
          handleItemClick(item);
        });

        canvas.appendChild(item);
        state.visibleItems.add(itemId);
      }
    }

    state.visibleItems.forEach((itemId) => {
      if (
        !currentItems.has(itemId) ||
        (state.activeItemId === itemId && state.isExpanded)
      ) {
        const item = document.getElementById(itemId as string);
        if (item && canvas.contains(item)) {
          canvas.removeChild(item);
          state.visibleItems.delete(itemId);
        }
      }
    });
  };

  const handleItemClick = (item: HTMLElement) => {
    const state = stateRef.current;

    if (state.isExpanded) {
      if (state.expandedItem) closeExpandedItem();
    } else {
      expandItem(item);
    }
  };

  const expandItem = (item: HTMLElement) => {
    const state = stateRef.current;
    const container = containerRef.current;
    const overlay = overlayRef.current;

    if (!container || !overlay) return;

    state.isExpanded = true;
    state.activeItem = item;
    state.activeItemId = item.id;
    state.canDrag = false;
    setCursorText("CLOSE");

    const imgSrc = item.querySelector("img")!.src;
    const imgMatch = imgSrc.match(/\/img(\d+)\.jpg/);
    const imgNum = imgMatch ? parseInt(imgMatch[1]) : 1;
    const titleIndex = (imgNum - 1) % items.length;

    setAndAnimateTitle(items[titleIndex]);
    item.style.visibility = "hidden";

    const rect = item.getBoundingClientRect();
    const targetImg = item.querySelector("img")!.src;

    state.originalPosition = {
      id: item.id,
      rect: rect,
      imgSrc: targetImg,
    };

    overlay.classList.add("active");

    const expandedItem = document.createElement("div");
    expandedItem.className = "fixed z-[100] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl cursor-pointer";
    expandedItem.style.width = `${itemWidth}px`;
    expandedItem.style.height = `${itemHeight}px`;

    const imgContainer = document.createElement("div");
    imgContainer.className = "relative w-full h-full";

    const img = document.createElement("img");
    img.src = targetImg;
    img.className = "w-full h-full object-cover";
    imgContainer.appendChild(img);

    // Add gradient overlay to expanded item
    const gradientOverlay = document.createElement("div");
    gradientOverlay.className = "absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 mix-blend-overlay";
    imgContainer.appendChild(gradientOverlay);

    expandedItem.appendChild(imgContainer);
    expandedItem.addEventListener("click", closeExpandedItem);
    document.body.appendChild(expandedItem);

    state.expandedItem = expandedItem;

    // Fade out other items - only visible ones for performance
    const visibleItems = document.querySelectorAll(".gallery-grid-item");
    visibleItems.forEach((el) => {
      if (el !== state.activeItem && el.id !== state.activeItemId) {
        gsap.set(el, {
          opacity: 0.3,
          filter: "none", // Remove blur for better performance
        });
      }
    });

    const viewportWidth = window.innerWidth;
    const targetWidth = viewportWidth * 0.5;
    const targetHeight = targetWidth * 1.2;

    gsap.delayedCall(0.3, animateTitleIn);

    // Expand animation
    gsap.fromTo(
      expandedItem,
      {
        width: itemWidth,
        height: itemHeight,
        x: rect.left + itemWidth / 2 - window.innerWidth / 2,
        y: rect.top + itemHeight / 2 - window.innerHeight / 2,
      },
      {
        width: targetWidth,
        height: targetHeight,
        x: 0,
        y: 0,
        duration: 1,
        ease: "hop",
      }
    );
  };

  const closeExpandedItem = () => {
    const state = stateRef.current;
    const container = containerRef.current;
    const overlay = overlayRef.current;

    if (!container || !overlay) return;
    if (!state.expandedItem || !state.originalPosition) return;

    animateTitleOut();
    overlay.classList.remove("active");
    setCursorText("DRAG");

    const originalRect = state.originalPosition.rect;

    // Restore other items immediately
    document.querySelectorAll(".gallery-grid-item").forEach((el) => {
      gsap.killTweensOf(el); // Kill any existing animations
      gsap.set(el, {
        opacity: 1,
        scale: 1,
        filter: "none",
        clearProps: "opacity,scale,filter", // Clear inline styles
      });
    });

    const originalItem = document.getElementById(state.activeItemId!);

    // Close animation with rotation
    gsap.to(state.expandedItem, {
      width: itemWidth,
      height: itemHeight,
      x: originalRect.left + itemWidth / 2 - window.innerWidth / 2,
      y: originalRect.top + itemHeight / 2 - window.innerHeight / 2,
      duration: 0.8,
      ease: "hop",
      onComplete: () => {
        if (state.expandedItem && state.expandedItem.parentNode) {
          document.body.removeChild(state.expandedItem);
        }

        if (originalItem) {
          originalItem.style.visibility = "visible";
        }

        state.expandedItem = null;
        state.isExpanded = false;
        state.activeItem = null;
        state.originalPosition = null;
        state.activeItemId = null;
        state.canDrag = true;
        state.dragVelocityX = 0;
        state.dragVelocityY = 0;
      },
    });
  };

  const animate = () => {
    const state = stateRef.current;
    const canvas = canvasRef.current;

    if (!canvas) return;

    if (state.canDrag) {
      const ease = 0.08;
      state.currentX += (state.targetX - state.currentX) * ease;
      state.currentY += (state.targetY - state.currentY) * ease;

      canvas.style.transform = `translate(${state.currentX}px, ${state.currentY}px)`;

      const now = Date.now();
      const distMoved = Math.sqrt(
        Math.pow(state.currentX - state.lastX, 2) +
          Math.pow(state.currentY - state.lastY, 2)
      );

      if (distMoved > 100 || now - state.lastUpdateTime > 120) {
        updateVisibleItems();
        state.lastX = state.currentX;
        state.lastY = state.currentY;
        state.lastUpdateTime = now;
      }
    }

    state.animationFrameId = requestAnimationFrame(animate);
  };

  const handleMouseDown = (e: MouseEvent) => {
    const state = stateRef.current;

    if (!state.canDrag) return;

    // Prevent default to avoid any text/image selection
    e.preventDefault();

    state.isDragging = true;
    state.mouseHasMoved = false;
    state.startX = e.clientX;
    state.startY = e.clientY;
    setCursorText("DRAGGING");
  };

  const handleMouseMove = (e: MouseEvent) => {
    const state = stateRef.current;

    if (!state.isDragging || !state.canDrag) return;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      state.mouseHasMoved = true;
    }

    const now = Date.now();
    const dt = Math.max(10, now - state.lastDragTime);
    state.lastDragTime = now;

    state.dragVelocityX = dx / dt;
    state.dragVelocityY = dy / dt;

    state.targetX += dx;
    state.targetY += dy;

    state.startX = e.clientX;
    state.startY = e.clientY;
  };

  const handleMouseUp = (e: MouseEvent) => {
    const state = stateRef.current;

    if (!state.isDragging) return;
    state.isDragging = false;

    if (state.canDrag) {
      setCursorText("DRAG");

      if (
        Math.abs(state.dragVelocityX) > 0.1 ||
        Math.abs(state.dragVelocityY) > 0.1
      ) {
        const momentumFactor = 250;
        state.targetX += state.dragVelocityX * momentumFactor;
        state.targetY += state.dragVelocityY * momentumFactor;
      }
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    const state = stateRef.current;

    if (!state.canDrag) return;
    state.isDragging = true;
    state.mouseHasMoved = false;
    state.startX = e.touches[0].clientX;
    state.startY = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const state = stateRef.current;

    if (!state.isDragging || !state.canDrag) return;

    const dx = e.touches[0].clientX - state.startX;
    const dy = e.touches[0].clientY - state.startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      state.mouseHasMoved = true;
    }

    state.targetX += dx;
    state.targetY += dy;

    state.startX = e.touches[0].clientX;
    state.startY = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    stateRef.current.isDragging = false;
  };

  const handleOverlayClick = () => {
    if (stateRef.current.isExpanded) closeExpandedItem();
  };

  const handleResize = () => {
    const state = stateRef.current;

    if (state.isExpanded && state.expandedItem) {
      const viewportWidth = window.innerWidth;
      const targetWidth = viewportWidth * 0.5;
      const targetHeight = targetWidth * 1.2;

      gsap.to(state.expandedItem, {
        width: targetWidth,
        height: targetHeight,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      updateVisibleItems();
    }
  };

  const initializeGallery = () => {
    const container = containerRef.current;
    const overlay = overlayRef.current;

    if (!container || !overlay) return;

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);
    overlay.addEventListener("click", handleOverlayClick);

    updateVisibleItems();
    animate();
  };

  return (
    <>
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-[100px] h-[100px] pointer-events-none z-[10002] mix-blend-difference hidden lg:flex items-center justify-center"
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-pulse" />
          <div className="absolute inset-2 border border-white/20 rounded-full" />
          <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold tracking-wider">
            {cursorText}
          </span>
        </div>
      </div>

      {/* Gallery Container */}
      <div
        className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] cursor-none select-none"
        ref={containerRef}
        style={{
          cursor: stateRef.current.isExpanded ? 'auto' : 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`,
          }} />
        </div>

        {/* Floating Background Elements */}
        <div className="absolute top-20 left-20 w-60 h-60 rounded-full bg-gradient-to-br from-purple-500/5 to-pink-500/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/5 to-green-500/5 blur-3xl animate-pulse" />

        {/* Canvas for Gallery Items */}
        <div className="absolute will-change-transform" ref={canvasRef}></div>

        {/* Overlay */}
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/95 backdrop-blur-md pointer-events-none transition-opacity duration-500 opacity-0 z-[2]"
          ref={overlayRef}
        ></div>
      </div>

      {/* Project Title */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-[10000]" ref={projectTitleRef}>
        <p className="relative h-[60px] text-white [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)] overflow-hidden"></p>
      </div>

      {/* Global styles for dynamically created elements */}
      <style jsx global>{`
        .gallery-grid-item {
          position: absolute;
          cursor: pointer;
          transition: filter 0.5s;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
        }

        .gallery-grid-item img {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          pointer-events: none;
        }

        .gallery-grid-item * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        .overlay.active {
          pointer-events: auto;
          opacity: 1;
        }

        .char {
          position: relative;
          display: inline-block;
          font-family: 'Inter', sans-serif;
          font-size: 48px;
          font-weight: bold;
          letter-spacing: -0.02rem;
          margin-right: 0.05em;
          transform: translateY(0%);
          will-change: transform;
          background: linear-gradient(90deg, #a855f7, #ec4899, #a855f7);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </>
  );
}