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
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-20 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-10">Last updated: May 2026</p>

      <section className="space-y-8 text-gray-300 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            1. Who We Are
          </h2>
          <p>
            Studio Nethma is a professional photography company based in
            Ratmalana, Sri Lanka, operated by Jagath Kalupahana. Our website is{" "}
            <a href={SITE_URL} className="text-white underline">
              jagathkalupahanaphotography.com
            </a>
            . Contact: studionethma@yahoo.com
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            2. Information We Collect
          </h2>
          <p>
            We may collect the following information when you use our website:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Name and email address submitted via the contact form</li>
            <li>Phone number if provided voluntarily</li>
            <li>
              Technical data such as browser type and pages visited (via
              analytics)
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To respond to enquiries and booking requests</li>
            <li>To improve our website and services</li>
            <li>We do not sell or share your data with third parties</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">4. Cookies</h2>
          <p>
            Our website may use essential cookies to ensure the site functions
            correctly. No third-party advertising cookies are used.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            5. Data Retention
          </h2>
          <p>
            Contact form submissions are retained only as long as necessary to
            respond to your enquiry and are not stored indefinitely.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            6. Your Rights
          </h2>
          <p>
            You have the right to request access to, correction of, or deletion
            of any personal data we hold about you. Contact us at{" "}
            <a
              href="mailto:studionethma@yahoo.com"
              className="text-white underline"
            >
              studionethma@yahoo.com
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            7. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated date.
          </p>
        </div>
      </section>
    </main>
  );
}
