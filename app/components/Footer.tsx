"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

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
        toggleActions: "play none none reverse"
      }
    });

    // Animate elements
    tl.to(".footer-divider", {
      scaleX: 1,
      duration: 1,
      ease: "power2.inOut"
    })
    .to(".footer-link", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.5")
    .to(".footer-text", {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.3");

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
        </svg>
      )
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: "Behance",
      href: "https://behance.net",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.59.41.26.733.57.96.94.225.37.34.82.34 1.34 0 .57-.16 1.06-.48 1.44-.32.37-.8.65-1.44.82.87.19 1.51.56 1.91 1.13.41.56.61 1.24.61 2.05 0 .57-.13 1.08-.38 1.52-.25.45-.58.82-1 1.13-.42.31-.91.54-1.48.7-.57.15-1.17.23-1.8.23H0v-11h6.938zm-.37 4.48c.53 0 .96-.13 1.29-.38.32-.26.49-.62.49-1.08 0-.29-.06-.53-.17-.71-.12-.19-.28-.34-.49-.44-.21-.11-.45-.19-.72-.24-.27-.05-.56-.08-.86-.08H3.27v2.93h3.3zm.16 4.71c.33 0 .64-.03.93-.1.29-.06.54-.17.75-.32.22-.15.38-.35.49-.59.11-.24.17-.54.17-.88 0-.72-.22-1.24-.65-1.55-.43-.32-1.01-.47-1.73-.47H3.27v3.91h3.53zM13.46 9.41c.39-.25.85-.45 1.37-.58.53-.13 1.08-.2 1.66-.2.6 0 1.15.08 1.65.24.5.17.93.42 1.28.75.35.33.62.75.8 1.26.19.51.28 1.09.28 1.75v5.58c0 .24.11.36.34.36.09 0 .18-.01.27-.03v1.8c-.13.03-.29.05-.48.08-.19.02-.37.04-.54.04-.73 0-1.24-.16-1.52-.47-.28-.31-.44-.75-.49-1.3h-.03c-.29.43-.67.78-1.15 1.04-.47.27-1.04.4-1.7.4-.47 0-.91-.06-1.33-.17-.42-.12-.78-.3-1.09-.55-.31-.24-.55-.55-.72-.91-.18-.36-.26-.78-.26-1.26 0-.56.13-1.03.38-1.4.26-.38.6-.68 1.02-.91.42-.23.9-.4 1.44-.51.54-.11 1.1-.18 1.67-.22l1.58-.11v-.56c0-.54-.15-.94-.45-1.18-.3-.25-.74-.37-1.33-.37-.51 0-.99.1-1.45.29-.45.19-.84.42-1.16.69l-1.03-1.4c.46-.37 1.02-.66 1.68-.88zm3.51 4.59l-1.11.08c-.29.02-.58.06-.86.13-.28.06-.53.16-.75.29-.22.13-.4.3-.53.52-.13.21-.2.48-.2.79 0 .42.14.74.42.95.28.22.65.32 1.11.32.4 0 .74-.08 1.02-.25.28-.16.5-.37.67-.62.16-.25.28-.52.35-.82.07-.3.11-.58.11-.85v-.55h-.23zm5.18-7.22h4.64v1.26h-4.64V6.78z"/>
        </svg>
      )
    }
  ];

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "Gallery", href: "#gallery" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <footer
      ref={footerRef}
      className="relative bg-gradient-to-b from-[#0a0a0a] to-black py-20 overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Divider */}
        <div className="footer-divider h-[1px] bg-white/20 mb-16 origin-left"></div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h2 className="footer-link text-3xl lg:text-4xl font-bold text-white mb-4">
              SNAPIFY
            </h2>
            <p className="footer-text text-white/60 mb-6 max-w-md">
              Capturing moments, creating memories. Professional photography
              that tells your unique story through visual artistry.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="footer-link group relative"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="relative p-3 rounded-full border border-white/20 group-hover:border-white/40 transition-colors duration-300">
                    <span className="text-white/60 group-hover:text-white transition-colors duration-300">
                      {link.icon}
                    </span>
                    {/* Hover effect */}
                    <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-link text-lg font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link, index) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="footer-text text-white/60 hover:text-white transition-colors duration-300 inline-block relative group"
                  >
                    {link.name}
                    <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="footer-link text-lg font-semibold text-white mb-6">
              Get in Touch
            </h3>
            <div className="space-y-3">
              <p className="footer-text text-white/60">
                <span className="text-white/40">Email:</span><br />
                hello@snapify.com
              </p>
              <p className="footer-text text-white/60">
                <span className="text-white/40">Phone:</span><br />
                +1 (555) 123-4567
              </p>
              <p className="footer-text text-white/60">
                <span className="text-white/40">Studio:</span><br />
                123 Creative Street<br />
                New York, NY 10001
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-divider h-[1px] bg-white/20 mb-8 origin-left"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="footer-text text-white/40 text-sm">
            © {currentYear} Snapify. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="footer-text text-white/40 hover:text-white/60 text-sm transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="footer-text text-white/40 hover:text-white/60 text-sm transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl opacity-10"></div>
    </footer>
  );
}