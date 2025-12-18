"use client";

import Image from "next/image";
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
                    <h2 className="text-2xl md:text-4xl font-[family-name:var(--font-gelasio)] mt-1 text-[#111111]">
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
                    <div className="w-full lg:w-3/5 text-justify lg:text-left">
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                            Welcome to <strong>Kaya Planet</strong>, home to some of the most loved bridal transformations in the city and widely recognized as the <strong>Best Bridal Makeup Artist in Kanpur</strong>. For over a decade, we have poured our heart into creating gorgeous, camera-ready looks that still feel like <em>you</em>, just more confident, more radiant, and ready for your biggest moments.
                        </p>

                        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                            What keeps us going is the trust. Hundreds of brides and clients have chosen us for their engagement, wedding, and celebration looks, and we are truly grateful for every single one. That trust is our biggest responsibility, and we treat it that way, every time.
                        </p>

                        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-5">
                            <strong>Bhawna Ma&apos;am</strong> brings years of experience and perfection in finishing, while <strong>Rashika Ma&apos;am</strong> brings fresh creativity, energy, and modern aesthetics. Together, our team blends artistry with professionalism to deliver the highest standards of service, tailored to your skin, your features, and your event.
                        </p>

                        <div className="text-center lg:text-left">
                            <a
                                href="https://wa.me/919999424375"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block border-2 border-[#F27708] text-[#F27708] hover:bg-[#F27708] hover:text-white text-sm font-medium px-6 py-2 rounded-full transition-colors"
                            >
                                Know More
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
