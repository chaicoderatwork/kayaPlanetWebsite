import type { Metadata } from "next";
import GalleryContent from "@/components/gallery-content";

export const generateMetadata = async (): Promise<Metadata> => ({
  title: "Salon Portfolio Gallery in Kanpur | Kaya Planet Bridal & Hair Looks",
  description:
    "Browse Kaya Planet salon gallery featuring bridal makeup, hair styling, skin treatments and nail art transformations from Govind Nagar and Kakadeo, Kanpur.",
  keywords: [
    "bridal makeup gallery Kanpur",
    "hair styling portfolio Govind Nagar",
    "hair styling portfolio Kakadeo",
    "salon before after Kanpur",
    "nail art gallery Govind Nagar",
    "nail art gallery Kakadeo",
  ],
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    url: "/gallery",
    title: "Salon Portfolio Gallery in Kanpur | Kaya Planet Bridal & Hair Looks",
    description:
      "See Kaya Planet's Kanpur salon work across bridal makeup, hairstyling, facials and nail art from Govind Nagar and Kakadeo in our gallery portfolio.",
  },
  twitter: {
    title: "Salon Portfolio Gallery in Kanpur | Kaya Planet Bridal & Hair Looks",
    description:
      "Discover Kaya Planet's latest bridal and salon looks from Govind Nagar and Kakadeo, Kanpur in our gallery portfolio.",
  },
});

export default function Page() {
  return (
    <main className="w-full px-4 py-8 overflow-x-auto" aria-labelledby="gallery-heading">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 id="gallery-heading" className="text-3xl font-semibold text-center">
            Kaya Planet Salon Gallery in Govind Nagar & Kakadeo, Kanpur
          </h1>
          <p className="mt-2 text-center text-gray-700">
            Explore our latest bridal makeup, hair styling, skincare and nail artistry transformations.
          </p>
        </header>
        <GalleryContent />
      </div>
    </main>
  );
}
