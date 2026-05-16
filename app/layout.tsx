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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${PHOTOGRAPHER_NAME} | Professional Photographer Sri Lanka`,
    template: `%s | ${PHOTOGRAPHER_NAME} Photography`,
  },
  description:
    "Award-winning professional photographer Jagath Kalupahana specialising in weddings, wildlife, events, portraits and fine-art photography in Sri Lanka. 12+ years experience, 50+ global exhibitions.",
  keywords: [
    "photographer Sri Lanka",
    "wedding photographer Sri Lanka",
    "wildlife photographer",
    "professional photography",
    "Jagath Kalupahana",
    "JK photography",
    "portrait photographer",
    "event photographer",
    "fine art photography",
    "photography portfolio",
  ],
  authors: [{ name: PHOTOGRAPHER_NAME, url: SITE_URL }],
  creator: PHOTOGRAPHER_NAME,
  publisher: PHOTOGRAPHER_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${PHOTOGRAPHER_NAME} | Professional Photographer Sri Lanka`,
    description:
      "Award-winning professional photographer specialising in weddings, wildlife, events and fine-art photography. 12+ years experience.",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${PHOTOGRAPHER_NAME} Photography`,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${PHOTOGRAPHER_NAME} | Professional Photographer`,
    description:
      "Award-winning professional photographer. Weddings, wildlife, events, portraits.",
    images: ["/og-image.jpg"],
    creator: "@jk_photography",
  },
  alternates: { canonical: SITE_URL },
  category: "photography",
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
