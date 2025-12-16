"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { Eye, MapPin } from "lucide-react";

const INTERIOR_IMAGES = [
    { src: "/interior1.webp", alt: "Kaya Planet Salon Interior - Styling Area" },
    { src: "/interior3.webp", alt: "Kaya Planet Salon Interior - Relaxation Zone" },
    { src: "/interior4.webp", alt: "Kaya Planet Salon Interior - Main Area" },
    { src: "/interior2.webp", alt: "Kaya Planet Salon Interior - Premium Section" },
];

// Replace with your actual Google Maps/Business Profile 360 link
const GOOGLE_MAPS_360_LINK = "https://maps.google.com/?q=Kaya+Planet+Salon+Kanpur";

export default function SalonInterior() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section className="py-10 bg-[#FDFBF9]">
            <div className="container mx-auto px-4">
                {/* Section Heading */}
                <div className="text-center mb-12">
                    <span className="text-sm font-semibold text-[#F27708] uppercase tracking-wider">
                        Visit Us
                    </span>
                    <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-stardom)] mt-2 text-[#111111]">
                        Our Salon Space
                    </h2>
                    <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                        Step into a world of luxury and relaxation at our Kanpur salon
                    </p>
                </div>

                {/* Photo Grid */}
                <div
                    ref={ref}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    style={{
                        transform: isInView ? "none" : "translateY(30px)",
                        opacity: isInView ? 1 : 0,
                        transition: "all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
                    }}
                >
                    {INTERIOR_IMAGES.map((image, idx) => (
                        <div
                            key={idx}
                            className="relative aspect-square rounded-xl overflow-hidden group"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </div>
                    ))}
                </div>

                {/* 360° Virtual Tour & Directions - Inline Buttons */}
                <div className="flex items-center justify-center gap-3 mt-10">
                    <Link
                        href={GOOGLE_MAPS_360_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#F27708] hover:bg-[#F89134] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full transition-all shadow-lg hover:shadow-xl"
                    >
                        <Eye className="w-4 h-4" />
                        360° Tour
                    </Link>
                    <Link
                        href="https://maps.google.com/?q=Kaya+Planet+Salon+125/53-B+Govind+Nagar+Kanpur"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border-2 border-[#F27708] text-[#F27708] hover:bg-[#F27708] hover:text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full transition-all"
                    >
                        <MapPin className="w-4 h-4" />
                        Directions
                    </Link>
                </div>
            </div>
        </section>
    );
}
