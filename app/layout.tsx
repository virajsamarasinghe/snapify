import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PageTransition from "./components/PageTransition";
import SmoothScroll from "./components/SmoothScroll";
import { PageTransitionProvider } from "./contexts/PageTransitionContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://www.jagathkalupahanaphotography.com";
const PHOTOGRAPHER_NAME = "Jagath Kalupahana";
const SITE_NAME = "Studio Nethma";
const DESCRIPTION =
  "Studio Nethma — Sri Lanka's award-winning photography company. Led by Senior Photographer Jagath Kalupahana. Weddings, wildlife, sports, events & fine-art photography.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${PHOTOGRAPHER_NAME} | Professional Photographer Sri Lanka`,
    template: `%s | ${PHOTOGRAPHER_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "photographer Sri Lanka",
    "wedding photographer Sri Lanka",
    "wildlife photographer Sri Lanka",
    "professional photographer",
    "Jagath Kalupahana",
    "JK photography",
    "Studio Nethma",
    "Ratmalana photographer",
    "Colombo wedding photographer",
    "Sri Lanka wildlife photographer",
    "portrait photographer",
    "event photographer",
    "school event photographer",
    "university event photographer",
    "army photographer",
    "fine art photography",
    "photography portfolio",
    "buy photography prints",
    "limited edition photo prints",
    "best photographer in Sri Lanka",
    "professional photographer Ratmalana",
    "cricket photographer Sri Lanka",
    "sports photographer Sri Lanka",
    "university graduation photographer",
    "graduation ceremony photographer Sri Lanka",
    "batch photo day photographer",
    "convocation photographer Sri Lanka",
    "event coverage photographer Sri Lanka",
    "corporate event photographer",
    "university batch photo Sri Lanka",
    "sports event photographer Sri Lanka",
    "best photographer Sri Lanka",
    "best wildlife photographer Sri Lanka",
    "award winning photographer Sri Lanka",
    "awarded photographer Sri Lanka",
    "international award winning photographer",
    "best wedding photographer Sri Lanka",
    "top photographer Sri Lanka",
    "Sri Lanka photography awards",
    "wildlife photography Sri Lanka award",
    "most awarded photographer Sri Lanka",
    "professional wildlife photographer Sri Lanka",
    "nature photographer Sri Lanka",
    "photography company Sri Lanka",
    "photography studio Sri Lanka",
    "professional photography team Sri Lanka",
    "wedding photography company Sri Lanka",
    "photography company Ratmalana",
    "photography studio Colombo",
    "team of photographers Sri Lanka",
    "event photography company Sri Lanka",
    "Studio Nethma photography",
  ],
  authors: [{ name: PHOTOGRAPHER_NAME, url: SITE_URL }],
  creator: PHOTOGRAPHER_NAME,
  publisher: PHOTOGRAPHER_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${PHOTOGRAPHER_NAME} | Professional Photographer Sri Lanka`,
    description: DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${PHOTOGRAPHER_NAME} — Professional Photography Portfolio`,
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jk_photography",
    creator: "@jk_photography",
    title: `${PHOTOGRAPHER_NAME} | Professional Photographer`,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
    languages: { "en-US": SITE_URL },
  },
  category: "photography",
  classification: "Photography Portfolio & Marketplace",
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  manifest: "/manifest.json",
  other: {
    "geo.region": "LK",
    "geo.placename": "Sri Lanka",
    "theme-color": "#0a0a0a",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: PHOTOGRAPHER_NAME,
      url: SITE_URL,
      jobTitle: "Senior Photographer & Owner",
      worksFor: { "@id": `${SITE_URL}/#business` },
      founder: { "@id": `${SITE_URL}/#business` },
      hasOccupation: {
        "@type": "Occupation",
        name: "Senior Photographer",
        occupationLocation: { "@type": "Country", name: "Sri Lanka" },
        skills:
          "Wedding Photography, Wildlife Photography, Portrait Photography, Event Photography, Fine Art Photography, Cricket Photography, Sports Photography, University Graduation Photography, Batch Photo Day Photography, Convocation Photography, Corporate Event Photography, Event Coverage Photography, Nature Photography",
      },
      award: [
        "International Photography Excellence Award 2024",
        "Shadows & Light Solo Exhibition 2024",
        "Contemporary Visions Group Exhibition 2023",
        "Wildlife Series Featured Photographer 2023",
        "Architecture Category Winner 2022",
        "Urban Narratives Breakthrough Exhibition 2021",
      ],
      knowsAbout: [
        "Wildlife Photography",
        "Wedding Photography",
        "Sports Photography",
        "Cricket Photography",
        "Nature Photography",
        "Fine Art Photography",
        "University Graduation Photography",
        "Event Coverage Photography",
      ],
      description: DESCRIPTION,
      image: `${SITE_URL}/og-image.jpg`,
      sameAs: [
        "https://www.instagram.com/jagathkalupahana_photography",
        "https://www.facebook.com/share/1AaFHJ5cJj/",
        "https://www.tiktok.com/@j_kalupahana_photography",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "No 144, Raja Mawatha",
        addressLocality: "Ratmalana",
        addressCountry: "LK",
      },
      telephone: "+94777901129",
      email: "studionethma@yahoo.com",
    },
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": `${SITE_URL}/#business`,
      name: SITE_NAME,
      legalName: "Studio Nethma",
      url: SITE_URL,
      description:
        "Studio Nethma is a professional photography company in Sri Lanka with a dedicated team of photographers. Specialising in wedding photography, wildlife, sports, cricket, corporate events, university graduations, batch photo days and fine-art photography. Each photographer brings a unique theme, style and creative vision.",
      image: `${SITE_URL}/og-image.jpg`,
      telephone: "+94777901129",
      email: "studionethma@yahoo.com",
      founder: { "@id": `${SITE_URL}/#person` },
      employee: { "@id": `${SITE_URL}/#person` },
      numberOfEmployees: { "@type": "QuantitativeValue", minValue: 2 },
      slogan: "Capturing Moments, Creating Art",
      address: {
        "@type": "PostalAddress",
        streetAddress: "No 144, Raja Mawatha",
        addressLocality: "Ratmalana",
        addressCountry: "LK",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 6.8211,
        longitude: 79.8834,
      },
      openingHours: "Mo-Sa 09:00-18:00",
      priceRange: "$$",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        bestRating: "5",
        worstRating: "1",
        ratingCount: "12",
        reviewCount: "12",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Photography Services — Studio Nethma",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Wedding Photography",
              description:
                "Full wedding coverage by a dedicated team of photographers with different styles and visions",
            },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Wildlife Photography" },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Event Photography & Coverage",
            },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Portrait Photography" },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Fine Art Photography" },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Cricket & Sports Photography",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "University Graduation Photography",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Batch Photo Day Photography",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Convocation Photography",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Corporate Event Coverage",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "School Event Photography",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Nature & Landscape Photography",
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#person` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/gallery?category={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <meta name="color-scheme" content="dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PageTransitionProvider>
          <PageTransition />
          <SmoothScroll>{children}</SmoothScroll>
        </PageTransitionProvider>
      </body>
    </html>
  );
}
