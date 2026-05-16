"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import TransitionLink from "./TransitionLink";

gsap.registerPlugin(ScrollTrigger);

interface ContactSettings {
  email1: string;
  email2: string;
  phone1: string;
  phone2: string;
  studioAddress: string;
  studioCity: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  twitter: string;
  linkedin: string;
  footerTagline: string;
  copyrightName: string;
}

const DEFAULTS: ContactSettings = {
  email1: "studionethma@yahoo.com",
  email2: "studionethma3@gmail.com",
  phone1: "+94 777 901 129",
  phone2: "+94 112 624 725",
  studioAddress: "No 144, Raja Mawatha, Ratmalana",
  studioCity: "Ratmalana, Sri Lanka",
  instagram:
    "https://www.instagram.com/jagathkalupahana_photography?igsh=a2Q4ajBkdXVhb3k=",
  facebook: "https://www.facebook.com/share/1AaFHJ5cJj/?mibextid=wwXIfr",
  tiktok:
    "https://www.tiktok.com/@j_kalupahana_photography?_r=1&_t=ZS-93vxK2Wtti9",
  youtube: "",
  twitter: "",
  linkedin: "",
  footerTagline:
    "Capturing moments, creating memories. Professional photography that tells your unique story through visual artistry.",
  copyrightName: "Studio Nethma",
};

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
  </svg>
);
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  </svg>
);
const TikTokIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.05 3.5 3.05 1.6 0 2.93-1.33 2.93-3.04.01-4.63.04-9.26.04-13.89-.01-.33.03-.66.02-1 .92.01 1.87 0 2.71 0z" />
  </svg>
);
const YouTubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
  </svg>
);
const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "#about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Contact", href: "#contact" },
];

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<ContactSettings>(DEFAULTS);

  useEffect(() => {
    fetch("/api/settings/public", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setSettings((prev) => ({ ...prev, ...d })))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    // Set initial states
    gsap.set(".footer-link", { opacity: 0, y: 20 });
    gsap.set(".footer-divider", { scaleX: 0 });
    gsap.set(".footer-text", { opacity: 0, y: 10 });

    // Create timeline for footer animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    });

    // Animate elements
    tl.to(".footer-divider", {
      scaleX: 1,
      duration: 1,
      ease: "power2.inOut",
    })
      .to(
        ".footer-link",
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.5",
      )
      .to(
        ".footer-text",
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.3",
      );

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Instagram", href: settings.instagram, Icon: InstagramIcon },
    { name: "Facebook", href: settings.facebook, Icon: FacebookIcon },
    { name: "TikTok", href: settings.tiktok, Icon: TikTokIcon },
    { name: "YouTube", href: settings.youtube, Icon: YouTubeIcon },
    { name: "Twitter", href: settings.twitter, Icon: TwitterIcon },
    { name: "LinkedIn", href: settings.linkedin, Icon: LinkedInIcon },
  ].filter((s) => s.href);

  return (
    <footer
      ref={footerRef}
      className="relative bg-linear-to-b from-[#0a0a0a] to-black py-20 overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="footer-divider h-[1px] bg-white/20 mb-16 origin-left" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="footer-link text-3xl lg:text-4xl font-bold text-white mb-4">
              JK
            </h2>
            <p className="footer-text text-white/60 mb-6 max-w-md">
              {settings.footerTagline}
            </p>
            <div className="flex gap-4 flex-wrap">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  className="footer-link group relative"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                >
                  <div className="relative p-3 rounded-full border border-white/20 group-hover:border-white/40 transition-colors duration-300">
                    <span className="text-white/60 group-hover:text-white transition-colors duration-300">
                      <Icon />
                    </span>
                    <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-link text-lg font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <TransitionLink
                    href={link.href}
                    className="footer-text text-white/60 hover:text-white transition-colors duration-300 inline-block relative group"
                  >
                    {link.name}
                    <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-link text-lg font-semibold text-white mb-6">
              Get in Touch
            </h3>
            <div className="space-y-3">
              {(settings.email1 || settings.email2) && (
                <p className="footer-text text-white/60">
                  <span className="text-white/40">Email:</span>
                  <br />
                  {settings.email1 && (
                    <a
                      href={`mailto:${settings.email1}`}
                      className="hover:text-white transition-colors"
                    >
                      {settings.email1}
                    </a>
                  )}
                  {settings.email1 && settings.email2 && <br />}
                  {settings.email2 && (
                    <a
                      href={`mailto:${settings.email2}`}
                      className="hover:text-white transition-colors"
                    >
                      {settings.email2}
                    </a>
                  )}
                </p>
              )}
              {(settings.phone1 || settings.phone2) && (
                <p className="footer-text text-white/60">
                  <span className="text-white/40">Phone:</span>
                  <br />
                  {settings.phone1 && (
                    <a
                      href={`tel:${settings.phone1.replace(/\s/g, "")}`}
                      className="hover:text-white transition-colors"
                    >
                      {settings.phone1}
                    </a>
                  )}
                  {settings.phone1 && settings.phone2 && <br />}
                  {settings.phone2 && (
                    <a
                      href={`tel:${settings.phone2.replace(/\s/g, "")}`}
                      className="hover:text-white transition-colors"
                    >
                      {settings.phone2}
                    </a>
                  )}
                </p>
              )}
              {settings.studioAddress && (
                <p className="footer-text text-white/60">
                  <span className="text-white/40">Studio:</span>
                  <br />
                  {settings.studioAddress}
                  {settings.studioCity && (
                    <>
                      <br />
                      {settings.studioCity}
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="footer-divider h-[1px] bg-white/20 mb-8 origin-left" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="footer-text text-white/40 text-sm">
            © {currentYear} {settings.copyrightName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <TransitionLink
              href="/privacy"
              className="footer-text text-white/40 hover:text-white/60 text-sm transition-colors duration-300"
            >
              Privacy Policy
            </TransitionLink>
            <TransitionLink
              href="/terms"
              className="footer-text text-white/40 hover:text-white/60 text-sm transition-colors duration-300"
            >
              Terms of Service
            </TransitionLink>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl opacity-10" />
    </footer>
  );
}
