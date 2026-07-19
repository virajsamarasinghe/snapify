import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://www.jagathkalupahanaphotography.com";

// Direct Google review link — replace the query once the Google Business
// Profile short link (g.page/r/...) is available for a friction-free flow.
const GOOGLE_REVIEW_URL =
  "https://www.google.com/search?q=Studio+Nethma+Ratmalana+reviews";

export const metadata: Metadata = {
  title: "Client Reviews — Jagath Kalupahana Photography | Studio Nethma",
  description:
    "Read genuine client reviews of Jagath Kalupahana and the Studio Nethma photography team on Google, and share your own experience of our wedding, event, graduation and portrait photography.",
  alternates: { canonical: `${SITE_URL}/client-reviews` },
  openGraph: {
    title: "Client Reviews — Jagath Kalupahana Photography",
    description:
      "Genuine client reviews of Studio Nethma's wedding, event, graduation and portrait photography in Sri Lanka.",
    url: `${SITE_URL}/client-reviews`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function ClientReviewsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Client Reviews",
        item: `${SITE_URL}/client-reviews`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
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
              Client Experiences
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Client Reviews
              </span>
            </h1>
            <p className="text-white/60 max-w-2xl leading-relaxed">
              Every review of Studio Nethma is written by a real client after a
              real event. We never purchase reviews or offer incentives — the
              feedback you read on our Google profile is genuine.
            </p>
          </div>

          {/* Read reviews */}
          <div className="bg-white/2 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm mb-12">
            <h2 className="text-xl font-semibold text-white mb-4">
              Read our reviews on Google
            </h2>
            <p className="text-white/70 leading-relaxed mb-8">
              Client reviews for Jagath Kalupahana and the Studio Nethma team
              are published on our Google Business Profile, where they cannot be
              edited or filtered by us. See what couples, families, schools and
              companies across Colombo and Sri Lanka have said about working
              with us.
            </p>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              View reviews on Google
            </a>
          </div>

          {/* Leave a review */}
          <div className="bg-white/2 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm mb-12">
            <h2 className="text-xl font-semibold text-white mb-4">
              Worked with us? Share your experience
            </h2>
            <p className="text-white/70 leading-relaxed mb-6">
              If we photographed your wedding, graduation, event or portrait
              session, an honest review helps future clients — and helps us
              improve. A useful review usually mentions:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4 mb-8">
              <li>The type of event and where it took place</li>
              <li>How communication and planning went</li>
              <li>The team&apos;s professionalism on the day</li>
              <li>How and when your photographs were delivered</li>
            </ul>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Write a review on Google
            </a>
          </div>

          {/* CTA */}
          <div className="bg-white/2 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Planning an event?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Browse the portfolio or get in touch to check availability for
              your date.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/gallery"
                className="px-8 py-3 rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                View the portfolio
              </Link>
              <a
                href="tel:+94777901129"
                className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                Call +94 77 790 1129
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
