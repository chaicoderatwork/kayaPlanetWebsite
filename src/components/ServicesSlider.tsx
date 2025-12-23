"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import servicesData from "@/data/services.json";

interface ServiceVideo {
    id: string;
    videoUrl: string;
    posterUrl: string;
    title: string;
}

const SERVICE_VIDEOS: ServiceVideo[] = servicesData;

const WHATSAPP_NUMBER = "919999424375";

// Lazy Video component that only loads when visible
function LazyVideo({
    videoUrl,
    posterUrl,
}: {
    videoUrl: string;
    posterUrl: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setShouldLoad(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: "100px",
                threshold: 0.1
            }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    // Play video when it loads
    useEffect(() => {
        const video = videoRef.current;
        if (video && shouldLoad) {
            video.play().catch(() => { /* Ignore play errors */ });
        }
    }, [shouldLoad]);

    return (
        <div ref={containerRef} className="w-full h-full relative bg-gray-900 icon-wrapper">
            {shouldLoad ? (
                <video
                    ref={videoRef}
                    src={videoUrl}
                    poster={posterUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    webkit-playsinline="true"
                    preload="metadata"
                    className="w-full h-full object-cover"
                />
            ) : (
                <Image
                    src={posterUrl}
                    alt="Service Preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                />
            )}
        </div>
    );
}

// Full-screen modal component - rendered conditionally for zero cost when closed
function FullScreenModal({
    service,
    onClose,
    onPrev,
    onNext,
    hasPrev,
    hasNext,
}: {
    service: ServiceVideo;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
    hasPrev: boolean;
    hasNext: boolean;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);

    const getWhatsAppLink = () => {
        const message = `Hi! I want to enquire about ${service.title}.`;
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft" && hasPrev) onPrev();
            if (e.key === "ArrowRight" && hasNext) onNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, onPrev, onNext, hasPrev, hasNext]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Close"
            >
                <X className="w-8 h-8" />
            </button>

            {/* Navigation arrows */}
            {hasPrev && (
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </button>
            )}
            {hasNext && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Next"
                >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </button>
            )}

            {/* Content */}
            <div
                className="relative w-full max-w-sm md:max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Video */}
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-900 shadow-2xl">
                    <video
                        ref={videoRef}
                        src={service.videoUrl}
                        poster={service.posterUrl}
                        autoPlay
                        loop
                        playsInline
                        controls
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Title and CTA */}
                <div className="mt-4 text-center">
                    <h3 className="text-white text-lg font-medium mb-3">{service.title}</h3>
                    <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-full font-medium transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Enquire Now
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function ServicesSlider() {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { align: "start", loop: true },
        [Autoplay({ delay: 4000, stopOnInteraction: false }) as any]
    );

    const [selectedService, setSelectedService] = useState<ServiceVideo | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const openModal = (service: ServiceVideo, index: number) => {
        setSelectedService(service);
        setSelectedIndex(index);
    };

    const closeModal = () => {
        setSelectedService(null);
        setSelectedIndex(-1);
    };

    const goToPrev = () => {
        if (selectedIndex > 0) {
            const newIndex = selectedIndex - 1;
            setSelectedService(SERVICE_VIDEOS[newIndex]);
            setSelectedIndex(newIndex);
        }
    };

    const goToNext = () => {
        if (selectedIndex < SERVICE_VIDEOS.length - 1) {
            const newIndex = selectedIndex + 1;
            setSelectedService(SERVICE_VIDEOS[newIndex]);
            setSelectedIndex(newIndex);
        }
    };

    return (
        <section className="py-10 bg-[#111111] min-h-[400px]">
            <div className="container mx-auto px-4 mb-6">
                <div className="text-center">
                    <span className="text-xs font-semibold text-[#F27708] uppercase tracking-wider">
                        What We Offer
                    </span>
                    <h2 className="text-2xl md:text-4xl font-[family-name:var(--font-gelasio)] mt-1 text-white">
                        Our Services
                    </h2>
                </div>
            </div>

            <div className="relative container mx-auto px-4 md:px-8">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {SERVICE_VIDEOS.map((service, index) => (
                            <div
                                key={service.id}
                                className="flex-shrink-0 w-[45%] sm:w-[30%] md:w-[23%] lg:w-[18%] pl-3 first:pl-0"
                            >
                                <button
                                    onClick={() => openModal(service, index)}
                                    className="relative block w-full h-[280px] md:h-[350px] rounded-xl overflow-hidden bg-gray-900 shadow-lg group text-left"
                                >
                                    <LazyVideo
                                        videoUrl={service.videoUrl}
                                        posterUrl={service.posterUrl}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
                                        <h3 className="text-white text-xs md:text-sm font-medium">
                                            {service.title}
                                        </h3>
                                        <span className="text-[10px] text-[#F27708] mt-1 block group-hover:underline">
                                            Tap to view →
                                        </span>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={scrollPrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                </button>
                <button
                    onClick={scrollNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>
            </div>

            {/* Full-screen modal - only rendered when a service is selected */}
            {selectedService && (
                <FullScreenModal
                    service={selectedService}
                    onClose={closeModal}
                    onPrev={goToPrev}
                    onNext={goToNext}
                    hasPrev={selectedIndex > 0}
                    hasNext={selectedIndex < SERVICE_VIDEOS.length - 1}
                />
            )}
        </section>
    );
}
