"use client";

import Gallery from "@/app/components/Gallery";
import Image from "next/image";

export default function Work() {
  return (
    <>
      {/* Navigation - Same style as homepage */}
      <nav className="fixed top-0 left-0 w-full h-20 px-6 pt-6 pb-6 pl-[120px] flex justify-between items-center z-[10001] mix-blend-difference">
        <div className="logo-name">
          <a
            href="/"
            className="text-2xl font-medium text-[#f5f5f5] no-underline"
          >
            JK
          </a>
        </div>

        <div className="nav-items flex items-center gap-[120px]">
          <div className="nav-links flex items-center gap-2">
            <a
              href="/work"
              className="text-base font-medium text-[#f5f5f5] no-underline"
            >
              Work
            </a>
            <p className="text-base font-medium text-[#a0a0a0]">/</p>
            <a
              href="#"
              className="text-base font-medium text-[#a0a0a0] hover:text-[#f5f5f5] transition-colors no-underline"
            >
              Gallery
            </a>
            <p className="text-base font-medium text-[#a0a0a0]">/</p>
            <a
              href="#"
              className="text-base font-medium text-[#a0a0a0] hover:text-[#f5f5f5] transition-colors no-underline"
            >
              About
            </a>
          </div>

          <div className="nav-cta">
            <a
              href="#"
              className="text-base font-medium text-[#f5f5f5] border border-[#555] px-6 py-2 rounded-full hover:bg-[#f5f5f5] hover:text-[#0a0a0a] transition-all no-underline inline-block"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Sidebar - Without divider line */}
      <div className="fixed top-0 left-0 w-20 h-screen pt-6 flex justify-center items-start z-[10001] mix-blend-difference">
        <div className="sidebar-logo w-8 aspect-square">
          <Image
            src="/hero/camera.jpg"
            alt=""
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <Gallery />
    </>
  );
}
