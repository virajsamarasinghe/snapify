/* eslint-disable @typescript-eslint/no-explicit-any */
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import dbConnect from "@/lib/db";
import Recognition from "@/models/Recognition";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const SITE_URL = "https://www.jagathkalupahanaphotography.com";

export const metadata: Metadata = {
  title: "Awards & Exhibitions — Jagath Kalupahana Photography",
  description:
    "Awards, exhibitions and recognition earned by Sri Lankan photographer Jagath Kalupahana — international photography awards, solo and group exhibitions, and featured work.",
  alternates: { canonical: `${SITE_URL}/awards-and-exhibitions` },
  openGraph: {
    title: "Awards & Exhibitions — Jagath Kalupahana Photography",
    description:
      "Awards, exhibitions and recognition earned by Sri Lankan photographer Jagath Kalupahana.",
    url: `${SITE_URL}/awards-and-exhibitions`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export const revalidate = 3600;

const TYPE_LABELS: Record<string, string> = {
  award: "Award",
  exhibition: "Exhibition",
  feature: "Featured Work",
};

export default async function AwardsAndExhibitionsPage() {
  let recognitions: any[] = [];
  try {
    await dbConnect();
    recognitions = await Recognition.find()
      .sort({ order: 1, createdAt: 1 })
      .lean()
      .catch(() => []);
  } catch {
    // DB unavailable — page still renders
  }

  const groups: { type: string; items: any[] }[] = [
    "award",
    "exhibition",
    "feature",
  ]
    .map((type) => ({
      type,
      items: (recognitions as any[]).filter((r) => r.type === type),
    }))
    .filter((g) => g.items.length > 0);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/awards-and-exhibitions#list`,
    name: "Awards and Exhibitions — Jagath Kalupahana",
    itemListElement: (recognitions as any[]).map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: r.title,
        description: r.description,
        dateCreated: r.year,
        locationCreated: r.venue,
        creator: { "@id": `${SITE_URL}/#person` },
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Awards & Exhibitions",
        item: `${SITE_URL}/awards-and-exhibitions`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-900/20 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-6 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <p className="text-white/60 text-sm uppercase tracking-[0.3em] mb-4">
              Recognition
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Awards &amp; Exhibitions
              </span>
            </h1>
            <p className="text-white/60 max-w-2xl leading-relaxed">
              A record of the awards, exhibitions and featured work earned by{" "}
              <Link
                href="/about-jagath-kalupahana"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Jagath Kalupahana
              </Link>{" "}
              over more than a decade of professional photography in Sri Lanka
              and internationally.
            </p>
          </div>

          {recognitions.length === 0 ? (
            <div className="bg-white/2 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm text-white/60">
              Recognition entries are being updated. Please check back soon.
            </div>
          ) : (
            groups.map((group) => (
              <section key={group.type} className="mb-12">
                <h2 className="text-xl font-semibold text-white mb-6 uppercase tracking-[0.2em]">
                  {TYPE_LABELS[group.type]}s
                </h2>
                <div className="space-y-6">
                  {group.items.map((r) => (
                    <article
                      key={r._id.toString()}
                      className="bg-white/2 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm"
                    >
                      <div className="flex flex-col sm:flex-row gap-6">
                        {r.image && (
                          <div className="relative w-full sm:w-40 h-40 rounded-xl overflow-hidden border border-white/10 shrink-0">
                            <Image
                              src={r.image}
                              alt={`${r.title} (${r.year}) — ${TYPE_LABELS[r.type]} received by Jagath Kalupahana at ${r.venue}`}
                              fill
                              sizes="(max-width: 640px) 100vw, 160px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-purple-400 font-mono text-sm">
                              {r.year}
                            </span>
                            <span className="text-white/30 text-xs uppercase tracking-wider">
                              {TYPE_LABELS[r.type]}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {r.title}
                          </h3>
                          <p className="text-white/50 text-sm mb-3">
                            {r.venue}
                          </p>
                          <p className="text-white/70 text-sm leading-relaxed">
                            {r.description}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}

          {/* CTA */}
          <div className="bg-white/2 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              See the work behind the recognition
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <Link
                href="/gallery"
                className="px-8 py-3 rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                View the portfolio
              </Link>
              <Link
                href="/about-jagath-kalupahana"
                className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                About Jagath Kalupahana
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
