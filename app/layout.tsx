import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PageTransition from "./components/PageTransition";
import SmoothScroll from "./components/SmoothScroll";
import { PageTransitionProvider } from "./contexts/PageTransitionContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://snapify-sooty.vercel.app";
const PHOTOGRAPHER_NAME = "Jagath Kalupahana";
const SITE_NAME = "JK Photography";
const DESCRIPTION =
  "Award-winning professional photographer Jagath Kalupahana — specialising in weddings, wildlife, events, portraits and fine-art photography in Sri Lanka. 12+ years experience, 50+ global exhibitions.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${PHOTOGRAPHER_NAME} | Professional Photographer Sri Lanka`,
    template: `%s | ${PHOTOGRAPHER_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "photographer Sri Lanka",
    "wedding photographer Sri Lanka",
    "wildlife photographer Sri Lanka",
    "professional photographer",
    "Jagath Kalupahana",
    "JK photography",
    "portrait photographer",
    "event photographer",
    "school event photographer",
    "university event photographer",
    "army photographer",
    "fine art photography",
    "photography portfolio",
    "buy photography prints",
    "limited edition photo prints",
  ],
  authors: [{ name: PHOTOGRAPHER_NAME, url: SITE_URL }],
  creator: PHOTOGRAPHER_NAME,
  publisher: PHOTOGRAPHER_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${PHOTOGRAPHER_NAME} | Professional Photographer Sri Lanka`,
    description: DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${PHOTOGRAPHER_NAME} — Professional Photography Portfolio`,
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jk_photography",
    creator: "@jk_photography",
    title: `${PHOTOGRAPHER_NAME} | Professional Photographer`,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
    languages: { "en-US": SITE_URL },
  },
  category: "photography",
  classification: "Photography Portfolio & Marketplace",
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/logo1.jpg",
    apple: "/logo1.jpg",
  },
  manifest: "/manifest.json",
  other: {
    "geo.region": "LK",
    "geo.placename": "Sri Lanka",
    "theme-color": "#0a0a0a",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PageTransitionProvider>
          <PageTransition />
          <SmoothScroll>{children}</SmoothScroll>
        </PageTransitionProvider>
      </body>
    </html>
  );
}
