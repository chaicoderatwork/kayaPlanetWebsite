"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Reel {
    id: string;
    videoUrl: string;
    title: string;
}

const REELS: Reel[] = [
    { id: "1", videoUrl: "/videos/reel1.mp4", title: "Bridal Transformation" },
    { id: "2", videoUrl: "/videos/reel2.mp4", title: "Engagement Glam" },
    { id: "3", videoUrl: "/videos/reel3.mp4", title: "Party Makeup" },
    { id: "4", videoUrl: "/videos/reel4.mp4", title: "HD Makeup Look" },
    { id: "5", videoUrl: "/videos/reel5.mp4", title: "Celebrity Style" },
    { id: "6", videoUrl: "/videos/reel6.mp4", title: "Academy Class" },
];

const WHATSAPP_NUMBER = "919999424375";

export default function ReelSlider() {
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

        const speed = 0.4;

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

    const displayReels = [...REELS, ...REELS];

    const getWhatsAppLink = (reel: Reel) => {
        const message = `Hi! I loved this look: "${reel.title}". I want to book a similar makeover! Ref: KP-R${reel.id}`;
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div ref={containerRef} className="w-full py-8 bg-white min-h-[400px]">
            <div className="max-w-7xl mx-auto px-4 mb-6">
                <div className="text-center">
                    <span className="text-xs font-semibold text-[#F27708] uppercase tracking-wider">
                        Our Work
                    </span>
                    <h2 className="text-2xl md:text-4xl font-[family-name:var(--font-stardom)] mt-1 text-[#111111]">
                        Follow Our Journey
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
                    {displayReels.map((reel, index) => (
                        <a
                            key={`${reel.id}-${index}`}
                            href={getWhatsAppLink(reel)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative flex-shrink-0 w-[160px] md:w-[200px] h-[280px] md:h-[350px] rounded-xl overflow-hidden bg-gray-900 shadow-lg block"
                        >
                            {shouldLoad && (
                                <video
                                    src={reel.videoUrl}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="none"
                                    className="w-full h-full object-cover pointer-events-none"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/70 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <p className="text-white font-medium text-xs md:text-sm">
                                    {reel.title}
                                </p>
                                <span className="text-[10px] text-[#F27708] mt-1 block">Tap to book →</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
