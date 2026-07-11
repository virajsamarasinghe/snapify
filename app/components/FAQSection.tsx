"use client";

import { useState } from "react";

export const FAQS = [
  {
    question: "What is Studio Nethma?",
    answer:
      "Studio Nethma is a professional photography company based in Ratmalana, Sri Lanka. Founded and led by award-winning Senior Photographer Jagath Kalupahana, Studio Nethma has a dedicated team of photographers each with their own unique theme and creative vision, covering weddings, wildlife, sports, events, graduations and fine-art photography.",
  },
  {
    question: "What types of photography does Studio Nethma specialise in?",
    answer:
      "Studio Nethma specialises in wedding photography, wildlife photography, cricket and sports photography, university graduation and batch photo day photography, corporate and school event coverage, portrait photography, and fine-art photography across Sri Lanka and globally.",
  },
  {
    question: "Who is Jagath Kalupahana?",
    answer:
      "Jagath Kalupahana is the founder, owner and Senior Photographer of Studio Nethma. He is an award-winning photographer with over 12 years of professional experience, 50+ global exhibitions, and multiple international photography awards including the International Photography Excellence Award 2024.",
  },
  {
    question: "Does Studio Nethma have a team of photographers?",
    answer:
      "Yes. Studio Nethma has a team of professional photographers, each specialising in different styles, themes and visions. This allows the studio to cover multiple events simultaneously and offer diverse photography styles to clients.",
  },
  {
    question: "How do I book Studio Nethma for a wedding or event?",
    answer:
      "You can contact Studio Nethma via the contact form on this website, by email at studionethma@yahoo.com, or by phone at +94 777 901 129. Early booking is strongly recommended for weddings and large events.",
  },
  {
    question: "Can I purchase photography prints from Studio Nethma?",
    answer:
      "Yes. Limited edition fine-art photography prints by Jagath Kalupahana are available to purchase through the Studio Nethma marketplace on this website. Worldwide shipping is available.",
  },
  {
    question: "Is Studio Nethma available for events outside Sri Lanka?",
    answer:
      "Yes. Studio Nethma and Jagath Kalupahana are available for photography assignments both within Sri Lanka and internationally.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative bg-[#0a0a0a] py-20 lg:py-32 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-4xl">
        <p className="text-white/40 text-xs sm:text-sm uppercase tracking-[0.3em] mb-4 text-center">
          Got Questions?
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-12 sm:mb-16">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-white/10 rounded-xl overflow-hidden bg-white/2"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-4 sm:py-5 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-white/90 text-sm sm:text-base font-medium">
                    {faq.question}
                  </h3>
                  <span
                    className={`shrink-0 text-white/40 transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 sm:px-7 pb-5 text-white/55 text-sm sm:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl opacity-20 pointer-events-none" />
    </section>
  );
}
