"use client";

import { useEffect, useState } from "react";
import AboutNew from "./AboutNew";
import Achievements from "./Achievements";
import ArtisticReveal from "./ArtisticReveal";
import Footer from "./Footer";
import GalleryScroll from "./GalleryScroll";
import GalleryShowcaseNew, { GalleryCategory } from "./GalleryShowcaseNew";
import HeroNew from "./HeroNew";
import MarketplaceCTA from "./MarketplaceCTA";

export interface AchievementItem {
  _id: string;
  year: string;
  title: string;
  venue: string;
  description: string;
  type: "award" | "exhibition" | "feature";
  image: string;
  order: number;
}

interface HomePageWrapperProps {
  categories?: GalleryCategory[];
  heroImages?: any[];
  achievements?: AchievementItem[];
  showMarketplace?: boolean;
  about?: {
    tagline?: string;
    heading?: string;
    headingItalic?: string;
    bio?: string;
    stat1Value?: string;
    stat1Label?: string;
    stat2Value?: string;
    stat2Label?: string;
    photos?: string[];
  };
}

export default function HomePageWrapper({
  categories = [],
  heroImages = [],
  achievements = [],
  showMarketplace = true,
  about = {},
}: HomePageWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    // Check if we've already shown the initial animation in this session
    const hasShownInitialReveal = sessionStorage.getItem(
      "hasShownInitialReveal",
    );

    // If we've already shown it, skip the loading animation
    if (hasShownInitialReveal === "true") {
      setIsLoading(false);
      setContentReady(true);
      return;
    }

    // Mark that we're showing the initial reveal
    sessionStorage.setItem("hasShownInitialReveal", "true");

    // Just wait for DOM ready — don't block on all images loading
    if (document.readyState === "complete") {
      setContentReady(true);
    } else {
      window.addEventListener("load", () => setContentReady(true), {
        once: true,
      });
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <ArtisticReveal onRevealComplete={handleLoadingComplete} />}

      {/* Main content - render immediately but hidden behind loading screen */}
      <div
        className={
          isLoading
            ? "opacity-0"
            : "opacity-100 transition-opacity duration-500"
        }
      >
        <HeroNew animationReady={!isLoading} heroImages={heroImages} />
        <AboutNew {...about} />
        <GalleryShowcaseNew categories={categories} />
        <Achievements achievements={achievements} />
        <GalleryScroll />
        {showMarketplace && <MarketplaceCTA />}
        <Footer />
      </div>
    </>
  );
}
