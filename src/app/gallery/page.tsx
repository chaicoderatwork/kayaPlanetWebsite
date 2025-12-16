import React from "react";
import GalleryGrid from "@/components/GalleryGrid";
import galleryItems from "@/data/gallery.json";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Kaya Planet Salon & Academy",
  description: "Explore our portfolio of bridal makeups, hair transformations, and academy highlights.",
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF9] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-[#F27708] uppercase tracking-wider">
            Portfolio
          </span>
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-stardom)] mt-2 text-[#111111]">
            Our Gallery
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            A curated collection of our finest work. From stunning bridal transformations to detailed nail art and academy sessions.
          </p>
        </div>

        <GalleryGrid items={galleryItems as any} />
      </div>
    </main>
  );
}
