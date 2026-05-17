import type { Metadata } from "next";

const SITE_URL = "https://www.jagathkalupahanaphotography.com";

export const metadata: Metadata = {
  title: "Terms of Service — Studio Nethma",
  description:
    "Terms of Service for Studio Nethma and jagathkalupahanaphotography.com. Please read these terms before using our website or booking our photography services.",
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: false },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-20 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-gray-400 text-sm mb-10">Last updated: May 2026</p>

      <section className="space-y-8 text-gray-300 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using this website, you agree to be bound by these
            Terms of Service. This website is operated by Studio Nethma (Jagath
            Kalupahana), Ratmalana, Sri Lanka.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            2. Photography Services
          </h2>
          <p>
            All photography services provided by Studio Nethma are subject to a
            separate booking agreement. Bookings are confirmed only upon receipt
            of a deposit. Studio Nethma reserves the right to decline any
            booking.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            3. Intellectual Property
          </h2>
          <p>
            All photographs, images and content displayed on this website are
            the exclusive intellectual property of Jagath Kalupahana and Studio
            Nethma. Reproduction, distribution or use of any content without
            prior written permission is strictly prohibited.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            4. Marketplace & Prints
          </h2>
          <p>
            Limited edition photography prints sold through the Studio Nethma
            marketplace are subject to availability. All sales are final unless
            the product is damaged upon arrival. Worldwide shipping is offered;
            delivery times vary by location.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            5. Limitation of Liability
          </h2>
          <p>
            Studio Nethma is not liable for any indirect, incidental or
            consequential damages arising from the use of this website or our
            services beyond the value of the services contracted.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            6. Governing Law
          </h2>
          <p>
            These terms are governed by the laws of Sri Lanka. Any disputes
            shall be subject to the exclusive jurisdiction of the courts of Sri
            Lanka.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">7. Contact</h2>
          <p>
            For any questions regarding these terms, contact us at{" "}
            <a
              href="mailto:studionethma@yahoo.com"
              className="text-white underline"
            >
              studionethma@yahoo.com
            </a>{" "}
            or call{" "}
            <a href="tel:+94777901129" className="text-white underline">
              +94 777 901 129
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
