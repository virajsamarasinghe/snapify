import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Photography Gallery",
  description:
    "Browse Jagath Kalupahana's photography gallery — weddings, wildlife, university events, army coverage, school events and world photography collections. Award-winning images from Sri Lanka and beyond.",
  alternates: { canonical: "https://snapify-sooty.vercel.app/gallery" },
  openGraph: {
    title: "Photography Gallery | Jagath Kalupahana",
    description:
      "Browse award-winning photography collections: weddings, wildlife, events, portraits and more.",
    url: "https://snapify-sooty.vercel.app/gallery",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Photography Gallery",
      },
    ],
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
