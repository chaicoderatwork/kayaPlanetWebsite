"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCheck } from "lucide-react";

interface Testimonial {
    id: string;
    username: string;
    rating: number;
    time: string;
    text: string;
}

const STATIC_TESTIMONIALS: Testimonial[] = [
    {
        id: "1",
        username: "Priya Sharma",
        rating: 5,
        time: "2 weeks ago",
        text: "Hands down the best bridal makeup artist in Kanpur! My HD makeup was flawless and lasted the entire wedding. Highly recommend! 💕",
    },
    {
        id: "2",
        username: "Anjali Gupta",
        rating: 5,
        time: "1 month ago",
        text: "Visited for party makeup in Govind Nagar. Staff is so professional and my hairstyle got so many compliments! ✨",
    },
    {
        id: "3",
        username: "Sneha Verma",
        rating: 5,
        time: "3 weeks ago",
        text: "If you're searching for the best makeup artist in Kanpur, look no further! Their Academy course was amazing. Use of MAC & Huda Beauty really helped me learn. 🙌",
    },
    {
        id: "4",
        username: "Ritika Singh",
        rating: 5,
        time: "1 week ago",
        text: "Got my engagement makeup done here. The Airbrush finish was stunning. Best bridal makeup in Kanpur for sure! 💖",
    },
    {
        id: "5",
        username: "Kavita Yadav",
        rating: 5,
        time: "5 days ago",
        text: "The pre-bridal package was amazing! They truly are the best makeup artist Kanpur has. 10/10 recommend for any bride! 👰",
    },
];

// Lightweight avatar - just initials with gradient background
function SimpleAvatar({ name }: { name: string }) {
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    // Generate consistent color from name
    const hue = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
    return (
        <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
            style={{ background: `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${hue + 30}, 70%, 40%))` }}
        >
            {initials}
        </div>
    );
}

export default function Testimonials() {
    const [reviews, setReviews] = useState<Testimonial[]>(STATIC_TESTIMONIALS);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const scrollPositionRef = useRef(0);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const fetchReviews = async () => {
            try {
                const res = await fetch("https://kpcrud-vj8f.vercel.app/api/links6", {
                    signal: controller.signal,
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) setReviews(data);
                }
            } catch {
                // Use static testimonials
            }
        };
        fetchReviews();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const scrollContent = scrollRef.current;
        if (!scrollContent || reviews.length === 0) return;

        const speed = 0.3;

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
    }, [reviews.length, isPaused]);

    const displayReviews = [...reviews, ...reviews];

    return (
        <section className="py-12 bg-[#FDFBF9]">
            <div className="container mx-auto px-4 mb-8">
                <div className="text-center">
                    <span className="text-xs font-semibold text-[#F27708] uppercase tracking-wider">
                        Reviews
                    </span>
                    <h2 className="text-2xl md:text-4xl font-[family-name:var(--font-gelasio)] mt-1 text-[#111111]">
                        Happy Clients
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
                    className="flex gap-4 px-4"
                    style={{ willChange: "transform" }}
                >
                    {displayReviews.map((review, index) => (
                        <div
                            key={`${review.id}-${index}`}
                            className="flex-shrink-0 w-[280px] md:w-[320px]"
                        >
                            {/* WhatsApp-style Chat Bubble */}
                            <div className="bg-[#DCF8C6] rounded-2xl rounded-tl-sm p-4 shadow-sm relative">
                                <div className="absolute -left-2 top-0 w-4 h-4 bg-[#DCF8C6]" style={{
                                    clipPath: "polygon(100% 0, 100% 100%, 0 0)"
                                }} />
                                <p className="text-gray-800 text-sm leading-relaxed">
                                    {review.text}
                                </p>
                                <div className="flex items-center justify-end gap-1 mt-2">
                                    <span className="text-[10px] text-gray-500">{review.time}</span>
                                    <CheckCheck className="w-4 h-4 text-blue-500" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3 ml-2">
                                <SimpleAvatar name={review.username} />
                                <span className="text-sm font-medium text-gray-700">{review.username}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
