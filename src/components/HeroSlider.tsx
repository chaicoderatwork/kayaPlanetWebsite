"use client";

import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HERO_SLIDES = [
    {
        id: 1,
        image: "/hero1.webp",
        title: "Best Bridal Makeup Artist in Kanpur",
        subtitle: "Book Your Dream Wedding Look Today",
    },
    {
        id: 2,
        image: "/hero2.webp",
        title: "Bridal Makeup",
        subtitle: "Customized bridal makeup for every bride",
    },
    {
        id: 3,
        image: "/hero4.webp",
        title: "Engagement Makeup",
        subtitle: "Flawless HD Looks for Every Occasion",
    },
    {
        id: 4,
        image: "/hero3.webp",
        title: "KP Royal Bride",
        subtitle: "Signature Glam Makeup that elevate your looks",
    },
];

export default function HeroSlider() {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "center",
        },
        [Autoplay({ delay: 4000, stopOnInteraction: false }) as any]
    );

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-black">
            <div className="overflow-hidden h-full" ref={emblaRef}>
                <div className="flex h-full">
                    {HERO_SLIDES.map((slide, index) => (
                        <div
                            key={slide.id}
                            className="relative flex-none w-full h-full"
                        >
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                priority={index === 0}
                                className="object-cover object-top"
                                sizes="100vw"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
                                <h1 className={`text-3xl sm:text-4xl md:text-6xl font-[family-name:var(--font-stardom)] mb-3 ${slide.title.length > 25 ? "" : "whitespace-nowrap"}`}>
                                    {slide.title}
                                </h1>
                                <p className="text-lg md:text-xl text-gray-200 mb-6">
                                    {slide.subtitle}
                                </p>
                                <a
                                    href="tel:+919999424375"
                                    className="inline-block bg-[#F27708] hover:bg-[#F89134] text-white font-medium px-8 py-3 rounded-full transition-colors"
                                >
                                    Book Now
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full transition-colors hidden md:block"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full transition-colors hidden md:block"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {HERO_SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        className="w-2.5 h-2.5 rounded-full bg-white/60 hover:bg-white transition-colors"
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
