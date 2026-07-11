import type { Metadata } from "next";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ServiceGallery, {
  type ServiceGalleryPhoto,
} from "../components/ServiceGallery";
import TransitionLink from "../components/TransitionLink";
import { getServicePhotos } from "@/lib/getServicePhotos";

const SITE_URL = "https://www.jagathkalupahanaphotography.com";
const PAGE_URL = `${SITE_URL}/cricket-sports-photography`;

export const metadata: Metadata = {
  title: "Sri Lanka Cricket Photographer | LPL | Jagath K.",
  description:
    "Official Sri Lanka Cricket & LPL photographer. Pro match, action & sports coverage at Premadasa, Galle & Pallekele. 12+ years' experience.",
  keywords: [
    "Sri Lanka cricket photographer",
    "LPL photographer Sri Lanka",
    "sports photographer Sri Lanka",
    "cricket match photographer",
    "Sri Lanka Cricket official photographer",
    "best photographer for cricket matches Sri Lanka",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    title: "Sri Lanka Cricket & Sports Photographer | LPL | Jagath Kalupahana",
    description:
      "Official Sri Lanka Cricket & LPL match coverage. Professional sports & action photography at major Sri Lankan stadiums. 12+ years' experience.",
    url: PAGE_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sri Lanka cricket photographer — Jagath Kalupahana",
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
      name: "Cricket & Sports Photography",
      serviceType: "Sports photography",
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: { "@type": "Country", name: "Sri Lanka" },
      description:
        "Professional cricket and sports photography in Sri Lanka, including national team and LPL coverage at R. Premadasa Stadium, Galle and Pallekele.",
      url: PAGE_URL,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Cricket & Sports Photography",
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
          name: "Who is the best cricket photographer in Sri Lanka?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Jagath Kalupahana is one of Sri Lanka's experienced cricket photographers, with coverage of the national team and LPL teams over 12+ years. Studio Nethma delivers professional match, action and team photography island-wide.",
          },
        },
        {
          "@type": "Question",
          name: "Do you cover LPL matches?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. We have experience photographing Lanka Premier League (LPL) teams and matches, delivering action, player and team photography for clubs, sponsors and media.",
          },
        },
        {
          "@type": "Question",
          name: "Which cricket stadiums do you work at?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We cover Sri Lanka's main international venues, including the R. Premadasa Stadium in Colombo, Galle International Stadium and Pallekele International Cricket Stadium.",
          },
        },
        {
          "@type": "Question",
          name: "Can you photograph other sports?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. While cricket is our specialty, we cover other sports events and tournaments across Sri Lanka. Contact us on +94 777 901 129 to discuss your event.",
          },
        },
        {
          "@type": "Question",
          name: "How quickly can you deliver match photos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We offer fast turnaround for sports coverage, with edited high-resolution images delivered quickly so teams, sponsors and media can publish on time.",
          },
        },
      ],
    },
  ],
};

export const dynamic = "force-dynamic";

export default async function CricketSportsPhotographyPage() {
  const photoSrcs = await getServicePhotos([
    "cricket",
    "sport",
    "lpl",
    "match",
  ]);

  const photos: ServiceGalleryPhoto[] = photoSrcs.map((src, i) => ({
    src,
    alt: `Sri Lanka cricket and sports photography by Jagath Kalupahana — photo ${
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
            Cricket &amp; Sports Photography
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Sri Lanka Cricket &amp; Sports Photographer
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            Jagath Kalupahana is a professional cricket and sports photographer
            in Sri Lanka, with experience covering the Sri Lanka national team
            and Lanka Premier League (LPL). With 12+ years behind the camera, he
            captures fast, high-impact action at major stadiums including the R.
            Premadasa Stadium, Galle and Pallekele.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <TransitionLink
              href="/#contact"
              className="px-7 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors"
            >
              Book match coverage
            </TransitionLink>
            <TransitionLink
              href="/gallery"
              className="px-7 py-3 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-all"
            >
              View full gallery
            </TransitionLink>
          </div>
        </header>

        {/* Official coverage */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Official Sri Lanka Cricket &amp; LPL coverage
          </h2>
          <p className="text-white/70 leading-relaxed mb-6">
            We provide professional match and action photography for cricket in
            Sri Lanka, including national-team coverage and LPL teams. Our
            experience on the boundary line means we capture the key moments —
            wickets, sixes and celebrations — in sharp, publication-ready
            quality.
          </p>
          <ul className="space-y-3 text-white/70">
            {[
              "Sri Lanka national cricket team coverage",
              "Lanka Premier League (LPL) team and match photography",
              "Live action, player portraits and team photos",
              "Press- and media-ready high-resolution images",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-white/40">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Stadiums */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Which stadiums and sports do we shoot?
          </h2>
          <p className="text-white/70 leading-relaxed mb-6">
            We cover cricket across Sri Lanka&apos;s main international venues
            and also shoot other sports and tournaments on request.
          </p>
          <ul className="space-y-3 text-white/70">
            {[
              "R. Premadasa Stadium, Colombo",
              "Galle International Stadium",
              "Pallekele International Cricket Stadium",
              "Domestic and club cricket matches",
              "Other sports events and tournaments island-wide",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-white/40">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Services */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            What sports photography services do we offer?
          </h2>
          <p className="text-white/70 leading-relaxed mb-6">
            From single matches to full tournament coverage, we deliver fast,
            reliable sports photography for teams, sponsors and media.
          </p>
          <ul className="space-y-3 text-white/70">
            {[
              "Full match-day action coverage",
              "Player and team portrait sessions",
              "Tournament and series coverage",
              "Sponsor and branding photography",
              "Fast delivery of edited, high-resolution images",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-white/40">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Why specialist */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Why hire a specialist cricket photographer?
          </h2>
          <p className="text-white/70 leading-relaxed mb-6">
            Sports photography needs the right gear, fast reflexes and knowledge
            of the game. A specialist anticipates the play and frames the
            decisive moment — something general photographers often miss.
          </p>
          <ul className="space-y-3 text-white/70">
            {[
              "Pro-grade telephoto and fast camera equipment",
              "Knowledge of cricket to anticipate key moments",
              "Experience working alongside teams and media",
              "Reliable, consistent results under match pressure",
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
            Cricket &amp; sports photography gallery
          </h2>
          <p className="text-white/60 max-w-3xl leading-relaxed mb-8">
            This cricket and sports gallery features match and action
            photography by Jagath Kalupahana, including Sri Lanka national team
            and LPL coverage at the Premadasa, Galle and Pallekele stadiums —
            professional sports photography in Sri Lanka.
          </p>
          <ServiceGallery
            photos={photos}
            emptyLabel="Cricket and sports photos are being added soon. Contact us to see recent match and LPL coverage."
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
                q: "Who is the best cricket photographer in Sri Lanka?",
                a: "Jagath Kalupahana is one of Sri Lanka's experienced cricket photographers, with coverage of the national team and LPL teams over 12+ years. Studio Nethma delivers professional match, action and team photography island-wide.",
              },
              {
                q: "Do you cover LPL matches?",
                a: "Yes. We have experience photographing Lanka Premier League (LPL) teams and matches, delivering action, player and team photography for clubs, sponsors and media.",
              },
              {
                q: "Which cricket stadiums do you work at?",
                a: "We cover Sri Lanka's main international venues, including the R. Premadasa Stadium in Colombo, Galle International Stadium and Pallekele International Cricket Stadium.",
              },
              {
                q: "Can you photograph other sports?",
                a: "Yes. While cricket is our specialty, we cover other sports events and tournaments across Sri Lanka. Contact us on +94 777 901 129 to discuss your event.",
              },
              {
                q: "How quickly can you deliver match photos?",
                a: "We offer fast turnaround for sports coverage, with edited high-resolution images delivered quickly so teams, sponsors and media can publish on time.",
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
            Need graduation coverage? See our{" "}
            <TransitionLink
              href="/convocation-photography"
              className="text-white underline hover:text-white/80"
            >
              convocation photographer in Sri Lanka
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
