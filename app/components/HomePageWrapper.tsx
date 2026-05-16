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
}

export default function HomePageWrapper({
  categories = [],
  heroImages = [],
  achievements = [],
  showMarketplace = true,
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
    // Check if all images are loaded
    const checkImagesLoaded = () => {
      const images = document.querySelectorAll("img");
      const imagePromises = Array.from(images).map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }
        return new Promise((resolve) => {
          img.addEventListener("load", resolve);
          img.addEventListener("error", resolve); // Resolve even on error to prevent hanging
        });
      });

      return Promise.all(imagePromises);
    };

    // Check if document is ready and all resources are loaded
    const handlePageLoad = async () => {
      // Wait for window load event if not already loaded
      if (document.readyState === "complete") {
        // Wait a bit for GSAP animations to initialize
        await new Promise((resolve) => setTimeout(resolve, 500));
        await checkImagesLoaded();
        setContentReady(true);
      } else {
        window.addEventListener("load", async () => {
          // Wait a bit for GSAP animations to initialize
          await new Promise((resolve) => setTimeout(resolve, 500));
          await checkImagesLoaded();
          setContentReady(true);
        });
      }
    };

    handlePageLoad();

    // Cleanup
    return () => {
      window.removeEventListener("load", () => {});
    };
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
        <AboutNew />
        <GalleryShowcaseNew categories={categories} />
        <Achievements achievements={achievements} />
        <GalleryScroll />
        {showMarketplace && <MarketplaceCTA />}
        <Footer />
      </div>
    </>
  );
}
