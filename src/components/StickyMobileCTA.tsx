"use client";

import { Phone, Calendar, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function StickyMobileCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down 100px
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 bg-white z-[100] border-t border-gray-200 p-3 md:hidden transition-transform duration-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]",
                isVisible ? "translate-y-0" : "translate-y-full"
            )}
        >
            <div className="grid grid-cols-2 gap-3">
                <a
                    href="tel:+919999424375"
                    className="flex flex-col items-center justify-center text-gray-700 hover:text-[#F27708] py-1"
                >
                    <Phone className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium uppercase tracking-wide">Call Now</span>
                </a>

                <a
                    href="https://wa.me/919999424375"
                    target="_blank"
                    className="flex flex-col items-center justify-center bg-[#25D366] text-white rounded-lg py-2 shadow-sm"
                >
                    <MessageCircle className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium uppercase tracking-wide">WhatsApp</span>
                </a>
            </div>
        </div>
    );
}
