import AboutNew from "./components/AboutNew";
import HeroNew from "./components/HeroNew";
import GalleryShowcaseNew from "./components/GalleryShowcaseNew";
import Achievements from "./components/Achievements";
import GalleryScroll from "./components/GalleryScroll";
import MarketplaceCTA from "./components/MarketplaceCTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <HeroNew />
      <AboutNew />
      <GalleryShowcaseNew />
      <Achievements />
      <GalleryScroll />
      <MarketplaceCTA />
      <Footer />
    </>
  );
}