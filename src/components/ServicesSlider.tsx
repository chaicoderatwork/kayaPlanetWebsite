"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface ServiceVideo {
    id: string;
    videoUrl: string;
    title: string;
}

const SERVICE_VIDEOS: ServiceVideo[] = [
    { id: "1", videoUrl: "/service-videos/service1.mp4", title: "Bridal Makeup" },
    { id: "2", videoUrl: "/service-videos/service2.mp4", title: "Hair Styling" },
    { id: "3", videoUrl: "/service-videos/service3.mp4", title: "Facial Treatments" },
    { id: "4", videoUrl: "/service-videos/service4.mp4", title: "Party Makeup" },
    { id: "5", videoUrl: "/service-videos/service5.mp4", title: "HD Makeup" },
    { id: "6", videoUrl: "/service-videos/service6.mp4", title: "Engagement Look" },
    { id: "7", videoUrl: "/service-videos/service7.mp4", title: "Nail Art" },
    { id: "8", videoUrl: "/service-videos/service8.mp4", title: "Spa & Wellness" },
];

const WHATSAPP_NUMBER = "919999424375";

export default function ServicesSlider() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "200px" });
    const [shouldLoad, setShouldLoad] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const scrollPositionRef = useRef(0);
    const animationRef = useRef<number | null>(null);

    // Initial load delay
    useEffect(() => {
        if (isInView) {
            const timer = setTimeout(() => {
                setShouldLoad(true);
            }, 2000); // 2 second delay after coming into view
            return () => clearTimeout(timer);
        }
    }, [isInView]);

    useEffect(() => {
        const scrollContent = scrollRef.current;
        if (!scrollContent) return;

        const speed = 0.5;

        const animate = () => {
            if (!scrollContent) return;
            if (!isPaused) {
                scrollPositionRef.current += speed;
                const scrollWidth = scrollContent.scrollWidth / 2;
                if (scrollPositionRef.current >= scrollWidth) {
                    scrollPositionRef.current = 0;
                }
                scrollContent.style.transform = `translateX(-${scrollPositionRef.current}px)`;
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPaused]);

    const displayVideos = [...SERVICE_VIDEOS, ...SERVICE_VIDEOS];

    const getWhatsAppLink = (service: ServiceVideo) => {
        const message = `Hi! I want to enquire about ${service.title}. Ref: KP-${service.id}`;
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    };

    return (
        <section ref={containerRef} className="py-10 bg-[#111111] min-h-[400px]">
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

            <div
                className="overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                <div
                    ref={scrollRef}
                    className="flex gap-3 px-4"
                    style={{ willChange: "transform" }}
                >
                    {displayVideos.map((service, index) => (
                        <a
                            key={`${service.id}-${index}`}
                            href={getWhatsAppLink(service)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative flex-shrink-0 w-[160px] md:w-[200px] h-[280px] md:h-[350px] rounded-xl overflow-hidden block"
                        >
                            {shouldLoad && (
                                <video
                                    src={service.videoUrl}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="none"
                                    className="w-full h-full object-cover pointer-events-none"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <h3 className="text-white text-xs md:text-sm font-medium">
                                    {service.title}
                                </h3>
                                <span className="text-[10px] text-[#F27708] mt-1 block">Tap to enquire →</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
