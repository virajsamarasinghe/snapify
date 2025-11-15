"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

interface Artwork {
  id: number;
  title: string;
  category: string;
  price: string;
  image: string;
  description: string;
  dimensions: string;
  medium: string;
  year: string;
  available: boolean;
}

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Sample artwork data - replace with your actual data
  const artworks: Artwork[] = [
    {
      id: 1,
      title: "Sunset Dreams",
      category: "landscape",
      price: "$1,200",
      image: "/assets/img1.jpeg",
      description: "A breathtaking capture of the golden hour, showcasing nature's most beautiful transition. This piece evokes feelings of peace and tranquility.",
      dimensions: "24x36 inches",
      medium: "Digital Print on Canvas",
      year: "2024",
      available: true
    },
    {
      id: 2,
      title: "Urban Reflections",
      category: "urban",
      price: "$950",
      image: "/assets/img2.jpeg",
      description: "Modern city life captured through reflective surfaces, creating a unique perspective on urban architecture.",
      dimensions: "20x30 inches",
      medium: "Giclée Print",
      year: "2024",
      available: true
    },
    {
      id: 3,
      title: "Abstract Motion",
      category: "abstract",
      price: "$1,500",
      image: "/assets/img3.jpeg",
      description: "Dynamic movements frozen in time, this abstract piece challenges perception and invites contemplation.",
      dimensions: "30x40 inches",
      medium: "Mixed Media Print",
      year: "2023",
      available: true
    },
    {
      id: 4,
      title: "Portrait of Solitude",
      category: "portrait",
      price: "$800",
      image: "/assets/img4.jpeg",
      description: "An intimate portrayal of human emotion, capturing the quiet moments of self-reflection.",
      dimensions: "18x24 inches",
      medium: "Fine Art Print",
      year: "2024",
      available: false
    },
    {
      id: 5,
      title: "Mountain Majesty",
      category: "landscape",
      price: "$2,200",
      image: "/assets/img5.jpeg",
      description: "Towering peaks captured at dawn, showcasing the raw beauty and power of nature.",
      dimensions: "36x48 inches",
      medium: "Canvas Print",
      year: "2024",
      available: true
    },
    {
      id: 6,
      title: "Street Stories",
      category: "urban",
      price: "$750",
      image: "/assets/img6.jpeg",
      description: "Candid moments from city streets, telling stories of everyday life in urban environments.",
      dimensions: "16x20 inches",
      medium: "Photographic Print",
      year: "2023",
      available: true
    },
    {
      id: 7,
      title: "Color Symphony",
      category: "abstract",
      price: "$1,800",
      image: "/assets/img7.jpeg",
      description: "A vibrant explosion of colors and forms, creating a visual symphony that energizes any space.",
      dimensions: "30x30 inches",
      medium: "Digital Art Print",
      year: "2024",
      available: true
    },
    {
      id: 8,
      title: "Quiet Moments",
      category: "portrait",
      price: "$900",
      image: "/assets/img8.jpeg",
      description: "Capturing the beauty in everyday moments, this portrait series celebrates authentic human experiences.",
      dimensions: "20x24 inches",
      medium: "Silver Gelatin Print",
      year: "2023",
      available: true
    },
    {
      id: 9,
      title: "Ocean's Edge",
      category: "landscape",
      price: "$1,400",
      image: "/assets/img9.jpeg",
      description: "Where land meets sea, this piece captures the eternal dance between earth and water.",
      dimensions: "24x32 inches",
      medium: "Canvas Print",
      year: "2024",
      available: true
    },
    {
      id: 10,
      title: "Neon Nights",
      category: "urban",
      price: "$1,100",
      image: "/assets/img10.jpeg",
      description: "The vibrant nightlife of the city captured in neon lights and urban energy.",
      dimensions: "22x28 inches",
      medium: "Metallic Print",
      year: "2024",
      available: true
    },
    {
      id: 11,
      title: "Geometric Dreams",
      category: "abstract",
      price: "$1,300",
      image: "/assets/img11.jpeg",
      description: "Precision meets creativity in this geometric exploration of form and space.",
      dimensions: "24x24 inches",
      medium: "Acrylic Print",
      year: "2023",
      available: false
    },
    {
      id: 12,
      title: "Human Connection",
      category: "portrait",
      price: "$1,600",
      image: "/assets/img12.jpeg",
      description: "A powerful exploration of human relationships and the bonds that connect us.",
      dimensions: "28x36 inches",
      medium: "Fine Art Print",
      year: "2024",
      available: true
    }
  ];

  const categories = [
    { id: "all", name: "All Works", count: artworks.length },
    { id: "landscape", name: "Landscape", count: artworks.filter(a => a.category === "landscape").length },
    { id: "urban", name: "Urban", count: artworks.filter(a => a.category === "urban").length },
    { id: "abstract", name: "Abstract", count: artworks.filter(a => a.category === "abstract").length },
    { id: "portrait", name: "Portrait", count: artworks.filter(a => a.category === "portrait").length }
  ];

  const filteredArtworks = selectedCategory === "all"
    ? artworks
    : artworks.filter(artwork => artwork.category === selectedCategory);

  useEffect(() => {
    // Hero animation
    const hero = heroRef.current;
    if (hero) {
      gsap.fromTo(".hero-text",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out"
        }
      );
    }

    // Grid animation
    const grid = gridRef.current;
    if (grid) {
      gsap.fromTo(".artwork-card",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [selectedCategory]);

  const openModal = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
  };

  // Handle body overflow when modal opens/closes
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleWhatsAppClick = (artwork: Artwork) => {
    const message = `Hi! I'm interested in purchasing "${artwork.title}" (${artwork.price}). Is it still available?`;
    const phoneNumber = "1234567890"; // Replace with actual WhatsApp number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[60vh] bg-gradient-to-b from-black to-[#0a0a0a] flex items-center justify-center mt-20">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="hero-text text-white/60 text-sm uppercase tracking-[0.3em] mb-4">
            Exclusive Collection
          </p>
          <h1 className="hero-text text-4xl lg:text-7xl font-bold text-white mb-6">
            <span className="inline-block bg-white text-black px-6 py-2">ART</span>
            <span className="inline-block ml-4">MARKETPLACE</span>
          </h1>
          <p className="hero-text text-white/80 text-lg max-w-2xl mx-auto">
            Discover and acquire unique pieces from our curated collection.
            Each artwork tells a story, waiting to become part of yours.
          </p>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-[#0a0a0a] py-8 sticky top-20 z-30 border-b border-white/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full border transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white'
                }`}
              >
                <span className="font-medium">{category.name}</span>
                <span className="ml-2 text-sm opacity-60">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Artworks Grid */}
      <section className="bg-gradient-to-b from-[#0a0a0a] to-black py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="artwork-card group cursor-pointer"
                onClick={() => openModal(artwork)}
              >
                <div className="relative overflow-hidden rounded-lg bg-[#1a1a1a]">
                  {/* Image Container */}
                  <div className="relative h-[300px] overflow-hidden">
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Quick View */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="px-6 py-3 bg-white text-black rounded-full text-sm font-medium">
                        View Details
                      </span>
                    </div>

                    {/* Availability Badge */}
                    {!artwork.available && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white text-xs rounded-full">
                        Sold
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                      {artwork.category}
                    </p>
                    <h3 className="text-white text-lg font-semibold mb-2 group-hover:text-white/80 transition-colors">
                      {artwork.title}
                    </h3>
                    <p className="text-white text-xl font-bold">
                      {artwork.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artwork Detail Modal */}
      {isModalOpen && selectedArtwork && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
          onClick={closeModal}
        >
          <div
            className="relative max-w-6xl w-full bg-[#1a1a1a] rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Side */}
              <div className="relative h-[400px] lg:h-[600px] bg-black">
                <Image
                  src={selectedArtwork.image}
                  alt={selectedArtwork.title}
                  fill
                  className="object-contain"
                  sizes="50vw"
                />
              </div>

              {/* Details Side */}
              <div className="p-8 lg:p-12">
                <div className="mb-6">
                  <p className="text-white/60 text-sm uppercase tracking-wider mb-2">
                    {selectedArtwork.category}
                  </p>
                  <h2 className="text-white text-3xl lg:text-4xl font-bold mb-4">
                    {selectedArtwork.title}
                  </h2>
                  <p className="text-white text-2xl font-semibold mb-2">
                    {selectedArtwork.price}
                  </p>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs ${
                    selectedArtwork.available
                      ? 'bg-green-600/20 text-green-400'
                      : 'bg-red-600/20 text-red-400'
                  }`}>
                    {selectedArtwork.available ? 'Available' : 'Sold'}
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <p className="text-white/80 leading-relaxed">
                    {selectedArtwork.description}
                  </p>

                  <div className="space-y-3 py-6 border-y border-white/10">
                    <div className="flex justify-between">
                      <span className="text-white/60">Dimensions</span>
                      <span className="text-white">{selectedArtwork.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Medium</span>
                      <span className="text-white">{selectedArtwork.medium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Year</span>
                      <span className="text-white">{selectedArtwork.year}</span>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Button */}
                {selectedArtwork.available && (
                  <button
                    onClick={() => handleWhatsAppClick(selectedArtwork)}
                    className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg transition-colors duration-300"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span className="font-semibold">Inquire on WhatsApp</span>
                  </button>
                )}

                {/* Additional Info */}
                <p className="text-white/40 text-xs mt-4 text-center">
                  Click the button above to connect directly with the artist via WhatsApp for purchase inquiries
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </>
  );
}