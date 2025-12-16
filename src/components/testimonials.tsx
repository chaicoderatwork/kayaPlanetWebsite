"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCheck } from "lucide-react";
import Avatar from "boring-avatars";

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
        text: "Absolutely loved my bridal makeup! The team made me feel like a princess on my special day. Highly recommend Kaya Planet! 💕",
    },
    {
        id: "2",
        username: "Anjali Gupta",
        rating: 5,
        time: "1 month ago",
        text: "Best salon in Kanpur! The staff is so professional and friendly. My hair has never looked better ✨",
    },
    {
        id: "3",
        username: "Sneha Verma",
        rating: 5,
        time: "3 weeks ago",
        text: "Amazing experience! The ambiance is so relaxing and the services are top-notch. Will definitely come back 🙌",
    },
    {
        id: "4",
        username: "Ritika Singh",
        rating: 5,
        time: "1 week ago",
        text: "Got my engagement makeup done here. Everyone couldn't stop complimenting! Thank you Kaya Planet team! 💖",
    },
    {
        id: "5",
        username: "Kavita Yadav",
        rating: 5,
        time: "5 days ago",
        text: "The bridal package was worth every penny! Felt so pampered and looked stunning. 10/10 recommend! 👰",
    },
];

export default function Testimonials() {
    const [reviews, setReviews] = useState<Testimonial[]>(STATIC_TESTIMONIALS);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const scrollPositionRef = useRef(0);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch("https://kpcrud-vj8f.vercel.app/api/links6");
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) setReviews(data);
                }
            } catch {
                // Use static testimonials
            }
        };
        fetchReviews();
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
                    <h2 className="text-2xl md:text-4xl font-[family-name:var(--font-stardom)] mt-1 text-[#111111]">
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
                                <Avatar size={28} name={review.username} variant="beam" />
                                <span className="text-sm font-medium text-gray-700">{review.username}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
