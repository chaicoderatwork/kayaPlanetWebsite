"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

// Static optimized images for instant loading
const STUDENT_IMAGES = [
  { src: "/hs1.webp", alt: "Student work 1" },
  { src: "/hs2.webp", alt: "Student work 2" },
  { src: "/poster1.webp", alt: "Student work 3" },
  { src: "/poster2.webp", alt: "Student work 4" },
  { src: "/poster3.webp", alt: "Student work 5" },
  { src: "/bg1.webp", alt: "Student work 6" },
  { src: "/bg2.webp", alt: "Student work 7" },
  { src: "/sonam.webp", alt: "Student work 8" },
]

export default function StudentShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const animationRef = useRef<number | null>(null)
  const scrollPositionRef = useRef(0);

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const speed = 0.5; // pixels per frame

    const animateScroll = () => {
      if (!scrollContainer) return;

      if (!isPaused) {
        scrollPositionRef.current += speed;

        // If we've scrolled past the first set of images, reset to the start
        if (scrollPositionRef.current >= scrollContainer.scrollWidth / 2) {
          scrollPositionRef.current = 0;
        }

        scrollContainer.scrollLeft = scrollPositionRef.current;
      }

      animationRef.current = requestAnimationFrame(animateScroll);
    };

    animationRef.current = requestAnimationFrame(animateScroll);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused]);


  const displayImages = [...STUDENT_IMAGES, ...STUDENT_IMAGES] // duplicate for infinite scroll

  return (
    <section className="py-16 w-full">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <span className="text-sm font-semibold px-3 py-1 border border-gray-300 rounded-full">
            STUDENTS&apos; GALLERY
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-9">
          Crafting Beauty: <br /> A Gallery of Student Excellence
        </h2>

        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            ref={scrollContainerRef}
            className="flex gap-4 py-2 md:p-0 p-3 whitespace-nowrap overflow-x-scroll scrollbar-hide"
            style={{
              scrollBehavior: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {displayImages.map(({ src, alt }, index) => (
              <div
                key={index}
                className="relative w-[70vw] sm:w-[45vw] md:w-[23vw] aspect-[4/5] shrink-0"
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 70vw, (max-width: 1200px) 45vw, 23vw"
                  className="object-cover rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
