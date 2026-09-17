"use client";

import Image from "next/image";
import { MessageCircle, Star } from "lucide-react";
import { BRIDAL_TRUST } from "@/data/bridal";
import { trackContact, waLink } from "@/lib/contact";

export default function HeroSlider() {
    return (
        <section className="relative isolate flex min-h-[78svh] w-full items-end overflow-hidden bg-[#1C0F0B] text-white md:min-h-[84svh] md:items-center">
            <Image
                src="/hero1.webp"
                alt="Kaya Planet bride wearing a luminous traditional bridal look"
                fill
                priority
                className="object-cover object-[62%_top] md:object-top"
                sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,8,5,0.08)_0%,rgba(20,8,5,0.28)_36%,rgba(20,8,5,0.94)_100%)] md:bg-[linear-gradient(90deg,rgba(20,8,5,0.94)_0%,rgba(20,8,5,0.72)_42%,rgba(20,8,5,0.08)_78%)]" />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 pt-28 sm:px-8 md:px-12 md:py-36">
                <div className="max-w-2xl">
                    <h1 className="text-balance font-[family-name:var(--font-gelasio)] text-4xl leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
                        Bridal makeup in Kanpur,
                        <span className="block font-normal italic text-[#F2C88F]">
                            by Bhawna &amp; Rashika.
                        </span>
                    </h1>

                    <div className="mt-7">
                        <a
                            href={waLink("bridal")}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackContact("whatsapp_click", "hero", "bridal")}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white transition hover:bg-[#1DA851] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            <MessageCircle className="h-5 w-5" />
                            Check my date
                        </a>
                    </div>

                    <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 border-t border-white/20 pt-5">
                        <div>
                            <p className="flex items-center gap-1 font-[family-name:var(--font-gelasio)] text-lg text-[#F5D7AD] sm:text-xl">
                                <Star className="h-4 w-4 fill-current" />
                                {BRIDAL_TRUST.rating}
                            </p>
                            <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/55 sm:text-[10px]">
                                147 {BRIDAL_TRUST.reviewSource} reviews
                            </p>
                        </div>
                        <div>
                            <p className="font-[family-name:var(--font-gelasio)] text-lg text-[#F5D7AD] sm:text-xl">
                                From ₹14k
                            </p>
                            <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/55 sm:text-[10px]">
                                Bridal packages
                            </p>
                        </div>
                        <div>
                            <p className="font-[family-name:var(--font-gelasio)] text-lg text-[#F5D7AD] sm:text-xl">
                                10+
                            </p>
                            <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/55 sm:text-[10px]">
                                Years in Kanpur
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
