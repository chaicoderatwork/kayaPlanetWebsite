"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
        <div ref={containerRef} className="w-full h-full relative bg-gray-900">
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
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${posterUrl})` }}
                />
            )}
        </div>
    );
}

export default function ServicesSlider() {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { align: "start", loop: true },
        [Autoplay({ delay: 4000, stopOnInteraction: false }) as any]
    );

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const getWhatsAppLink = (service: ServiceVideo) => {
        const message = `Hi! I want to enquire about ${service.title}.`;
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
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
                    <div className="flex gap-3">
                        {SERVICE_VIDEOS.map((service) => (
                            <div
                                key={service.id}
                                className="flex-shrink-0 w-[45%] sm:w-[30%] md:w-[23%] lg:w-[18%]"
                            >
                                <a
                                    href={getWhatsAppLink(service)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative block w-full h-[280px] md:h-[350px] rounded-xl overflow-hidden bg-gray-900 shadow-lg group"
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
                                            Tap to enquire →
                                        </span>
                                    </div>
                                </a>
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
        </section>
    );
}
