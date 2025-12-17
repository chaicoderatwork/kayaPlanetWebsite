"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useCallback, useEffect } from "react";
import { useInView } from "framer-motion";
import { Eye, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";

const INTERIOR_IMAGES = [
    { src: "/interior1.webp", alt: "Kaya Planet Salon Interior - Styling Area" },
    { src: "/interior3.webp", alt: "Kaya Planet Salon Interior - Photo Shoot Zone" },
    { src: "/interior4.webp", alt: "Kaya Planet Salon Interior - Main Area" },
    { src: "/interior2.webp", alt: "Kaya Planet Salon Interior - Premium Section" },
];

// Replace with your actual Google Maps/Business Profile 360 link
const GOOGLE_MAPS_360_LINK = "https://www.google.com/maps/place/Kaya+Planet+Beauty+Salon+-+Make+Up+Artist+In+Kanpur,+Bridal+Make+Up+Artist+In+Kanpur,+Make+Up+Academy+In+Kanpur/@26.4496116,80.2988153,3a,75y,220h,90t/data=!3m8!1e1!3m6!1sCIABIhAGbzzgWS23EmfKlasAB18u!2e10!3e11!6shttps:%2F%2Flh3.googleusercontent.com%2Fgpms-cs-s%2FAPRy3c_sKBj7YxgQccxIEVireS4tz5jTVY7_hERhHmL8S9MeMMrAvNpgY2WbeiuOrZ84nBNGGvMgQIjUpTVvKDSc_GvgfrMfivOvRivCblNnIlFNecgqD9YgpzMCT9VVJjAAxra8X4mPX8xQZfE%3Dw900-h600-k-no-pi0-ya5.674942016601591-ro0-fo100!7i7680!8i3840!4m18!1m8!3m7!1s0x399c479344ff543f:0x18ea6eb778191466!2sKaya+Planet+Beauty+Salon+-+Make+Up+Artist+In+Kanpur,+Bridal+Make+Up+Artist+In+Kanpur,+Make+Up+Academy+In+Kanpur!8m2!3d26.4496295!4d80.2988175!10e1!16s%2Fg%2F11cls7bnj0!3m8!1s0x399c479344ff543f:0x18ea6eb778191466!8m2!3d26.4496295!4d80.2988175!10e5!14m1!1BCgIgARICCAI!16s%2Fg%2F11cls7bnj0?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D";


export default function SalonInterior() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setSelectedIndex(index);
    const closeLightbox = () => setSelectedIndex(null);

    const goToPrev = useCallback(() => {
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex - 1 + INTERIOR_IMAGES.length) % INTERIOR_IMAGES.length);
    }, [selectedIndex]);

    const goToNext = useCallback(() => {
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex + 1) % INTERIOR_IMAGES.length);
    }, [selectedIndex]);

    // Keyboard navigation
    useEffect(() => {
        if (selectedIndex === null) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") goToPrev();
            if (e.key === "ArrowRight") goToNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, goToPrev, goToNext]);

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
                        Step into a world of luxury and relaxation at our Kanpur salon.
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
                        <button
                            key={idx}
                            onClick={() => openLightbox(idx)}
                            className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F27708] focus:ring-offset-2"
                            aria-label={`View ${image.alt}`}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </button>
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

            {/* Lightbox Modal */}
            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Close lightbox"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Previous Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-7 h-7 text-white" />
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); goToNext(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-7 h-7 text-white" />
                    </button>

                    {/* Image */}
                    <div
                        className="relative max-w-4xl max-h-[85vh] w-full h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={INTERIOR_IMAGES[selectedIndex].src}
                            alt={INTERIOR_IMAGES[selectedIndex].alt}
                            fill
                            className="object-contain rounded-lg"
                            sizes="(max-width: 1024px) 100vw, 80vw"
                            priority
                        />
                    </div>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                        {selectedIndex + 1} / {INTERIOR_IMAGES.length}
                    </div>
                </div>
            )}
        </section>
    );
}
