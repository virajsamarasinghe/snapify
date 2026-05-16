/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import AboutSettings from "@/models/AboutSettings";
import Category from "@/models/Category";
import Hero from "@/models/Hero";
import Recognition from "@/models/Recognition";
import SiteSettings from "@/models/SiteSettings";
import fs from "fs/promises";
import type { Metadata } from "next";
import path from "path";
import HomePageWrapper from "./components/HomePageWrapper";
// Ensure Product model is registered for populate
import "@/models/Product";

const SITE_URL = "https://snapify-sooty.vercel.app";

export const metadata: Metadata = {
  title: "Jagath Kalupahana | Professional Photographer Sri Lanka",
  description:
    "Welcome to the official portfolio of Jagath Kalupahana — award-winning photographer with 12+ years experience in weddings, wildlife, events and fine-art photography across Sri Lanka and globally.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Jagath Kalupahana | Professional Photographer Sri Lanka",
    description:
      "Award-winning professional photographer. 12+ years experience, 50+ global exhibitions. Specialising in weddings, wildlife, events and portraits.",
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

  const heroDir = path.join(process.cwd(), "public/hero");

  // Run all DB queries + file read in parallel
  const [
    hiddenHeroes,
    heroFiles,
    categoriesDocs,
    recognitionDocs,
    aboutDoc,
    siteSettingsDoc,
  ] = await Promise.all([
    Hero.find({ isHidden: true })
      .select("src")
      .lean()
      .catch(() => []),
    fs.readdir(heroDir).catch(() => [] as string[]),
    Category.find()
      .sort({ name: 1 })
      .populate({ path: "products", select: "images", options: { limit: 5 } })
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

  // Build hero images list
  const hiddenSrcs = (hiddenHeroes as any[]).map((h: any) => h.src);
  const heroImages = (heroFiles as string[])
    .filter((file) =>
      [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(
        path.extname(file).toLowerCase(),
      ),
    )
    .map((file) => ({ src: `/hero/${file}` }))
    .filter((img) => !hiddenSrcs.includes(img.src));

  const categories = (categoriesDocs as any[]).map((doc: any) => {
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
    const images = [doc.image, ...productImages].filter(Boolean);
    return {
      id: doc._id.toString(),
      title: doc.name,
      images: images.length > 0 ? images : ["/placeholder.jpg"],
      description: `Explore our ${doc.name} collection.`,
      size,
    };
  });

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

  // Serialize to plain object — ObjectId/_id must be stripped before passing to Client Components
  const aboutSettings = aboutDoc ? JSON.parse(JSON.stringify(aboutDoc)) : {};
  const showMarketplace = siteSettingsDoc
    ? (siteSettingsDoc as any).showMarketplace
    : true;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jagath Kalupahana",
    jobTitle: "Professional Photographer",
    description:
      "Award-winning professional photographer with 12+ years of experience specialising in weddings, wildlife, events, portraits and fine-art photography.",
    url: SITE_URL,
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
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Photographer",
      occupationLocation: { "@type": "Country", name: "Sri Lanka" },
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JK Photography",
    url: SITE_URL,
    description:
      "Official photography portfolio and print marketplace of Jagath Kalupahana",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/gallery?category={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What types of photography does Jagath Kalupahana specialise in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Jagath Kalupahana specialises in wedding photography, wildlife photography, event coverage, portrait photography, and fine-art photography.",
        },
      },
      {
        "@type": "Question",
        name: "How many years of photography experience does Jagath Kalupahana have?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Jagath Kalupahana has over 12 years of professional photography experience with 50+ global exhibitions.",
        },
      },
      {
        "@type": "Question",
        name: "Can I purchase prints from Jagath Kalupahana?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, fine-art prints are available through the marketplace on this website.",
        },
      },
      {
        "@type": "Question",
        name: "Where is Jagath Kalupahana based?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Jagath Kalupahana is based in Sri Lanka and has exhibited work globally.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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
      />
    </>
  );
}
