import type { Metadata } from "next";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ServiceGallery, {
  type ServiceGalleryPhoto,
} from "../components/ServiceGallery";
import TransitionLink from "../components/TransitionLink";
import { getServicePhotos } from "@/lib/getServicePhotos";

const SITE_URL = "https://www.jagathkalupahanaphotography.com";
const PAGE_URL = `${SITE_URL}/convocation-photography`;

export const metadata: Metadata = {
  title: "Convocation Photographer Sri Lanka | Jagath K.",
  description:
    "Sri Lanka's trusted convocation & graduation photographer. University ceremonies in Colombo, Kandy, Galle & island-wide. Book your batch photo day.",
  keywords: [
    "convocation photographer Sri Lanka",
    "graduation photographer Sri Lanka",
    "university batch photo Sri Lanka",
    "convocation photography Colombo",
    "batch photo day photographer",
    "graduation ceremony photographer Sri Lanka",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    title: "Convocation Photographer Sri Lanka | Jagath Kalupahana",
    description:
      "Trusted convocation & graduation photography for universities across Sri Lanka. 12+ years' experience. Book your ceremony or batch photo day.",
    url: PAGE_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Convocation photographer Sri Lanka — Jagath Kalupahana",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}/#service`,
      name: "Convocation & Graduation Photography",
      serviceType: "Convocation photography",
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: { "@type": "Country", name: "Sri Lanka" },
      description:
        "Professional convocation, graduation and batch photo day photography for universities across Sri Lanka, including Colombo, Kandy and Galle.",
      url: PAGE_URL,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Convocation Photography",
          item: PAGE_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "How much does convocation photography cost in Sri Lanka?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Convocation photography in Sri Lanka depends on coverage time, the number of graduates and whether you want prints. Studio Nethma offers individual and batch group rates — contact us on +94 777 901 129 for a quote.",
          },
        },
        {
          "@type": "Question",
          name: "Do you travel to universities outside Colombo?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. We are based in Ratmalana and travel island-wide, including Kandy and Galle, to cover convocations and batch photo days across Sri Lanka.",
          },
        },
        {
          "@type": "Question",
          name: "How far in advance should I book a convocation photographer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Book as early as possible, ideally a few weeks before your ceremony. Convocation dates are busy, so early booking secures your slot and lets us plan group photos.",
          },
        },
        {
          "@type": "Question",
          name: "Can you photograph the whole batch as well as individuals?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. We cover individual graduate portraits, friend groups and full batch photographs, with group rates for large student groups.",
          },
        },
        {
          "@type": "Question",
          name: "When will I receive my graduation photos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You receive edited, high-resolution digital images after the ceremony, with a fast turnaround. Printed albums and framed prints are available on request.",
          },
        },
      ],
    },
  ],
};

export const dynamic = "force-dynamic";

export default async function ConvocationPhotographyPage() {
  const photoSrcs = await getServicePhotos([
    "convocation",
    "graduation",
    "university",
    "batch",
  ]);

  const photos: ServiceGalleryPhoto[] = photoSrcs.map((src, i) => ({
    src,
    alt: `Convocation and graduation photography in Sri Lanka by Jagath Kalupahana — photo ${
      i + 1
    }`,
  }));

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar className="bg-[#0a0a0a]/95 backdrop-blur-md" />

      <article className="container mx-auto px-6 lg:px-12 pt-32 sm:pt-40 pb-20">
        {/* Hero */}
        <header className="max-w-3xl">
          <p className="text-white/50 uppercase tracking-widest text-xs sm:text-sm mb-4">
            Convocation &amp; Graduation Photography
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Convocation Photographer in Sri Lanka
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            Jagath Kalupahana is a trusted convocation and graduation
            photographer in Sri Lanka, with 12+ years&apos; experience covering
            university ceremonies and batch photo days. Based in Ratmalana and
            working island-wide, he captures clear, professional graduation
            photos for students, families and universities across Colombo, Kandy
            and Galle.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <TransitionLink
              href="/#contact"
              className="px-7 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors"
            >
              Book your convocation shoot
            </TransitionLink>
            <TransitionLink
              href="/gallery"
              className="px-7 py-3 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-all"
            >
              View full gallery
            </TransitionLink>
          </div>
        </header>

        {/* Why choose */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Why choose Jagath for your convocation photos?
          </h2>
          <p className="text-white/70 leading-relaxed mb-6">
            Convocation day happens once. You need a photographer who knows the
            flow of a university ceremony, works fast in crowded halls, and
            delivers sharp, well-lit photos.
          </p>
          <ul className="space-y-3 text-white/70">
            {[
              "12+ years photographing graduations and university events",
              "Experienced with full convocation ceremonies and batch photo days",
              "Fast turnaround and high-resolution, print-ready images",
              "Calm, organised coverage that respects the ceremony schedule",
              "Island-wide travel from our Ratmalana studio",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-white/40">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Universities */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Which universities and ceremonies do we cover?
          </h2>
          <p className="text-white/70 leading-relaxed mb-6">
            We photograph convocations, graduations and batch photo days for
            universities and higher-education institutes across Sri Lanka,
            including ceremonies in Colombo, Kandy, Galle and other cities.
          </p>
          <ul className="space-y-3 text-white/70">
            {[
              "Full convocation ceremony coverage",
              "Individual graduate portraits in robes",
              "Group and batch photographs",
              "Family and parent photos on the day",
              "Candid moments and celebration shots",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-white/40">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Packages */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            What&apos;s included in a convocation photography package?
          </h2>
          <p className="text-white/70 leading-relaxed mb-6">
            Every package is built around your ceremony and group size. We offer
            flexible coverage for individual graduates, friend groups and full
            batches.
          </p>
          <ul className="space-y-3 text-white/70">
            {[
              "Pre-ceremony portraits in graduation robes",
              "Ceremony and stage-moment coverage",
              "Group and batch photos",
              "Edited, high-resolution digital images",
              "Optional printed albums and framed prints",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-white/40">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Gallery */}
        <section className="mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Convocation photography gallery
          </h2>
          <p className="text-white/60 max-w-3xl leading-relaxed mb-8">
            These convocation photos are real graduation and batch photo day
            coverage by Jagath Kalupahana across Sri Lankan universities in
            Colombo, Kandy and Galle. As a specialist convocation photographer
            in Sri Lanka, he captures clear, print-ready ceremony and group
            photos.
          </p>
          <ServiceGallery
            photos={photos}
            emptyLabel="Convocation photos are being added soon. Contact us to see recent graduation and batch photo day coverage."
          />
        </section>

        {/* FAQ */}
        <section className="mt-20 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-8">
            {[
              {
                q: "How much does convocation photography cost in Sri Lanka?",
                a: "Convocation photography in Sri Lanka usually depends on coverage time, the number of graduates and whether you want prints. Studio Nethma offers individual and batch group rates — contact us on +94 777 901 129 for a quote for your ceremony.",
              },
              {
                q: "Do you travel to universities outside Colombo?",
                a: "Yes. We are based in Ratmalana and travel island-wide, including Kandy, Galle and other university cities, to cover convocations and batch photo days across Sri Lanka.",
              },
              {
                q: "How far in advance should I book a convocation photographer?",
                a: "Book as early as possible, ideally a few weeks before your ceremony. Convocation dates are busy, so early booking secures your slot and lets us plan group photos.",
              },
              {
                q: "Can you photograph the whole batch as well as individuals?",
                a: "Yes. We cover individual graduate portraits, friend groups and full batch photographs, and can arrange group rates for large student groups.",
              },
              {
                q: "When will I receive my graduation photos?",
                a: "You receive edited, high-resolution digital images after the ceremony, with a fast turnaround. Printed albums and framed prints are available on request.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-white/70 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cross links */}
        <section className="mt-20 border-t border-white/10 pt-10">
          <p className="text-white/60">
            Looking for sports coverage instead? See our{" "}
            <TransitionLink
              href="/cricket-sports-photography"
              className="text-white underline hover:text-white/80"
            >
              Sri Lanka cricket &amp; sports photographer
            </TransitionLink>{" "}
            page, or learn more{" "}
            <TransitionLink
              href="/about-jagath-kalupahana"
              className="text-white underline hover:text-white/80"
            >
              about Jagath Kalupahana
            </TransitionLink>
            .
          </p>
        </section>
      </article>

      <Footer />
    </main>
  );
}
