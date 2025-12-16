"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useInView } from "framer-motion";

export default function AboutFounders() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section className="py-10 md:py-14 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Heading */}
                <div className="text-center mb-8">
                    <span className="text-xs font-semibold text-[#F27708] uppercase tracking-wider">
                        About Us
                    </span>
                    <h2 className="text-2xl md:text-4xl font-[family-name:var(--font-stardom)] mt-1 text-[#111111]">
                        Our Journey
                    </h2>
                </div>

                {/* Content */}
                <div
                    ref={ref}
                    className="flex flex-col lg:flex-row items-center gap-8 max-w-5xl mx-auto"
                    style={{
                        transform: isInView ? "none" : "translateY(30px)",
                        opacity: isInView ? 1 : 0,
                        transition: "all 0.6s ease-out 0.1s",
                    }}
                >
                    {/* Founder Image */}
                    <div className="w-full lg:w-2/5">
                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-lg">
                            <Image
                                src="/founder_image.webp"
                                alt="Kaya Planet Founders"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 40vw"
                            />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="w-full lg:w-3/5 text-center lg:text-left">
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                            Welcome to <strong>Kaya Planet Beauty Salon</strong>, where luxury meets expertise. For nine years, we have provided exceptional beauty services, ensuring every visit is a transformative experience.
                        </p>
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-5">
                            Our skilled artists blend creativity with professionalism, delivering the highest standards of service.
                        </p>
                        <Link
                            href="/about"
                            className="inline-block border-2 border-[#F27708] text-[#F27708] hover:bg-[#F27708] hover:text-white text-sm font-medium px-6 py-2 rounded-full transition-colors"
                        >
                            Know More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
