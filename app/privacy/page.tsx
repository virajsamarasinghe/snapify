import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import type { Metadata } from "next";

const SITE_URL = "https://www.jagathkalupahanaphotography.com";

export const metadata: Metadata = {
  title: "Privacy Policy — Studio Nethma",
  description:
    "Privacy Policy for Studio Nethma and jagathkalupahanaphotography.com. Learn how we collect, use and protect your personal information.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: false },
};

export default function PrivacyPage() {
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
                Privacy Policy
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
                  Who We Are
                </h2>
                <p className="text-white/70">
                  Studio Nethma is a professional photography company based in
                  Ratmalana, Sri Lanka, operated by Jagath Kalupahana. Our
                  website is{" "}
                  <a
                    href={SITE_URL}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    jagathkalupahanaphotography.com
                  </a>
                  . Contact: studionethma@yahoo.com
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-4">
                  <span className="text-purple-400 font-mono text-sm opacity-60">
                    02
                  </span>
                  Information We Collect
                </h2>
                <p className="text-white/70 mb-4">
                  We may collect the following information when you use our
                  website:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                  <li>Name and email address submitted via the contact form</li>
                  <li>Phone number if provided voluntarily</li>
                  <li>
                    Technical data such as browser type and pages visited (via
                    analytics)
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-4">
                  <span className="text-purple-400 font-mono text-sm opacity-60">
                    03
                  </span>
                  How We Use Your Information
                </h2>
                <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                  <li>To respond to enquiries and booking requests</li>
                  <li>To improve our website and services</li>
                  <li>We do not sell or share your data with third parties</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-4">
                  <span className="text-purple-400 font-mono text-sm opacity-60">
                    04
                  </span>
                  Cookies
                </h2>
                <p className="text-white/70">
                  Our website may use essential cookies to ensure the site
                  functions correctly. No third-party advertising cookies are
                  used.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-4">
                  <span className="text-purple-400 font-mono text-sm opacity-60">
                    05
                  </span>
                  Data Retention
                </h2>
                <p className="text-white/70">
                  Contact form submissions are retained only as long as
                  necessary to respond to your enquiry and are not stored
                  indefinitely.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-4">
                  <span className="text-purple-400 font-mono text-sm opacity-60">
                    06
                  </span>
                  Your Rights
                </h2>
                <p className="text-white/70">
                  You have the right to request access to, correction of, or
                  deletion of any personal data we hold about you. Contact us at{" "}
                  <a
                    href="mailto:studionethma@yahoo.com"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    studionethma@yahoo.com
                  </a>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-4">
                  <span className="text-purple-400 font-mono text-sm opacity-60">
                    07
                  </span>
                  Changes to This Policy
                </h2>
                <p className="text-white/70">
                  We may update this Privacy Policy from time to time. Any
                  changes will be posted on this page with an updated date.
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
