import type { Metadata } from "next";
import WorkClient from "./WorkClient";

export const metadata: Metadata = {
  title: "Portfolio — Selected Works",
  description:
    "Explore the complete portfolio of Jagath Kalupahana. Fine-art photography, documentary work, and curated collections spanning 12+ years of professional experience.",
  alternates: { canonical: "https://snapify-sooty.vercel.app/work" },
  openGraph: {
    title: "Portfolio — Selected Works | Jagath Kalupahana",
    description:
      "12+ years of professional photography. Explore the complete portfolio collection.",
    url: "https://snapify-sooty.vercel.app/work",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Photography Portfolio",
      },
    ],
  },
};

export default function WorkPage() {
  return <WorkClient />;
}
