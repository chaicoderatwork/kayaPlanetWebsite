"use client";

import React, { useCallback, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceVideo {
    id: string;
    videoUrl: string;
    posterUrl: string;
    title: string;
}

const SERVICE_VIDEOS: ServiceVideo[] = [
    { id: "1", videoUrl: "/service-videos/service1.mp4", posterUrl: "/service-videos/service1-poster.webp", title: "Bridal Makeup" },
    { id: "2", videoUrl: "/service-videos/service2.mp4", posterUrl: "/service-videos/service2-poster.webp", title: "Hair Styling" },
    { id: "3", videoUrl: "/service-videos/service3.mp4", posterUrl: "/service-videos/service3-poster.webp", title: "Facial Treatments" },
    { id: "4", videoUrl: "/service-videos/service4.mp4", posterUrl: "/service-videos/service4-poster.webp", title: "Party Makeup" },
    { id: "5", videoUrl: "/service-videos/service5.mp4", posterUrl: "/service-videos/service5-poster.webp", title: "HD Makeup" },
    { id: "6", videoUrl: "/service-videos/service6.mp4", posterUrl: "/service-videos/service6-poster.webp", title: "Engagement Look" },
    { id: "7", videoUrl: "/service-videos/service7.mp4", posterUrl: "/service-videos/service7-poster.webp", title: "Nail Art" },
];

const WHATSAPP_NUMBER = "919999424375";

export default function ServicesSlider() {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { align: "start", loop: true },
        [Autoplay({ delay: 4000, stopOnInteraction: false }) as any]
    );
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    // Auto-play each video when it's ready (canplaythrough)
    const handleCanPlayThrough = useCallback((index: number) => {
        const video = videoRefs.current[index];
        if (video) {
            video.play().catch(() => { });
        }
    }, []);

    // Set up event listeners for all videos
    useEffect(() => {
        const videos = videoRefs.current;
        const handlers: (() => void)[] = [];

        videos.forEach((video, index) => {
            if (video) {
                const handler = () => handleCanPlayThrough(index);
                video.addEventListener("canplaythrough", handler);
                handlers[index] = handler;

                // If video is already ready (cached), play immediately
                if (video.readyState >= 4) {
                    video.play().catch(() => { });
                }
            }
        });

        return () => {
            videos.forEach((video, index) => {
                if (video && handlers[index]) {
                    video.removeEventListener("canplaythrough", handlers[index]);
                }
            });
        };
    }, [handleCanPlayThrough]);

    const getWhatsAppLink = (service: ServiceVideo) => {
        const message = `Hi! I want to enquire about ${service.title}. Ref: KP-${service.id}`;
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    };

    return (
        <section className="py-10 bg-[#111111] min-h-[400px]">
            <div className="container mx-auto px-4 mb-6">
                <div className="text-center">
                    <span className="text-xs font-semibold text-[#F27708] uppercase tracking-wider">
                        What We Offer
                    </span>
                    <h2 className="text-2xl md:text-4xl font-[family-name:var(--font-stardom)] mt-1 text-white">
                        Our Services
                    </h2>
                </div>
            </div>

            <div className="relative container mx-auto px-4 md:px-8">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-3">
                        {SERVICE_VIDEOS.map((service, index) => (
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
                                    <video
                                        ref={(el) => { videoRefs.current[index] = el; }}
                                        src={service.videoUrl}
                                        poster={service.posterUrl}
                                        muted
                                        loop
                                        playsInline
                                        preload="auto"
                                        className="w-full h-full object-cover pointer-events-none"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
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
