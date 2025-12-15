"use client";

import { useEffect, useState } from "react";
import { ParallaxScroll } from "./ui/parallax-scroll";

const GalleryContent = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("https://kpcrud-vj8f.vercel.app/api/links2");
        if (!res.ok) throw new Error("Failed to fetch images");

        const data = await res.json();
        const imageUrls = data.map((item: { imageUrl: string }) => item.imageUrl);

        const shuffledImages = imageUrls.sort(() => Math.random() - 0.5);

        setImages(shuffledImages);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <p className="text-center">Loading images...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="flex md:justify-center gap-4 whitespace-nowrap">
      {images.length > 0 ? (
        <ParallaxScroll images={images} className="min-h-[100vh]" />
      ) : (
        <p className="text-center w-full">No images available.</p>
      )}
    </div>
  );
};

export default GalleryContent;
