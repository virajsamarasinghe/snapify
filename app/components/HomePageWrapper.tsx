"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "./LoadingScreen";
import AboutNew from "./AboutNew";
import HeroNew from "./HeroNew";
import GalleryShowcaseNew from "./GalleryShowcaseNew";
import Achievements from "./Achievements";
import GalleryScroll from "./GalleryScroll";
import MarketplaceCTA from "./MarketplaceCTA";
import Footer from "./Footer";

export default function HomePageWrapper() {
  const [isLoading, setIsLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    // Check if all images are loaded
    const checkImagesLoaded = () => {
      const images = document.querySelectorAll('img');
      const imagePromises = Array.from(images).map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }
        return new Promise((resolve) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve); // Resolve even on error to prevent hanging
        });
      });

      return Promise.all(imagePromises);
    };

    // Check if document is ready and all resources are loaded
    const handlePageLoad = async () => {
      // Wait for window load event if not already loaded
      if (document.readyState === 'complete') {
        // Wait a bit for GSAP animations to initialize
        await new Promise(resolve => setTimeout(resolve, 500));
        await checkImagesLoaded();
        setContentReady(true);
      } else {
        window.addEventListener('load', async () => {
          // Wait a bit for GSAP animations to initialize
          await new Promise(resolve => setTimeout(resolve, 500));
          await checkImagesLoaded();
          setContentReady(true);
        });
      }
    };

    handlePageLoad();

    // Cleanup
    return () => {
      window.removeEventListener('load', () => {});
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <LoadingScreen
          onLoadingComplete={handleLoadingComplete}
        />
      )}

      {/* Main content - render immediately but hidden behind loading screen */}
      <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
        <HeroNew />
        <AboutNew />
        <GalleryShowcaseNew />
        <Achievements />
        <GalleryScroll />
        <MarketplaceCTA />
        <Footer />
      </div>
    </>
  );
}