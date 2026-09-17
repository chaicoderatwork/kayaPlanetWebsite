"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useCallback, useEffect } from "react";
import { useInView } from "framer-motion";
import { Eye, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";

const INTERIOR_IMAGES = [
    {
        src: "/interior1.webp",
        alt: "Jharokha view into Kaya Planet’s Indian-aesthetic bridal photography space",
        label: "Bridal photography set",
        featured: true,
    },
    {
        src: "/interior3.webp",
        alt: "Carved door and chandelier backdrop used for bridal portraits",
        label: "Portrait backdrop",
    },
    {
        src: "/interior2.webp",
        alt: "Hair styling floor at Kaya Planet",
        label: "Hair studio",
    },
    {
        src: "/interior4.webp",
        alt: "Makeup and wash area at Kaya Planet",
        label: "Getting-ready studio",
    },
];

const GOOGLE_MAPS_360_LINK =
    "https://www.google.com/maps/place/Kaya+Planet+Beauty+Salon+-+Make+Up+Artist+In+Kanpur,+Bridal+Make+Up+Artist+In+Kanpur,+Make+Up+Academy+In+Kanpur/@26.4496116,80.2988153,3a,75y,220h,90t/data=!3m8!1e1!3m6!1sCIABIhAGbzzgWS23EmfKlasAB18u!2e10!3e11!6shttps:%2F%2Flh3.googleusercontent.com%2Fgpms-cs-s%2FAPRy3c_sKBj7YxgQccxIEVireS4tz5jTVY7_hERhHmL8S9MeMMrAvNpgY2WbeiuOrZ84nBNGGvMgQIjUpTVvKDSc_GvgfrMfivOvRivCblNnIlFNecgqD9YgpzMCT9VVJjAAxra8X4mPX8xQZfE%3Dw900-h600-k-no-pi0-ya5.674942016601591-ro0-fo100!7i7680!8i3840!4m18!1m8!3m7!1s0x399c479344ff543f:0x18ea6eb778191466!2sKaya+Planet+Beauty+Salon+-+Make+Up+Artist+In+Kanpur,+Bridal+Make+Up+Artist+In+Kanpur,+Make+Up+Academy+In+Kanpur!8m2!3d26.4496295!4d80.2988175!10e1!16s%2Fg%2F11cls7bnj0!3m8!1s0x399c479344ff543f:0x18ea6eb778191466!8m2!3d26.4496295!4d80.2988175!10e5!14m1!1BCgIgARICCAI!16s%2Fg%2F11cls7bnj0?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D";

export default function SalonInterior() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setSelectedIndex(index);
    const closeLightbox = () => setSelectedIndex(null);

    const goToPrev = useCallback(() => {
        if (selectedIndex === null) return;
        setSelectedIndex(
            (selectedIndex - 1 + INTERIOR_IMAGES.length) % INTERIOR_IMAGES.length,
        );
    }, [selectedIndex]);

    const goToNext = useCallback(() => {
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex + 1) % INTERIOR_IMAGES.length);
    }, [selectedIndex]);

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
        <section
            id="photography-space"
            className="w-full bg-[#F7F0E8] px-5 py-16 sm:px-8 md:py-20 lg:px-12"
        >
            <div className="mx-auto max-w-7xl">
                <div className="max-w-3xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9A592D]">
                        Bridal photography space
                    </p>
                    <h2 className="mt-3 font-[family-name:var(--font-gelasio)] text-3xl leading-tight text-[#28170F] sm:text-4xl md:text-5xl">
                        A set from an Indian aesthetics book.
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6B584F] sm:text-base">
                        This is where you get ready and take the first photographs.
                        Jharokha arches, carved doors and chandelier light — so the
                        portraits already feel like the wedding album, before you leave
                        the salon.
                    </p>
                </div>

                <div
                    ref={ref}
                    className="mt-10 grid gap-3 md:grid-cols-3 md:grid-rows-2"
                    style={{
                        transform: isInView ? "none" : "translateY(24px)",
                        opacity: isInView ? 1 : 0,
                        transition: "all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) 0.15s",
                    }}
                >
                    {INTERIOR_IMAGES.map((image, idx) => (
                        <button
                            key={image.src}
                            type="button"
                            onClick={() => openLightbox(idx)}
                            className={`group relative overflow-hidden rounded-2xl bg-[#E8D4C0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9A592D] ${
                                image.featured
                                    ? "aspect-[16/11] md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[28rem]"
                                    : "aspect-[4/3]"
                            }`}
                            aria-label={`View ${image.alt}`}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes={
                                    image.featured
                                        ? "(max-width: 768px) 100vw, 66vw"
                                        : "(max-width: 768px) 100vw, 33vw"
                                }
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                            <span className="absolute bottom-3 left-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:bottom-4 sm:left-4 sm:text-xs">
                                {image.label}
                            </span>
                            <Eye className="absolute right-3 top-3 h-5 w-5 text-white opacity-0 transition group-hover:opacity-100" />
                        </button>
                    ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                        href={GOOGLE_MAPS_360_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#7D431F] px-5 text-sm font-semibold text-white transition hover:bg-[#643417]"
                    >
                        <Eye className="h-4 w-4" />
                        Walk through in 360°
                    </Link>
                    <Link
                        href="https://maps.google.com/?q=Kaya+Planet+Salon+125/53-B+Govind+Nagar+Kanpur"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#C9A585] px-5 text-sm font-semibold text-[#7D431F] transition hover:bg-white"
                    >
                        <MapPin className="h-4 w-4" />
                        Get directions
                    </Link>
                </div>
            </div>

            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"
                        aria-label="Close lightbox"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPrev();
                        }}
                        className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-7 w-7" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToNext();
                        }}
                        className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white"
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-7 w-7" />
                    </button>
                    <div
                        className="relative h-full w-full max-h-[85vh] max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={INTERIOR_IMAGES[selectedIndex].src}
                            alt={INTERIOR_IMAGES[selectedIndex].alt}
                            fill
                            className="rounded-lg object-contain"
                            sizes="(max-width: 1024px) 100vw, 80vw"
                            priority
                        />
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
                        {selectedIndex + 1} / {INTERIOR_IMAGES.length}
                    </div>
                </div>
            )}
        </section>
    );
}
