"use client";

import Gallery from "@/app/components/Gallery";

export default function Work() {
  return (
    <>
      <nav className="fixed top-0 left-0 w-full p-4 flex justify-between gap-8 mix-blend-difference z-[10000]">
        <div className="flex-1">
          <a href="/" className="block text-white text-sm font-semibold tracking-tight">Snapify</a>
        </div>
        <div className="flex gap-8">
          <a href="#" className="text-white text-sm font-semibold tracking-tight">About</a>
          <a href="#" className="text-white text-sm font-semibold tracking-tight">Contact</a>
          <div className="flex gap-8">
            <a href="#" className="text-white text-sm font-semibold tracking-tight">FB</a>
            <a href="#" className="text-white text-sm font-semibold tracking-tight">IG</a>
            <a href="#" className="text-white text-sm font-semibold tracking-tight">YT</a>
          </div>
        </div>
      </nav>

      <footer className="fixed bottom-0 left-0 w-full p-4 flex justify-between gap-8 mix-blend-difference z-[10000]">
        <p className="text-white text-sm font-semibold tracking-tight">Experiment 445</p>
        <p className="text-white text-sm font-semibold tracking-tight">Unlock Source Code with PRO</p>
      </footer>

      <Gallery />
    </>
  );
}