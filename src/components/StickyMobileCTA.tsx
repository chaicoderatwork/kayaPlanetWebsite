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
    const isBridalPath = pathname === "/" || pathname?.startsWith("/bridal");
    const contactService = pathname === "/engagement" ? "engagement" : isBridalPath ? "bridal" : "general";

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
            <div className={cn("grid gap-3", isBridalPath ? "grid-cols-1" : "grid-cols-2")}>
                {!isBridalPath && (
                <a
                    href={PHONE_TEL}
                    onClick={() => trackContact("call_click", "sticky-bar", contactService)}
                    className="flex flex-col items-center justify-center text-gray-700 hover:text-[#F27708] py-1"
                >
                    <Phone className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium uppercase tracking-wide">Call Now</span>
                </a>
                )}

                <a
                    href={waLink(contactService)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                        trackContact(
                            "whatsapp_click",
                            isBridalPath ? "bridal-sticky-bar" : "sticky-bar",
                            contactService,
                        )
                    }
                    className="flex min-h-12 items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl px-4 py-2 shadow-sm"
                >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-xs font-semibold">
                        {isBridalPath
                            ? "Check my date"
                            : "Chat on WhatsApp"}
                    </span>
                </a>
            </div>
        </div>
    );
}
