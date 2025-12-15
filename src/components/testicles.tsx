"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const BentoGrid: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("https://kpcrud-vj8f.vercel.app/api/links");
        if (!res.ok) throw new Error("Failed to fetch images");

        const data = await res.json();
        setImages(data.map((item: { imageUrl: string }) => item.imageUrl));
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-fit bg-black py-3 md:py-[4%] w-screen flex items-center justify-center p-3 px-3 md:p-4">
      <div className="grid grid-cols-6 gap-3 w-[100%] max-w-[100%] md:max-w-[90%]">
        {loading ? (
          <p className="text-center text-white col-span-6">Loading images...</p>
        ) : images.length < 7 ? (
          <p className="text-center text-white col-span-6">Not enough images.</p>
        ) : (
          <>
            {/* Image 1: Large wide */}
            <div className="md:col-span-4 col-span-4 relative overflow-hidden" style={{ paddingTop: "35%" }}>
              <Image
                src={images[0]}
                alt="Image 1"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>

            {/* Image 2: Small square */}
            <div className="md:col-span-2 col-span-2 relative overflow-hidden" style={{ paddingTop: "95%" }}>
              <Image
                src={images[1]}
                alt="Image 2"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>

            {/* Image 3: Tall */}
            <div className="md:col-span-2 md:row-span-2 col-span-2 relative overflow-hidden" style={{ paddingTop: "140%" }}>
              <Image
                src={images[2]}
                alt="Image 3"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>

            {/* Image 4 */}
            <div className="md:col-span-2 col-span-4 relative overflow-hidden" style={{ paddingTop: "95%" }}>
              <Image
                src={images[3]}
                alt="Image 4"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>

            {/* Image 5: Small square */}
            <div className="md:col-span-2 col-span-2 relative overflow-hidden" style={{ paddingTop: "95%" }}>
              <Image
                src={images[4]}
                alt="Image 5"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>

            {/* Image 6 */}
            <div className="md:col-span-2 col-span-2 relative overflow-hidden" style={{ paddingTop: "95%" }}>
              <Image
                src={images[5]}
                alt="Image 6"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>

            {/* Image 7 */}
            {/* <div className="md:col-span-2 col-span-2 relative overflow-hidden" style={{ paddingTop: "95%" }}>
              <Image
                src={images[6]}
                alt="Image 7"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div> */}

            {/* Image 8 */}
            <div className="md:col-span-2 col-span-2 relative overflow-hidden" style={{ paddingTop: "95%" }}>
              <Image
                src={images[6]}
                alt="Image 8"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BentoGrid;
