// Data for the SEO service landing pages rendered by app/[slug]/page.tsx.
// Each page targets one search intent from the visibility strategy.

export const SITE_URL = "https://www.jagathkalupahanaphotography.com";

export interface ServicePage {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string[];
  highlights: { title: string; text: string }[];
  galleryCategory?: string;
  serviceName: string;
  areaServed: string[];
}

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "wedding-photographer-sri-lanka",
    metaTitle: "Wedding Photographer in Sri Lanka — Jagath Kalupahana",
    metaDescription:
      "Award-winning wedding photographer in Sri Lanka. Jagath Kalupahana and the Studio Nethma team capture weddings across Colombo, the Western Province and island-wide with a fine-art approach.",
    eyebrow: "Wedding Photography",
    h1: "Wedding Photographer in Sri Lanka",
    intro: [
      "Your wedding day passes in a heartbeat — the photographs are what remain. Jagath Kalupahana, founder of Studio Nethma, has photographed weddings across Sri Lanka for more than a decade, blending documentary storytelling with a fine-art eye for light and emotion.",
      "From intimate poruwa ceremonies to grand hotel receptions, the Studio Nethma team plans coverage around your schedule, venues and traditions, so every meaningful moment is captured without intruding on the day.",
    ],
    highlights: [
      {
        title: "Full-day coverage",
        text: "From preparations and the poruwa ceremony through to the reception and going-away — nothing important is missed.",
      },
      {
        title: "A dedicated team",
        text: "Multiple photographers with complementary styles cover candid moments, formal groups and creative portraits simultaneously.",
      },
      {
        title: "Fine-art editing",
        text: "Every delivered photograph is individually edited for colour, tone and mood — never batch-processed.",
      },
      {
        title: "Reliable delivery",
        text: "Photographs are securely backed up on the day and delivered on an agreed timeline.",
      },
    ],
    galleryCategory: "Weddings",
    serviceName: "Wedding Photography",
    areaServed: ["Sri Lanka", "Colombo", "Western Province"],
  },
  {
    slug: "wedding-photographer-colombo",
    metaTitle: "Wedding Photographer in Colombo — Jagath Kalupahana",
    metaDescription:
      "Looking for a wedding photographer in Colombo? Studio Nethma, based in Ratmalana, covers weddings at Colombo's leading hotels and venues, led by award-winning photographer Jagath Kalupahana.",
    eyebrow: "Weddings in Colombo",
    h1: "Wedding Photographer in Colombo",
    intro: [
      "Based in Ratmalana, minutes from central Colombo, Studio Nethma is perfectly placed for weddings at the city's hotels, churches, kovils and gardens. Jagath Kalupahana knows Colombo's venues — their light, their layouts and their best angles — from years of working in them.",
      "Whether it's a ballroom reception at a five-star hotel, a homecoming in Mount Lavinia or a seaside ceremony along Galle Face, the team arrives early, scouts the setting and works unobtrusively so your guests barely notice the cameras.",
    ],
    highlights: [
      {
        title: "Local venue knowledge",
        text: "Experience at Colombo's leading wedding hotels and outdoor venues means no time wasted finding the right light.",
      },
      {
        title: "Quick to reach you",
        text: "Located in Ratmalana on the Galle Road corridor — easy access to Colombo, Mount Lavinia, Dehiwala and beyond.",
      },
      {
        title: "Candid and formal balance",
        text: "Natural, un-posed storytelling alongside beautifully arranged family and couple portraits.",
      },
      {
        title: "Homecomings and pre-shoots",
        text: "Complete packages covering engagement shoots, the wedding day and homecoming celebrations.",
      },
    ],
    galleryCategory: "Weddings",
    serviceName: "Wedding Photography",
    areaServed: ["Colombo", "Ratmalana", "Western Province"],
  },
  {
    slug: "event-photographer-colombo",
    metaTitle: "Event Photographer in Colombo — Jagath Kalupahana",
    metaDescription:
      "Professional event photography in Colombo, Sri Lanka. Corporate events, conferences, school and university functions covered by Studio Nethma, led by Jagath Kalupahana.",
    eyebrow: "Event Coverage",
    h1: "Event Photographer in Colombo",
    intro: [
      "Corporate launches, conferences, award nights, school concerts and university functions all demand a photographer who can read a room, anticipate key moments and deliver polished images fast. That is the core of Studio Nethma's event work in Colombo.",
      "Jagath Kalupahana and his team have covered events for companies, schools, universities and institutions across the Western Province — handling everything from stage photography and VIP arrivals to candid audience moments and branded backdrop portraits.",
    ],
    highlights: [
      {
        title: "Corporate events",
        text: "Product launches, conferences, AGMs and award ceremonies photographed with a professional, low-profile presence.",
      },
      {
        title: "School & university functions",
        text: "Concerts, sports meets, prize givings and batch photo days handled with the logistics experience large events demand.",
      },
      {
        title: "Fast turnaround",
        text: "Same-day highlight selections available for social media and press use.",
      },
      {
        title: "Team scalability",
        text: "Single-photographer coverage to multi-photographer teams for large, multi-stage events.",
      },
    ],
    serviceName: "Event Photography",
    areaServed: ["Colombo", "Western Province", "Sri Lanka"],
  },
  {
    slug: "graduation-photographer-sri-lanka",
    metaTitle: "Graduation Photographer in Sri Lanka — Jagath Kalupahana",
    metaDescription:
      "University graduation, convocation and batch photo day photography across Sri Lanka. Studio Nethma photographs graduation ceremonies with professional group handling and on-time delivery.",
    eyebrow: "Graduations & Convocations",
    h1: "Graduation Photographer in Sri Lanka",
    intro: [
      "A graduation happens once — the photographs need to be right the first time. Studio Nethma specialises in university convocations, graduation ceremonies and batch photo days across Sri Lanka, combining large-group management experience with individual portrait quality.",
      "From formal stage moments and certificate presentations to batch photos with hundreds of graduates, Jagath Kalupahana's team brings the equipment, planning and people-handling skills that these high-volume, one-chance events require.",
    ],
    highlights: [
      {
        title: "Batch photo expertise",
        text: "Large-group compositions organised efficiently so hundreds of graduates are photographed sharply and fairly.",
      },
      {
        title: "Ceremony coverage",
        text: "Stage crossings, certificate moments and audience reactions captured throughout the convocation.",
      },
      {
        title: "Individual portraits",
        text: "Professional graduate portraits in gown and regalia, with family group options.",
      },
      {
        title: "Island-wide service",
        text: "Available for universities and institutions across Sri Lanka, not only Colombo.",
      },
    ],
    serviceName: "Graduation & Convocation Photography",
    areaServed: ["Sri Lanka"],
  },
  {
    slug: "wildlife-photographer-sri-lanka",
    metaTitle: "Wildlife Photographer in Sri Lanka — Jagath Kalupahana",
    metaDescription:
      "Fine-art wildlife photography from Sri Lanka's national parks by award-winning photographer Jagath Kalupahana — elephants, leopards, birdlife and landscapes, exhibited internationally.",
    eyebrow: "Wildlife & Fine Art",
    h1: "Wildlife Photographer in Sri Lanka",
    intro: [
      "Sri Lanka is one of the world's richest wildlife destinations, and photographing it ethically has been Jagath Kalupahana's long-term personal project. His wildlife work — from the elephant gatherings of Minneriya to the leopards of Yala and the birdlife of the wetlands — has been shown in exhibitions internationally.",
      "This body of work is grounded in patience and respect for the animal: no baiting, no harassment, no shortcuts. The result is honest, fine-art imagery of Sri Lanka's wild places, available as limited-edition prints.",
    ],
    highlights: [
      {
        title: "Ethical field practice",
        text: "Wildlife is photographed on its own terms — responsible distances, no baiting and no disturbance.",
      },
      {
        title: "Exhibited internationally",
        text: "Wildlife and fine-art work featured in 50+ exhibitions worldwide.",
      },
      {
        title: "Fine-art prints",
        text: "Selected wildlife photographs are available as limited-edition prints through the marketplace.",
      },
      {
        title: "Deep local knowledge",
        text: "Years of fieldwork across Yala, Wilpattu, Minneriya, Kumana and Sri Lanka's wetland reserves.",
      },
    ],
    galleryCategory: "Wildlife",
    serviceName: "Wildlife Photography",
    areaServed: ["Sri Lanka"],
  },
  {
    slug: "sports-photographer-sri-lanka",
    metaTitle: "Sports Photographer in Sri Lanka — Jagath Kalupahana",
    metaDescription:
      "Professional sports photography in Sri Lanka — cricket, athletics, school sports meets and tournaments covered by Studio Nethma with fast, action-ready coverage.",
    eyebrow: "Sports & Action",
    h1: "Sports Photographer in Sri Lanka",
    intro: [
      "Sports photography rewards anticipation — knowing where the play is going before it gets there. Jagath Kalupahana has photographed cricket matches, athletics meets, school sports days and tournaments across Sri Lanka with the long glass, fast reflexes and positioning experience the job demands.",
      "From big-match cricket atmosphere to the decisive moment at the finish line, Studio Nethma delivers sharp, dramatic action imagery alongside the team photos, presentation ceremonies and crowd moments that complete the story of an event.",
    ],
    highlights: [
      {
        title: "Cricket specialists",
        text: "Match coverage from boundary line to pavilion — action, celebrations, spectators and presentations.",
      },
      {
        title: "School sports meets",
        text: "Track and field events, march pasts, house competitions and award ceremonies covered end to end.",
      },
      {
        title: "Action-ready equipment",
        text: "Professional telephoto lenses and high-speed bodies built for fast, unpredictable play.",
      },
      {
        title: "Event-day delivery",
        text: "Highlight images available quickly for schools, clubs and media use.",
      },
    ],
    serviceName: "Sports Photography",
    areaServed: ["Sri Lanka"],
  },
];

export function getServicePage(slug: string): ServicePage | undefined {
  return SERVICE_PAGES.find((s) => s.slug === slug);
}
