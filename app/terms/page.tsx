import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
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
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-900/20 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-6 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <p className="text-white/60 text-sm uppercase tracking-[0.3em] mb-4">
              Legal Information
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>
            <p className="text-white/40 text-sm">Last updated: May 2026</p>
          </div>

          {/* Content Card */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-12 backdrop-blur-sm">
            <section className="space-y-12 leading-relaxed">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-4">
                  <span className="text-purple-400 font-mono text-sm opacity-60">
                    01
                  </span>
                  Acceptance of Terms
                </h2>
                <p className="text-white/70">
                  By accessing or using this website, you agree to be bound by
                  these Terms of Service. This website is operated by Studio
                  Nethma (Jagath Kalupahana), Ratmalana, Sri Lanka.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-4">
                  <span className="text-purple-400 font-mono text-sm opacity-60">
                    02
                  </span>
                  Photography Services
                </h2>
                <p className="text-white/70">
                  All photography services provided by Studio Nethma are subject
                  to a separate booking agreement. Bookings are confirmed only
                  upon receipt of a deposit. Studio Nethma reserves the right to
                  decline any booking.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-4">
                  <span className="text-purple-400 font-mono text-sm opacity-60">
                    03
                  </span>
                  Intellectual Property
                </h2>
                <p className="text-white/70">
                  All photographs, images and content displayed on this website
                  are the exclusive intellectual property of Jagath Kalupahana
                  and Studio Nethma. Reproduction, distribution or use of any
                  content without prior written permission is strictly
                  prohibited.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-4">
                  <span className="text-purple-400 font-mono text-sm opacity-60">
                    04
                  </span>
                  Marketplace & Prints
                </h2>
                <p className="text-white/70">
                  Limited edition photography prints sold through the Studio
                  Nethma marketplace are subject to availability. All sales are
                  final unless the product is damaged upon arrival. Worldwide
                  shipping is offered; delivery times vary by location.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-4">
                  <span className="text-purple-400 font-mono text-sm opacity-60">
                    05
                  </span>
                  Limitation of Liability
                </h2>
                <p className="text-white/70">
                  Studio Nethma is not liable for any indirect, incidental or
                  consequential damages arising from the use of this website or
                  our services beyond the value of the services contracted.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-4">
                  <span className="text-purple-400 font-mono text-sm opacity-60">
                    06
                  </span>
                  Governing Law
                </h2>
                <p className="text-white/70">
                  These terms are governed by the laws of Sri Lanka. Any
                  disputes shall be subject to the exclusive jurisdiction of the
                  courts of Sri Lanka.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-4">
                  <span className="text-purple-400 font-mono text-sm opacity-60">
                    07
                  </span>
                  Contact
                </h2>
                <p className="text-white/70">
                  For any questions regarding these terms, contact us at{" "}
                  <a
                    href="mailto:studionethma@yahoo.com"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    studionethma@yahoo.com
                  </a>{" "}
                  or call{" "}
                  <a
                    href="tel:+94777901129"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    +94 777 901 129
                  </a>
                  .
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
