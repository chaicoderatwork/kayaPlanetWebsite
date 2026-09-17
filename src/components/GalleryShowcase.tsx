"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FEATURED_ITEMS = [
    { id: "bride_ruby_6", src: "/gallery/bride_ruby_6.webp", alt: "Bridal makeup in the courtyard" },
    { id: "bride_ruby_2", src: "/gallery/bride_ruby_2.webp", alt: "Bridal makeup portrait" },
    { id: "bride_emerald_3", src: "/gallery/bride_emerald_3.webp", alt: "Bridal makeup by the window" },
    { id: "bride_coral_1", src: "/gallery/bride_coral_1.webp", alt: "Bridal makeup with gold jewellery" },
    { id: "bride_night_1", src: "/gallery/bride_night_1.webp", alt: "Bridal makeup under evening lights" },
];

export default function GalleryShowcase() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-12 md:py-16 bg-[#FDFBF9] overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Section Header */}
                <div
                    className={`text-center mb-10 transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <h2 className="text-2xl md:text-4xl font-[family-name:var(--font-gelasio)] mt-1 text-[#111111]">
                        Stunning Transformations
                    </h2>
                    <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm md:text-base">
                        Every look tells a story. Explore our work.
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {FEATURED_ITEMS.map((item, index) => (
                        <div
                            key={item.id}
                            className={`relative group overflow-hidden rounded-xl transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                                } ${index === 0 ? "col-span-2 row-span-2" : ""}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <Link href="/gallery" className="block w-full h-full">
                                <div
                                    className={`relative w-full h-full ${index === 0
                                        ? "aspect-[4/5] md:aspect-square"
                                        : "aspect-[3/4]"
                                        }`}
                                >
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        fill
                                        loading="lazy"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes={
                                            index === 0
                                                ? "(max-width: 768px) 100vw, 66vw"
                                                : "(max-width: 768px) 50vw, 33vw"
                                        }
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* View Gallery Button */}
                <div
                    className={`text-center mt-10 transition-all duration-700 delay-500 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <Link
                        href="/gallery"
                        className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#F27708] to-[#F89134] text-white px-8 py-3.5 rounded-full font-medium text-base shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300"
                    >
                        <span>View Full Gallery</span>
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <p className="text-gray-400 text-xs mt-3">
                        100+ Stunning Looks
                    </p>
                </div>
            </div>
        </section>
    );
}
