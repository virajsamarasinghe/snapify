/* eslint-disable @typescript-eslint/no-explicit-any */
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import dbConnect from "@/lib/db";
import AboutSettings from "@/models/AboutSettings";
import Recognition from "@/models/Recognition";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const SITE_URL = "https://www.jagathkalupahanaphotography.com";

export const metadata: Metadata = {
  title: "About Jagath Kalupahana — Professional Photographer in Sri Lanka",
  description:
    "The biography of Jagath Kalupahana, award-winning Sri Lankan photographer and founder of Studio Nethma in Ratmalana. 12+ years of professional experience across weddings, events, graduations, sports, wildlife and fine-art photography.",
  alternates: { canonical: `${SITE_URL}/about-jagath-kalupahana` },
  openGraph: {
    title: "About Jagath Kalupahana — Professional Photographer in Sri Lanka",
    description:
      "Award-winning Sri Lankan photographer and founder of Studio Nethma, specialising in weddings, events, graduations, sports, wildlife and fine-art photography.",
    url: `${SITE_URL}/about-jagath-kalupahana`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export const revalidate = 3600;

export default async function AboutJagathKalupahanaPage() {
  let about: any = null;
  let recognitions: any[] = [];
  try {
    await dbConnect();
    [about, recognitions] = await Promise.all([
      AboutSettings.findOne()
        .lean()
        .catch(() => null),
      Recognition.find()
        .sort({ order: 1, createdAt: 1 })
        .lean()
        .catch(() => []),
    ]);
  } catch {
    // DB unavailable — static content still renders
  }

  const yearsExperience = about?.stat1Value || "12";
  const exhibitions = about?.stat2Value || "50+";
  const portrait: string | undefined = (about?.photos || []).find(
    (p: string) => typeof p === "string" && p.startsWith("http"),
  );

  const awards = (recognitions as any[]).filter((r) => r.type === "award");
  const exhibitionList = (recognitions as any[]).filter(
    (r) => r.type === "exhibition",
  );

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/about-jagath-kalupahana#profilepage`,
    url: `${SITE_URL}/about-jagath-kalupahana`,
    name: "About Jagath Kalupahana",
    mainEntity: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "About Jagath Kalupahana",
        item: `${SITE_URL}/about-jagath-kalupahana`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
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
              Biography
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Jagath Kalupahana
              </span>
            </h1>
            <p className="text-white/40 text-sm">
              Professional Photographer &middot; Founder of Studio Nethma
              &middot; Ratmalana, Sri Lanka
            </p>
          </div>

          {/* Bio card */}
          <div className="bg-white/2 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm mb-12">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
              <div className="space-y-6 leading-relaxed text-white/70 text-lg">
                <p>
                  Jagath Kalupahana is a professional photographer based in
                  Ratmalana, Sri Lanka, and the founder of Studio Nethma. With
                  more than {yearsExperience} years behind the camera, he
                  specialises in wedding, event, graduation, sports, wildlife
                  and fine-art photography, serving clients in Colombo, the
                  Western Province and across Sri Lanka.
                </p>
                {about?.bio && <p>{about.bio}</p>}
                <p>
                  His personal work — particularly wildlife and fine-art
                  photography from Sri Lanka&apos;s national parks — has been
                  featured in {exhibitions} exhibitions worldwide. Through
                  Studio Nethma he leads a team of photographers, each bringing
                  a distinct style and creative vision to commissioned work.
                </p>
              </div>
              {portrait && (
                <div className="relative w-48 h-64 md:w-56 md:h-72 rounded-2xl overflow-hidden border border-white/10 mx-auto md:mx-0">
                  <Image
                    src={portrait}
                    alt="Jagath Kalupahana, professional photographer in Sri Lanka, founder of Studio Nethma"
                    fill
                    sizes="(max-width: 768px) 192px, 224px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mt-10 pt-10 border-t border-white/5">
              <div>
                <p className="text-4xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {yearsExperience}
                </p>
                <p className="text-white/50 text-sm mt-1">
                  {about?.stat1Label || "Years Experience"}
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {exhibitions}
                </p>
                <p className="text-white/50 text-sm mt-1">
                  {about?.stat2Label || "Global Exhibitions"}
                </p>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="bg-white/2 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm mb-12">
            <h2 className="text-xl font-semibold text-white mb-6">
              Photography Specialties
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                {
                  label: "Wedding Photography",
                  href: "/wedding-photographer-sri-lanka",
                },
                {
                  label: "Event Photography",
                  href: "/event-photographer-colombo",
                },
                {
                  label: "Graduation & Convocation",
                  href: "/graduation-photographer-sri-lanka",
                },
                {
                  label: "Wildlife & Fine Art",
                  href: "/wildlife-photographer-sri-lanka",
                },
                {
                  label: "Sports & Cricket",
                  href: "/sports-photographer-sri-lanka",
                },
              ].map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="px-4 py-2 rounded-full border border-white/10 text-white/70 text-sm hover:text-white hover:border-white/30 transition-colors"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Recognition summary */}
          {(awards.length > 0 || exhibitionList.length > 0) && (
            <div className="bg-white/2 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm mb-12">
              <h2 className="text-xl font-semibold text-white mb-6">
                Awards &amp; Exhibitions
              </h2>
              <ul className="space-y-4">
                {(recognitions as any[]).slice(0, 6).map((r) => (
                  <li key={r._id.toString()} className="flex gap-4">
                    <span className="text-purple-400 font-mono text-sm shrink-0 pt-0.5">
                      {r.year}
                    </span>
                    <div>
                      <p className="text-white/90 font-medium">{r.title}</p>
                      <p className="text-white/50 text-sm">{r.venue}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/awards-and-exhibitions"
                className="inline-block mt-8 text-purple-400 hover:text-purple-300 transition-colors text-sm"
              >
                View all awards and exhibitions →
              </Link>
            </div>
          )}

          {/* Contact */}
          <div className="bg-white/2 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Work with Jagath
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              For bookings, print enquiries or press requests, get in touch
              directly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:+94777901129"
                className="px-8 py-3 rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Call +94 77 790 1129
              </a>
              <a
                href="mailto:studionethma@yahoo.com"
                className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                studionethma@yahoo.com
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
