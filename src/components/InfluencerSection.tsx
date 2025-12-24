import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Verified, Users, X, Play } from "lucide-react";
import influencersData from "@/data/influencers.json";

interface Influencer {
    handle: string;
    name: string;
    followers: string;
    image: string | null;
    profileUrl: string;
    reelUrl: string | null;
    testimonial?: string | null;
    isFeatured?: boolean;
}

const INFLUENCERS: Influencer[] = influencersData;

// Video Modal Component
function VideoModal({
    videoUrl,
    onClose,
}: {
    videoUrl: string;
    onClose: () => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Close"
            >
                <X className="w-8 h-8" />
            </button>

            <div
                className="relative w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-900 shadow-2xl border border-white/10">
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        autoPlay
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}

export default function InfluencerSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // TODO: Replace this with the actual Neetu Bisht video file path
    // Example: /videos/neetu-reel.mp4
    const NEETU_VIDEO_URL = "/videos/reel5.mp4";

    return (
        <section className="py-12 md:py-16 bg-gradient-to-b from-white to-[#FDFBF9] overflow-hidden">
            <div className="container mx-auto px-4 overflow-hidden">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <span className="text-xs font-semibold text-[#F27708] uppercase tracking-wider">
                        Social Proof
                    </span>
                    <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-gelasio)] mt-1 text-[#111111]">
                        Trusted by Creators
                    </h2>
                    <p className="text-gray-500 text-sm mt-3 px-4 md:px-0 md:max-w-lg mx-auto leading-relaxed">
                        Our confidence comes from being the natural choice<br className="md:hidden" />
                        for Kanpur&apos;s biggest influencers, even for their special days.
                    </p>
                </div>

                {/* CSS-only Infinite Marquee */}
                <div className="relative mb-10 overflow-hidden">
                    {/* Gradient Fades */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                    {/* Scrolling Container */}
                    <div className="flex animate-marquee">
                        {/* Duplicate for seamless loop */}
                        {[...INFLUENCERS, ...INFLUENCERS, ...INFLUENCERS].map((influencer, idx) => (
                            <Link
                                key={`${influencer.handle}-${idx}`}
                                href={influencer.reelUrl || influencer.profileUrl}
                                target="_blank"
                                className="flex-shrink-0 mx-2 md:mx-4 group"
                            >
                                <div className="flex items-center gap-2 md:gap-3 bg-white border border-gray-100 rounded-full px-2 py-2 md:px-4 md:py-3 shadow-sm hover:shadow-md hover:border-[#F27708]/30 transition-all pr-4 md:pr-6">
                                    {/* Avatar */}
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-gray-100 flex-shrink-0 relative">
                                        {influencer.image ? (
                                            <Image
                                                src={influencer.image}
                                                alt={influencer.name}
                                                fill
                                                sizes="40px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#F27708] via-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                                                {influencer.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs md:text-sm font-semibold text-gray-900 group-hover:text-[#F27708] transition-colors truncate max-w-[80px] md:max-w-none">
                                                {influencer.name}
                                            </span>
                                            <Verified className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#0095F6] fill-[#0095F6] flex-shrink-0" />
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500">
                                            <Users className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                            {influencer.followers}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Featured Collaboration Card */}
                <div className="w-full max-w-[340px] md:max-w-xl mx-auto">
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-4 md:p-6">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 relative">
                                    <Image
                                        src="/influencers/neetu.jpg"
                                        alt="Neetu Bisht"
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-semibold text-sm md:text-base text-gray-900 truncate">@iam_neetubisht_</span>
                                        <Verified className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#0095F6] fill-[#0095F6] flex-shrink-0" />
                                        <span className="text-xs text-gray-500 whitespace-nowrap">• 5.1M</span>
                                    </div>
                                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 break-words">
                                        &quot;Amazing experience with Kaya Planet! The best makeup artist in Kanpur for sure.&quot; ✨
                                    </p>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-[#F27708] hover:text-[#F89134] transition-colors group"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-[#fae8e0] flex items-center justify-center group-hover:bg-[#F27708] transition-colors">
                                            <Play className="w-3 h-3 text-[#F27708] fill-[#F27708] group-hover:text-white group-hover:fill-white ml-0.5" />
                                        </div>
                                        Watch Reel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isModalOpen && (
                    <VideoModal
                        videoUrl={NEETU_VIDEO_URL}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </div>

            {/* CSS for Marquee Animation */}
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
