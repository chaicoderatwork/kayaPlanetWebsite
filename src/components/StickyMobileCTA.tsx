"use client";

import { Phone, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { waLink, PHONE_TEL, trackContact } from "@/lib/contact";

const EXCLUDED_PATHS = ["/anniversary", "/admin"];

export default function StickyMobileCTA() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const isExcludedPath = EXCLUDED_PATHS.some((p) => pathname?.startsWith(p));

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

    if (isExcludedPath) return null;

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 bg-white z-[100] border-t border-gray-200 p-3 md:hidden transition-transform duration-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]",
                isVisible ? "translate-y-0" : "translate-y-full"
            )}
        >
            <div className="grid grid-cols-2 gap-3">
                <a
                    href={PHONE_TEL}
                    onClick={() => trackContact("call_click", "sticky-bar")}
                    className="flex flex-col items-center justify-center text-gray-700 hover:text-[#F27708] py-1"
                >
                    <Phone className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium uppercase tracking-wide">Call Now</span>
                </a>

                <a
                    href={waLink("bridal")}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContact("whatsapp_click", "sticky-bar", "bridal")}
                    className="flex flex-col items-center justify-center bg-[#25D366] text-white rounded-lg py-2 shadow-sm"
                >
                    <MessageCircle className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium uppercase tracking-wide">Check my date on WhatsApp</span>
                </a>
            </div>
        </div>
    );
}
