import type { Metadata } from "next";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import TransitionLink from "../components/TransitionLink";

const SITE_URL = "https://www.jagathkalupahanaphotography.com";
const PAGE_URL = `${SITE_URL}/about-jagath-kalupahana`;

export const metadata: Metadata = {
  title: "About Jagath Kalupahana | Studio Nethma",
  description:
    "Meet Jagath Kalupahana — Ratmalana-based photographer with 12+ years' experience in convocation, cricket, sports & event photography across Sri Lanka.",
  keywords: [
    "Jagath Kalupahana",
    "Studio Nethma",
    "photographer Ratmalana",
    "professional photographer Sri Lanka",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "profile",
    title: "About Jagath Kalupahana | Studio Nethma",
    description:
      "Ratmalana-based photographer with 12+ years' experience in convocation, cricket, sports and event photography across Sri Lanka.",
    url: PAGE_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Jagath Kalupahana — Studio Nethma",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${PAGE_URL}/#profilepage`,
      url: PAGE_URL,
      name: "About Jagath Kalupahana",
      mainEntity: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "About Jagath Kalupahana",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

export default function AboutJagathPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar className="bg-[#0a0a0a]/95 backdrop-blur-md" />

      <article className="container mx-auto px-6 lg:px-12 pt-32 sm:pt-40 pb-20">
        <header className="max-w-3xl">
          <p className="text-white/50 uppercase tracking-widest text-xs sm:text-sm mb-4">
            About — Studio Nethma
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            About Jagath Kalupahana
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            Jagath Kalupahana is a professional photographer based in Ratmalana,
            Sri Lanka, and the founder of Studio Nethma. With 12+ years&apos;
            experience, he specialises in convocation, cricket and sports, and
            event photography, and has provided official coverage for Sri Lanka
            Cricket and the Lanka Premier League (LPL).
          </p>
        </header>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">My experience</h2>
          <p className="text-white/70 leading-relaxed">
            Over 12+ years, I&apos;ve photographed university convocations,
            international cricket and major events across Sri Lanka. My work
            focuses on capturing real moments with technical precision — from a
            graduate crossing the stage to a match-winning six.
          </p>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            What I specialise in
          </h2>
          <ul className="space-y-3 text-white/70">
            {[
              "Convocation and university event photography",
              "Cricket and sports photography (Sri Lanka team, LPL)",
              "Corporate and media event coverage",
              "Working across Colombo, Galle, Kandy and island-wide",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-white/40">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Studio Nethma</h2>
          <p className="text-white/70 leading-relaxed">
            Studio Nethma is my Ratmalana-based photography studio. We bring
            professional gear, reliable delivery and years of on-the-ground
            experience to every assignment, large or small.
          </p>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Recognition and trust
          </h2>
          <ul className="space-y-3 text-white/70">
            {[
              "12+ years of professional experience",
              "Official photographer for Sri Lanka Cricket & LPL coverage",
              "Trusted by universities, teams and corporate clients island-wide",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-white/40">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Work with me</h2>
          <p className="text-white/70 leading-relaxed mb-6">
            Ready to book? Call{" "}
            <a
              href="tel:+94777901129"
              className="text-white underline hover:text-white/80"
            >
              +94 777 901 129
            </a>
            , email{" "}
            <a
              href="mailto:studionethma@yahoo.com"
              className="text-white underline hover:text-white/80"
            >
              studionethma@yahoo.com
            </a>
            , or message us on WhatsApp. We cover convocations, cricket and
            events across Sri Lanka.
          </p>
          <div className="flex flex-wrap gap-4">
            <TransitionLink
              href="/convocation-photography"
              className="px-7 py-3 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-all"
            >
              Convocation photography
            </TransitionLink>
            <TransitionLink
              href="/cricket-sports-photography"
              className="px-7 py-3 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-all"
            >
              Cricket &amp; sports photography
            </TransitionLink>
          </div>
        </section>
      </article>

      <Footer />
    </main>
  );
}
