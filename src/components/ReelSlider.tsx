"use client";

import React, { useCallback, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Reel {
    id: string;
    videoUrl: string;
    posterUrl: string;
    title: string;
}

const REELS: Reel[] = [
    { id: "1", videoUrl: "/videos/reel1.mp4", posterUrl: "/videos/reel1-poster.webp", title: "Bridal Transformation" },
    { id: "2", videoUrl: "/videos/reel2.mp4", posterUrl: "/videos/reel2-poster.webp", title: "Engagement Glam" },
    { id: "3", videoUrl: "/videos/reel3.mp4", posterUrl: "/videos/reel3-poster.webp", title: "Party Makeup" },
    { id: "4", videoUrl: "/videos/reel4.mp4", posterUrl: "/videos/reel4-poster.webp", title: "HD Makeup Look" },
    { id: "5", videoUrl: "/videos/reel5.mp4", posterUrl: "/videos/reel5-poster.webp", title: "Celebrity Style" },
    { id: "6", videoUrl: "/videos/reel6.mp4", posterUrl: "/videos/reel6-poster.webp", title: "Academy Class" },
];

const WHATSAPP_NUMBER = "919999424375";

export default function ReelSlider() {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { align: "start", loop: true, containScroll: "trimSnaps" },
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

    const getWhatsAppLink = (reel: Reel) => {
        const message = `Hi! I loved this look: "${reel.title}". I want to book a similar makeover! Ref: KP-R${reel.id}`;
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="w-full py-8 bg-white min-h-[400px]">
            <div className="max-w-7xl mx-auto px-4 mb-6">
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-xs font-semibold text-[#F27708] uppercase tracking-wider">
                            Portfolio
                        </span>
                        <h2 className="text-2xl md:text-4xl font-[family-name:var(--font-stardom)] mt-1 text-[#111111]">
                            Our Work
                        </h2>
                    </div>
                    <Link
                        href="/gallery"
                        className="inline-flex items-center gap-2 border border-[#F27708] text-[#F27708] px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-medium hover:bg-[#F27708] hover:text-white transition-all whitespace-nowrap"
                    >
                        See More
                    </Link>
                </div>
            </div>

            <div className="relative container mx-auto px-4 md:px-8">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-3">
                        {REELS.map((reel, index) => (
                            <div
                                key={reel.id}
                                className="flex-shrink-0 w-[45%] sm:w-[30%] md:w-[23%] lg:w-[18%]"
                            >
                                <a
                                    href={getWhatsAppLink(reel)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative block w-full h-[280px] md:h-[350px] rounded-xl overflow-hidden bg-gray-900 shadow-lg group"
                                >
                                    <video
                                        ref={(el) => { videoRefs.current[index] = el; }}
                                        src={reel.videoUrl}
                                        poster={reel.posterUrl}
                                        muted
                                        loop
                                        playsInline
                                        preload="auto"
                                        className="w-full h-full object-cover pointer-events-none"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/70 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <p className="text-white font-medium text-xs md:text-sm">
                                            {reel.title}
                                        </p>
                                        <span className="text-[10px] text-[#F27708] mt-1 block group-hover:underline">
                                            Tap to book →
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
        </div>
    );
}
