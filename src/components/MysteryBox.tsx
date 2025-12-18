"use client";

import { useState, useEffect } from "react";
import { X, Gift, Sparkles, Copy, Check } from "lucide-react";

const OFFERS = [
    {
        title: "Free Premium Press-On Nails! 💅",
        description: "Get FREE Tich premium press-on nails on any service above ₹1000",
        code: "KPNAILS",
        color: "from-pink-500 to-purple-600",
    },
    {
        title: "₹300 OFF! 🎉",
        description: "Flat ₹300 off on your first visit to Kaya Planet on services above ₹1000",
        code: "KPFIRST",
        color: "from-orange-500 to-red-500",
    },
];

const STORAGE_KEY = "kp_mystery_shown";

export default function MysteryBox() {
    const [isVisible, setIsVisible] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<typeof OFFERS[0] | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Check if user has already seen the popup
        const hasSeenPopup = localStorage.getItem(STORAGE_KEY);

        if (!hasSeenPopup) {
            // Show popup after 5 seconds
            const timer = setTimeout(() => {
                setIsVisible(true);
                // Randomly select an offer
                const randomOffer = OFFERS[Math.floor(Math.random() * OFFERS.length)];
                setSelectedOffer(randomOffer);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleOpen = () => {
        setIsOpened(true);
        localStorage.setItem(STORAGE_KEY, "true");
    };

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem(STORAGE_KEY, "true");
    };

    const handleCopyCode = () => {
        if (selectedOffer) {
            navigator.clipboard.writeText(selectedOffer.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            {/* Close Button */}
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
                aria-label="Close"
            >
                <X size={24} />
            </button>

            <div className="relative max-w-sm w-full">
                {!isOpened ? (
                    // Closed Mystery Box
                    <div
                        className="flex flex-col items-center cursor-pointer"
                        onClick={handleOpen}
                    >
                        {/* Animated Gift Box */}
                        <div className="relative animate-bounce">
                            <div className="w-32 h-32 bg-gradient-to-br from-[#F27708] to-[#F89134] rounded-xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                                {/* Ribbon */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-4 bg-white/30 rotate-45 absolute"></div>
                                    <div className="w-4 h-full bg-white/30 rotate-45 absolute"></div>
                                </div>
                                {/* Sparkles */}
                                <Sparkles className="w-10 h-10 text-white animate-pulse" />
                            </div>
                            {/* Lid */}
                            <div className="w-36 h-8 bg-gradient-to-br from-[#F27708] to-[#F89134] rounded-t-lg -mt-2 mx-auto shadow-lg flex items-center justify-center">
                                <Gift className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        <p className="text-white text-xl font-bold mt-6 text-center">
                            🎁 You&apos;ve got a mystery gift!
                        </p>
                        <p className="text-white/70 text-sm mt-2 text-center">
                            Tap to reveal your exclusive offer
                        </p>
                    </div>
                ) : (
                    // Opened - Reveal Offer
                    <div className={`bg-gradient-to-br ${selectedOffer?.color} rounded-2xl p-6 shadow-2xl animate-in zoom-in duration-300`}>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-4">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="text-white text-2xl font-bold mb-2">
                                {selectedOffer?.title}
                            </h3>

                            <p className="text-white/90 text-sm mb-6">
                                {selectedOffer?.description}
                            </p>

                            {/* Code Box */}
                            <div className="bg-white/20 rounded-lg p-3 mb-4">
                                <p className="text-white/70 text-xs mb-1">Your code:</p>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-white text-2xl font-mono font-bold tracking-wider">
                                        {selectedOffer?.code}
                                    </span>
                                    <button
                                        onClick={handleCopyCode}
                                        className="text-white/80 hover:text-white p-1"
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>

                            <p className="text-white/60 text-xs mb-4">
                                Show this code at Kaya Planet Salon
                            </p>

                            <a
                                href={`https://wa.me/919999424375?text=${encodeURIComponent(
                                    `Hi! I got the offer "${selectedOffer?.title}" with code: ${selectedOffer?.code}. I want to book an appointment!`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsVisible(false)}
                                className="w-full bg-white text-gray-900 font-medium py-3 rounded-full hover:bg-gray-100 transition-colors block text-center"
                            >
                                Claim on WhatsApp →
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
