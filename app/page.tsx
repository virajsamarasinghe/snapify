/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import AboutSettings from "@/models/AboutSettings";
import Album from "@/models/Album";
import Category from "@/models/Category";
import Hero from "@/models/Hero";
import Recognition from "@/models/Recognition";
import SiteSettings from "@/models/SiteSettings";
import type { Metadata } from "next";
import { FAQS } from "./components/faq-data";
import HomePageWrapper from "./components/HomePageWrapper";
// Ensure Product model is registered for populate
import "@/models/Product";

const SITE_URL = "https://www.jagathkalupahanaphotography.com";

export const metadata: Metadata = {
  title:
    "Wedding & Event Photographer Ratmalana, Sri Lanka – Jagath Kalupahana | Studio Nethma",
  description:
    "Studio Nethma — award-winning wedding, wildlife, graduation & event photography studio in Ratmalana, Sri Lanka. Led by Jagath Kalupahana with 12+ years experience, 50+ global exhibitions. Serving Colombo, Western Province and beyond.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title:
      "Wedding & Event Photographer Ratmalana, Sri Lanka – Jagath Kalupahana",
    description:
      "Professional photography studio in Ratmalana, Sri Lanka. Specialising in weddings, wildlife, events & fine-art prints. 12+ years experience, 50+ global exhibitions.",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jagath Kalupahana Photography",
      },
    ],
  },
};

export const dynamic = "force-dynamic";

export default async function Home() {
  await dbConnect();

  // Run all DB queries in parallel — no Cloudinary Admin API needed
  const [
    visibleHeroes,
    categoriesDocs,
    recognitionDocs,
    aboutDoc,
    siteSettingsDoc,
  ] = await Promise.all([
    Hero.find({ isHidden: { $ne: true } })
      .sort({ createdAt: -1 })
      .lean()
      .catch(() => []),
    // Only gallery-visible categories
    Category.find({ showInGallery: { $ne: false } })
      .sort({ name: 1 })
      .populate({ path: "products", select: "images" })
      .lean()
      .catch(() => []),
    Recognition.find()
      .sort({ order: 1, createdAt: 1 })
      .limit(8)
      .lean()
      .catch(() => []),
    AboutSettings.findOne()
      .lean()
      .catch(() => null),
    SiteSettings.findOne()
      .lean()
      .catch(() => null),
  ]);

  // Build hero images list directly from MongoDB
  const heroImages = (visibleHeroes as any[]).map((h: any) => ({
    src: h.src as string,
  }));

  // Fetch all albums for the gallery categories
  const galleryCategoryIds = (categoriesDocs as any[]).map((doc: any) =>
    doc._id.toString(),
  );
  const albumsDocs =
    galleryCategoryIds.length > 0
      ? await Album.find({ category: { $in: galleryCategoryIds } })
          .sort({ conductDate: -1, createdAt: -1 })
          .lean()
          .catch(() => [])
      : [];

  const categories = (categoriesDocs as any[])
    .map((doc: any) => {
      const sizes: ("small" | "medium" | "large")[] = [
        "medium",
        "large",
        "small",
        "medium",
      ];
      const size = sizes[doc.name.length % sizes.length];
      const productImages = doc.products
        ? doc.products.flatMap((p: any) => p.images || [])
        : [];

      // Get albums for this category
      const categoryAlbums = (albumsDocs as any[])
        .filter((a: any) => a.category.toString() === doc._id.toString())
        .map((a: any) => ({
          id: a._id.toString(),
          name: a.name,
          photos: [
            ...(a.coverPhoto ? [a.coverPhoto] : []),
            ...(a.photos || []),
          ].filter(Boolean) as string[],
        }));

      // All album photos
      const albumPhotos = categoryAlbums.flatMap((a: any) => a.photos);

      // Combine: category cover + product images + album photos (all)
      const images = [doc.image, ...productImages, ...albumPhotos].filter(
        Boolean,
      ) as string[];

      return {
        id: doc._id.toString(),
        title: doc.name,
        images: images.length > 0 ? images : [],
        description: `Explore our ${doc.name} collection.`,
        size,
        albums: categoryAlbums,
      };
    })
    .filter((cat: any) => cat.images.length > 0);

  const achievements = (recognitionDocs as any[]).map((doc: any) => ({
    _id: doc._id.toString(),
    year: doc.year,
    title: doc.title,
    venue: doc.venue,
    description: doc.description,
    type: doc.type as "award" | "exhibition" | "feature",
    image: doc.image || "",
    order: doc.order,
  }));

  const aboutSettings = (() => {
    const doc = aboutDoc ? JSON.parse(JSON.stringify(aboutDoc)) : {};
    // Photos are Cloudinary URLs stored directly in MongoDB (same as products/categories)
    if (!Array.isArray(doc.photos)) doc.photos = [];
    // Filter out any stale local paths in case of old data
    doc.photos = (doc.photos as string[]).filter((p) => p.startsWith("http"));
    return doc;
  })();
  const showMarketplace = siteSettingsDoc
    ? (siteSettingsDoc as any).showMarketplace
    : true;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Jagath Kalupahana",
    givenName: "Jagath",
    familyName: "Kalupahana",
    jobTitle: "Professional Photographer",
    description:
      "Award-winning professional photographer with 12+ years of experience specialising in weddings, wildlife, events, portraits and fine-art photography in Sri Lanka and globally.",
    url: SITE_URL,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-image.jpg`,
      caption: "Jagath Kalupahana — Professional Photographer",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "No 144, Raja Mawatha",
      addressLocality: "Ratmalana",
      addressRegion: "Western Province",
      addressCountry: "LK",
    },
    sameAs: [
      "https://www.instagram.com/jagathkalupahana_photography",
      "https://www.facebook.com/share/1AaFHJ5cJj/",
      "https://www.tiktok.com/@j_kalupahana_photography",
    ],
    knowsAbout: [
      "Wedding Photography",
      "Wildlife Photography",
      "Portrait Photography",
      "Event Photography",
      "Fine Art Photography",
      "Documentary Photography",
      "School Event Photography",
      "University Event Photography",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Photographer",
      description: "Professional photography services",
      estimatedSalary: [],
      occupationLocation: { "@type": "Country", name: "Sri Lanka" },
      skills:
        "Wedding Photography, Wildlife Photography, Portrait Photography, Event Coverage",
    },
    award: "50+ Global Photography Exhibitions",
    workExample: [
      {
        "@type": "CreativeWork",
        name: "Wildlife Photography Collection",
        url: `${SITE_URL}/gallery?category=Wildlife`,
      },
      {
        "@type": "CreativeWork",
        name: "Wedding Photography Portfolio",
        url: `${SITE_URL}/gallery?category=Weddings`,
      },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${SITE_URL}/#business`,
    name: "Studio Nethma",
    alternateName: "Jagath Kalupahana Photography",
    description:
      "Studio Nethma is an award-winning professional photography studio in Ratmalana, Sri Lanka, led by Senior Photographer Jagath Kalupahana. Specialising in weddings, wildlife, events, portraits and fine-art photography. Serving Colombo, Western Province and all Sri Lanka.",
    founder: { "@id": `${SITE_URL}/#person` },
    telephone: "+94777901129",
    email: "studionethma@yahoo.com",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-image.jpg`,
    },
    image: `${SITE_URL}/og-image.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "No 144, Raja Mawatha",
      addressLocality: "Ratmalana",
      addressRegion: "Western Province",
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.8158751,
      longitude: 79.8674623,
    },
    areaServed: [
      { "@type": "Country", name: "Sri Lanka" },
      { "@type": "Country", name: "Worldwide" },
    ],
    serviceType: [
      "Wedding Photography",
      "Wildlife Photography",
      "Event Photography",
      "Graduation & Convocation Photography",
      "University Batch Photo Day Photography",
      "Portrait Photography",
      "Fine Art Prints",
    ],
    priceRange: "$$",
    currenciesAccepted: "LKR, USD",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "20:00",
    },
    sameAs: [
      "https://www.instagram.com/jagathkalupahana_photography",
      "https://www.facebook.com/share/1AaFHJ5cJj/",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "JK Photography",
    alternateName: "Jagath Kalupahana Photography",
    url: SITE_URL,
    description:
      "Official photography portfolio and fine-art print marketplace of Jagath Kalupahana",
    inLanguage: "en-US",
    publisher: { "@id": `${SITE_URL}/#person` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/gallery?category={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePageWrapper
        categories={categories}
        heroImages={heroImages}
        achievements={achievements}
        showMarketplace={showMarketplace}
        about={aboutSettings}
        galleryQuote={(siteSettingsDoc as any)?.galleryQuote}
        galleryQuoteAuthor={(siteSettingsDoc as any)?.galleryQuoteAuthor}
      />
    </>
  );
}
