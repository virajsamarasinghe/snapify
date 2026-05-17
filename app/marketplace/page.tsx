import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import type { Metadata } from "next";
import MarketplaceClient from "./MarketplaceClient";

// Ensure models are registered
import "@/models/Category";
import "@/models/Product";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buy Fine-Art Photography Prints \u2014 Limited Edition",
  description:
    "Purchase limited edition fine-art photography prints by award-winning photographer Jagath Kalupahana. Collections include weddings, wildlife, events and portraits. High-quality prints with worldwide shipping.",
  keywords: [
    "buy photography prints",
    "fine art photography prints",
    "limited edition prints Sri Lanka",
    "Jagath Kalupahana prints",
    "wedding photography prints",
    "wildlife photography prints",
    "photography marketplace",
  ],
  alternates: {
    canonical: "https://www.jagathkalupahanaphotography.com/marketplace",
  },
  openGraph: {
    type: "website",
    title: "Buy Fine-Art Photography Prints | Jagath Kalupahana Marketplace",
    description:
      "Limited edition fine-art photography prints. Weddings, wildlife, events, portraits. Worldwide shipping. By award-winning Sri Lankan photographer Jagath Kalupahana.",
    url: "https://www.jagathkalupahanaphotography.com/marketplace",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fine-Art Photography Prints Marketplace",
      },
    ],
  },
};

export default async function MarketplacePage() {
  await dbConnect();

  // Fetch all products with populated categories
  const productsDocs = await Product.find()
    .sort({ createdAt: -1 })
    .populate("category")
    .lean();

  // Fetch all categories
  const categoriesDocs = await Category.find().sort({ name: 1 }).lean();

  // Calculate counts per category based on fetched products
  const categoryCounts: { [key: string]: number } = {};

  const products = productsDocs.map((doc: any) => {
    const categoryDoc = doc.category;
    if (categoryDoc) {
      const catId = categoryDoc._id.toString();
      categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
    }

    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      price: doc.price,
      images: doc.images || [],
      category: categoryDoc
        ? {
            id: categoryDoc._id.toString(),
            name: categoryDoc.name,
            slug: categoryDoc.slug,
          }
        : { id: "unknown", name: "Unknown", slug: "unknown" },
    };
  });

  const categories = categoriesDocs.map((doc: any) => ({
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    count: categoryCounts[doc._id.toString()] || 0,
  }));

  const SITE_URL = "https://www.jagathkalupahanaphotography.com";

  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "JK Photography Print Store",
    description:
      "Limited edition fine-art photography prints by Jagath Kalupahana. Worldwide shipping.",
    url: `${SITE_URL}/marketplace`,
    image: `${SITE_URL}/og-image.jpg`,
    priceRange: "$$",
    currenciesAccepted: "LKR, USD",
    paymentAccepted: "Credit Card, Bank Transfer",
    address: { "@type": "PostalAddress", addressCountry: "LK" },
    seller: {
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
          name: "Marketplace",
          item: `${SITE_URL}/marketplace`,
        },
      ],
    },
  };

  const itemListSchema =
    products.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Fine-Art Photography Prints",
          url: `${SITE_URL}/marketplace`,
          numberOfItems: products.length,
          itemListElement: products.slice(0, 10).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Product",
              name: p.title,
              description: p.description,
              image: p.images[0]
                ? `${SITE_URL}${p.images[0]}`
                : `${SITE_URL}/og-image.jpg`,
              offers: {
                "@type": "Offer",
                priceCurrency: "LKR",
                price: p.price,
                availability: "https://schema.org/InStock",
                seller: { "@type": "Person", name: "Jagath Kalupahana" },
              },
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <MarketplaceClient
        initialProducts={products}
        initialCategories={categories}
      />
    </>
  );
}
