import type { Metadata } from "next";
import WorkClient from "./WorkClient";

const SITE_URL = "https://www.jagathkalupahanaphotography.com";

export const metadata: Metadata = {
  title: "Portfolio — Selected Works & Fine Art",
  description:
    "Explore the complete portfolio of Jagath Kalupahana. Fine-art photography, documentary work, and curated collections spanning 12+ years of professional photography experience in Sri Lanka and internationally.",
  keywords: [
    "photography portfolio Sri Lanka",
    "fine art photography",
    "documentary photography",
    "Jagath Kalupahana works",
    "professional photography portfolio",
  ],
  alternates: { canonical: `${SITE_URL}/work` },
  openGraph: {
    type: "website",
    title: "Portfolio — Selected Works & Fine Art | Jagath Kalupahana",
    description:
      "12+ years of award-winning professional photography. Explore the complete portfolio: fine art, documentary, weddings, wildlife and events.",
    url: `${SITE_URL}/work`,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jagath Kalupahana Photography Portfolio",
      },
    ],
  },
};

const portfolioSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: "Photography Portfolio — Jagath Kalupahana",
  description:
    "Complete portfolio of fine-art, documentary and professional photography by Jagath Kalupahana.",
  url: `${SITE_URL}/work`,
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Jagath Kalupahana",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portfolio",
        item: `${SITE_URL}/work`,
      },
    ],
  },
};

export default function WorkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
      <WorkClient />
    </>
  );
}
