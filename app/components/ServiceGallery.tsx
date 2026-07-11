"use client";

import Image from "next/image";
import { useState } from "react";

export interface ServiceGalleryPhoto {
  src: string;
  alt: string;
}

interface ServiceGalleryProps {
  photos: ServiceGalleryPhoto[];
  emptyLabel?: string;
}

export default function ServiceGallery({
  photos,
  emptyLabel = "New photos are being added to this gallery. Contact us to see our latest work.",
}: ServiceGalleryProps) {
  const [active, setActive] = useState<number | null>(null);

  if (!photos.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center text-white/50">
        {emptyLabel}
      </div>
    );
  }

  const close = () => setActive(null);
  const go = (dir: "prev" | "next") => {
    if (active === null) return;
    const next =
      dir === "prev"
        ? Math.max(0, active - 1)
        : Math.min(photos.length - 1, active + 1);
    setActive(next);
  };

  return (
    <>
      <div className="columns-2 md:columns-3 gap-3 sm:gap-4 [column-fill:balance]">
        {photos.map((photo, i) => (
          <button
            key={`${photo.src}-${i}`}
            onClick={() => setActive(i)}
            className="group mb-3 sm:mb-4 block w-full overflow-hidden rounded-xl bg-white/5 break-inside-avoid"
            aria-label={photo.alt}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={600}
              height={800}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 p-4"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-6 right-6 text-white/70 hover:text-white"
            aria-label="Close"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {active > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                go("prev");
              }}
              className="absolute left-4 sm:left-8 text-white/70 hover:text-white"
              aria-label="Previous photo"
            >
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div
            className="relative max-h-[85vh] w-auto max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[active].src}
              alt={photos[active].alt}
              width={1400}
              height={1000}
              sizes="100vw"
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
          </div>
          {active < photos.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                go("next");
              }}
              className="absolute right-4 sm:right-8 text-white/70 hover:text-white"
              aria-label="Next photo"
            >
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}
