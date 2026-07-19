import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServicePage, SERVICE_PAGES, SITE_URL } from "./services-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_PAGES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `${SITE_URL}/${page.slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${SITE_URL}/${page.slug}`,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/${page.slug}#service`,
    name: page.serviceName,
    description: page.metaDescription,
    url: `${SITE_URL}/${page.slug}`,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: page.areaServed.map((name) => ({
      "@type": "Place",
      name,
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
        name: page.h1,
        item: `${SITE_URL}/${page.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
              {page.eyebrow}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {page.h1}
              </span>
            </h1>
            <p className="text-white/40 text-sm">
              Jagath Kalupahana &middot; Studio Nethma &middot; Ratmalana, Sri
              Lanka
            </p>
          </div>

          {/* Intro */}
          <div className="bg-white/2 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm mb-12">
            <div className="space-y-6 leading-relaxed">
              {page.intro.map((para, i) => (
                <p key={i} className="text-white/70 text-lg">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {page.highlights.map((h, i) => (
              <div
                key={h.title}
                className="bg-white/2 border border-white/5 rounded-2xl p-6 backdrop-blur-sm"
              >
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="text-purple-400 font-mono text-sm opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {h.title}
                </h2>
                <p className="text-white/60 text-sm leading-relaxed">
                  {h.text}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-white/2 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Check availability for your date
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Tell us about your event and we&apos;ll get back to you with
              availability and package details.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:+94777901129"
                className="px-8 py-3 rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Call +94 77 790 1129
              </a>
              {page.galleryCategory ? (
                <Link
                  href={`/gallery?category=${encodeURIComponent(page.galleryCategory)}`}
                  className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                >
                  View the portfolio
                </Link>
              ) : (
                <Link
                  href="/gallery"
                  className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                >
                  View the portfolio
                </Link>
              )}
            </div>
          </div>

          {/* Related services */}
          <div className="mt-12">
            <p className="text-white/40 text-sm uppercase tracking-[0.2em] mb-4">
              Other photography services
            </p>
            <div className="flex flex-wrap gap-3">
              {SERVICE_PAGES.filter((s) => s.slug !== page.slug).map((s) => (
                <Link
                  key={s.slug}
                  href={`/${s.slug}`}
                  className="px-4 py-2 rounded-full border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/30 transition-colors"
                >
                  {s.h1}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
