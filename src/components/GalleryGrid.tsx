"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Play, Heart, Eye, Grid3X3, LayoutList, Instagram, Verified, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Filter categories with hashtag mappings
const FILTER_CATEGORIES = [
    { id: "all", label: "All", hashtags: [] },
    { id: "engagement", label: "Engagement", hashtags: ["EngagementMakeup", "EngagementLook", "Engagement", "BrideToBeSimran", "BrideToBeGlow"] },
    { id: "party", label: "Party", hashtags: ["PartyMakeup", "PartyReady", "PartyLook", "GlamLook", "EveningMakeup", "GlamNight"] },
    { id: "bridal", label: "Bridal", hashtags: ["BridalMakeup", "BridalGlow", "BridalLook", "BridalBeauty", "TraditionalBride", "ModernBride", "SouthIndianBride", "IndianWedding", "WeddingMakeup", "WeddingGlam", "WeddingReady", "Transformation"] },
    { id: "reception", label: "Reception", hashtags: ["ReceptionLook", "ReceptionMakeup", "Reception"] },
    { id: "soft-glam", label: "Soft Glam", hashtags: ["SoftGlam", "NaturalMakeup", "NaturalGlam", "SoftBride", "MinimalistMakeup", "ElegantLook", "SoftBride"] },
    { id: "hd", label: "HD", hashtags: ["HDMakeup", "AirbrushMakeup", "FlawlessFinish", "FlawlessSkin", "ProMakeup"] },
    { id: "kp-royal", label: "KP Royal", hashtags: ["KPRoyal", "Signature", "CelebrityMakeup", "CelebrityVibes", "Premium"] },
];

export interface GalleryItem {
    id?: string;
    type: "image" | "video";
    src: string;
    poster?: string;
    width: number;
    height: number;
    alt: string;
    title?: string;
    hashtags?: string[];
    views?: number;
    isPremium?: boolean;
    blurData?: string;
    badge?: string;
    badgeType?: string;
}

export interface GalleryGroup {
    group: string;
    items: GalleryItem[];
}

interface GalleryGridProps {
    items?: GalleryItem[];
    groups?: GalleryGroup[];
}

function formatViews(views: number): string {
    if (views >= 1000) {
        return (views / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return views.toString();
}

export default function GalleryGrid({ items: initialItems = [], groups = [] }: GalleryGridProps) {
    // Flatten groups for lightbox navigation if groups are provided
    const allItems = useMemo(() => {
        if (groups.length > 0) {
            return groups.flatMap(g => g.items);
        }
        return initialItems;
    }, [groups, initialItems]);

    // Use items state only if NOT using groups (for shuffle logic if needed, but we default to stable for groups)
    const [displayItems, setDisplayItems] = useState<GalleryItem[]>(initialItems);
    const [activeFilter, setActiveFilter] = useState("all");

    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

    // Filter items based on active filter
    const filteredItems = useMemo(() => {
        if (activeFilter === "all") return allItems;

        const filterCategory = FILTER_CATEGORIES.find(f => f.id === activeFilter);
        if (!filterCategory || filterCategory.hashtags.length === 0) return allItems;

        return allItems.filter(item => {
            if (!item.hashtags || item.hashtags.length === 0) return false;
            return item.hashtags.some(tag =>
                filterCategory.hashtags.some(filterTag =>
                    tag.toLowerCase().includes(filterTag.toLowerCase()) ||
                    filterTag.toLowerCase().includes(tag.toLowerCase())
                )
            );
        });
    }, [allItems, activeFilter]);

    // Shuffle only if NOT grouped
    useEffect(() => {
        if (groups.length === 0 && initialItems.length > 0) {
            const shuffled = [...initialItems].sort(() => Math.random() - 0.5);
            setDisplayItems(shuffled);
        }
    }, [initialItems, groups.length]);

    const toggleLike = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setLikedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const openItem = (item: GalleryItem) => {
        const index = allItems.indexOf(item);
        setSelectedItem(item);
        setSelectedIndex(index);
    };

    const closeItem = () => {
        setSelectedItem(null);
        setSelectedIndex(-1);
    };

    const navigatePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex > 0) {
            const newIndex = selectedIndex - 1;
            setSelectedItem(allItems[newIndex]);
            setSelectedIndex(newIndex);
        }
    };

    const navigateNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex < allItems.length - 1) {
            const newIndex = selectedIndex + 1;
            setSelectedItem(allItems[newIndex]);
            setSelectedIndex(newIndex);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedItem === null) return;

            if (e.key === 'ArrowLeft' && selectedIndex > 0) {
                const newIndex = selectedIndex - 1;
                setSelectedItem(allItems[newIndex]);
                setSelectedIndex(newIndex);
            } else if (e.key === 'ArrowRight' && selectedIndex < allItems.length - 1) {
                const newIndex = selectedIndex + 1;
                setSelectedItem(allItems[newIndex]);
                setSelectedIndex(newIndex);
            } else if (e.key === 'Escape') {
                closeItem();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedItem, selectedIndex, allItems]);

    return (
        <>


            {/* No Results Message */}
            {filteredItems.length === 0 && activeFilter !== "all" && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No items found for this filter.</p>
                    <button
                        onClick={() => setActiveFilter("all")}
                        className="mt-4 text-[#F27708] hover:underline"
                    >
                        View all items
                    </button>
                </div>
            )}

            {/* Instagram Style Header */}
            <div className="max-w-4xl mx-auto mb-8 px-4 font-sans text-[#262626]">
                <div className="flex flex-col md:flex-row md:items-start items-center gap-6 md:gap-16">
                    {/* Profile Picture with Story Ring */}
                    <div className="flex-shrink-0 relative group cursor-pointer">
                        <div className="w-[84px] h-[84px] md:w-[150px] md:h-[150px] rounded-full p-[2px] bg-gradient-to-tr from-[#FFC107] via-[#F44336] to-[#9C27B0]">
                            <div className="w-full h-full rounded-full bg-[#1a1a1a] p-3 md:p-5 flex items-center justify-center">
                                <Image
                                    src="/kayaplanetlogo.png"
                                    alt="Kaya Planet"
                                    width={100}
                                    height={100}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 w-full md:w-auto">
                        {/* Top Row: Username & Actions - Desktop */}
                        <div className="hidden md:flex items-center gap-4 mb-5">
                            <h2 className="text-xl font-normal text-[#262626]">kayaplanetbeautysalon</h2>
                            <Verified className="w-5 h-5 text-[#0095F6] fill-[#0095F6] text-white" />
                            <div className="flex gap-2 ml-4">
                                <Link
                                    href="https://www.instagram.com/kayaplanetbeautysalon/"
                                    target="_blank"
                                    className="bg-[#0095F6] hover:bg-[#1877F2] text-white px-5 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Follow
                                </Link>
                                <a
                                    href="https://wa.me/919999424375"
                                    target="_blank"
                                    className="bg-[#efefef] hover:bg-[#dbdbdb] text-black px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Message
                                </a>
                            </div>
                        </div>

                        {/* Mobile Top */}
                        <div className="md:hidden flex flex-col gap-4">
                            <div className="flex items-center gap-2 justify-center">
                                <h2 className="text-xl font-normal text-[#262626]">kayaplanetbeautysalon</h2>
                                <Verified className="w-5 h-5 text-[#0095F6] fill-[#0095F6] text-white" />
                            </div>
                        </div>

                        {/* Stats Row */}
                        <ul className="hidden md:flex items-center gap-10 mb-5 text-[16px]">
                            <li><span className="font-semibold text-[#262626]">{allItems.length}</span> posts</li>
                            <li><span className="font-semibold text-[#262626]">12.4K</span> followers</li>
                            <li><span className="font-semibold text-[#262626]">342</span> following</li>
                        </ul>

                        {/* Bio */}
                        <div className="text-sm text-[#262626] mb-4 md:mb-0 text-center md:text-left">
                            <h1 className="font-semibold text-[14px]">Kaya Planet Salon & Academy</h1>
                            <p className="whitespace-pre-wrap leading-relaxed">
                                ✨ Kanpur&apos;s Premier Beauty Destination<br />
                                💄 Bridal | Engagement | HD Makeup<br />
                                🎓 Professional Makeup Artist Academy Courses
                            </p>
                            <a href="https://kayaplanet.com" className="text-[#00376B] font-semibold hover:underline">
                                kayaplanet.com
                            </a>
                        </div>

                        {/* Mobile Actions */}
                        <div className="flex md:hidden gap-2 mt-4">
                            <Link
                                href="https://www.instagram.com/kayaplanetbeautysalon/"
                                target="_blank"
                                className="flex-1 bg-[#0095F6] text-white py-1.5 rounded-lg text-sm font-semibold text-center"
                            >
                                Follow
                            </Link>
                            <a
                                href="https://wa.me/919999424375"
                                target="_blank"
                                className="flex-1 bg-[#efefef] text-black py-1.5 rounded-lg text-sm font-semibold text-center"
                            >
                                Message
                            </a>
                        </div>
                    </div>
                </div>
                {/* Mobile Stats */}
                <ul className="flex md:hidden items-center justify-around py-4 border-t border-gray-100 mt-4 text-sm">
                    <li className="flex flex-col items-center">
                        <span className="font-semibold text-[#262626]">{allItems.length}</span>
                        <span className="text-gray-500">posts</span>
                    </li>
                    <li className="flex flex-col items-center">
                        <span className="font-semibold text-[#262626]">10.4K</span>
                        <span className="text-gray-500">followers</span>
                    </li>
                    <li className="flex flex-col items-center">
                        <span className="font-semibold text-[#262626]">347</span>
                        <span className="text-gray-500">following</span>
                    </li>
                </ul>
            </div>

            {/* Filter Bar - Moved below Header */}
            <div className="mb-6 overflow-hidden border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
                    <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {FILTER_CATEGORIES.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === filter.id
                                ? "bg-gradient-to-r from-[#F27708] to-[#F89134] text-white shadow-lg shadow-orange-500/25"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {filter.label}
                            {activeFilter === filter.id && filter.id !== "all" && (
                                <span className="ml-1.5 text-xs opacity-80">
                                    ({filteredItems.length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gallery Grid */}
            <motion.div
                layout
                className="grid grid-cols-3 gap-0.5 md:gap-4 md:px-0"
            >
                <AnimatePresence mode="popLayout">
                    {groups.length > 0 && activeFilter === "all" ? (
                        // Grouped View (when no filter active)
                        groups.map((group, gIndex) => (
                            <React.Fragment key={group.group || gIndex}>
                                {group.items.map((item, index) => (
                                    <motion.div
                                        key={`${group.group}-${index}`}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative aspect-square cursor-pointer group overflow-hidden bg-gray-100"
                                        onClick={() => openItem(item)}
                                    >
                                        {item.type === "image" ? (
                                            <Image
                                                src={item.src}
                                                alt={item.alt}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 768px) 33vw, 25vw"
                                                placeholder={item.blurData ? "blur" : "empty"}
                                                blurDataURL={item.blurData}
                                            />
                                        ) : (
                                            <>
                                                <video
                                                    src={item.src}
                                                    poster={item.poster}
                                                    className="w-full h-full object-cover"
                                                    playsInline
                                                    muted
                                                    loop // Auto loop small videos in grid is nice
                                                    autoPlay // Autoplay muted
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <Play fill="white" className="w-5 h-5 text-white drop-shadow-lg" />
                                                </div>
                                            </>
                                        )}
                                        {/* Badges - Bottom Left */}
                                        {item.badge && (
                                            <div className="absolute bottom-3 left-3 z-10 w-fit">
                                                {item.badgeType === 'real-bride' ? (
                                                    // Minimal Real Bride Badge
                                                    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full shadow-sm border border-white/50">
                                                        <span className="text-[9px] font-bold tracking-wider text-rose-950">
                                                            KP Bride
                                                        </span>
                                                    </div>
                                                ) : (
                                                    // Signature Badge (KP Royal)
                                                    <div className="flex items-center gap-1.5 bg-[#0f0f0f]/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-amber-500/30 shadow-[0_0_15px_rgba(242,119,8,0.25)] ring-1 ring-white/5">
                                                        <Image src="/kayaplanetlogo.png" width={10} height={10} alt="" className="w-3 h-3 object-contain opacity-90" />
                                                        <span className="text-[9px] font-bold tracking-[0.1em] bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 bg-clip-text text-transparent">
                                                            Signature
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </React.Fragment>
                        ))
                    ) : (
                        // Filtered or Flat View
                        filteredItems.map((item, index) => (
                            <motion.div
                                key={item.id || index}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="relative aspect-square cursor-pointer group overflow-hidden bg-gray-100"
                                onClick={() => openItem(item)}
                            >
                                {item.type === "image" ? (
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 33vw, 25vw"
                                        placeholder={item.blurData ? "blur" : "empty"}
                                        blurDataURL={item.blurData}
                                    />
                                ) : (
                                    <>
                                        <video
                                            src={item.src}
                                            poster={item.poster}
                                            className="w-full h-full object-cover"
                                            playsInline
                                            muted
                                            loop
                                            autoPlay
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Play fill="white" className="w-5 h-5 text-white drop-shadow-lg" />
                                        </div>
                                    </>
                                )}
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-white" />
                                </div>
                                {/* Badges */}
                                {item.badge && (
                                    <div className="absolute bottom-3 left-3 z-10 w-fit">
                                        {item.badgeType === 'real-bride' ? (
                                            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full shadow-sm border border-white/50">
                                                <span className="text-[9px] font-bold tracking-wider text-rose-950">
                                                    KP Bride
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 bg-[#0f0f0f]/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-amber-500/30 shadow-[0_0_15px_rgba(242,119,8,0.25)] ring-1 ring-white/5">
                                                <Image src="/kayaplanetlogo.png" width={10} height={10} alt="" className="w-3 h-3 object-contain opacity-90" />
                                                <span className="text-[9px] font-bold tracking-[0.1em] bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 bg-clip-text text-transparent">
                                                    Signature
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 touch-none"
                        onClick={closeItem}
                    >
                        <button
                            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-20"
                            onClick={closeItem}
                        >
                            <X size={32} />
                        </button>

                        {/* Navigation */}
                        {selectedIndex > 0 && (
                            <button
                                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                                onClick={navigatePrev}
                            >
                                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                            </button>
                        )}
                        {selectedIndex < allItems.length - 1 && (
                            <button
                                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                                onClick={navigateNext}
                            >
                                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                            </button>
                        )}

                        <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            {/* Media */}
                            <div className="relative w-full h-[85vh] md:h-[80vh]">
                                {selectedItem.type === "image" ? (
                                    <Image
                                        src={selectedItem.src}
                                        alt={selectedItem.alt}
                                        fill
                                        className="object-contain"
                                        placeholder={selectedItem.blurData ? "blur" : undefined}
                                        blurDataURL={selectedItem.blurData}
                                        priority
                                    />
                                ) : (
                                    <video
                                        src={selectedItem.src}
                                        poster={selectedItem.poster}
                                        className="w-full h-full object-contain"
                                        controls
                                        autoPlay
                                        playsInline
                                    />
                                )}
                                {/* Lightbox Badge - Positioned over media */}
                                {selectedItem.badge && (
                                    <div className="absolute bottom-16 md:bottom-12 left-4 z-50 w-fit">
                                        {selectedItem.badgeType === 'real-bride' ? (
                                            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg border border-white/50">
                                                <span className="text-[12px] font-bold tracking-wider text-rose-950">
                                                    KP Bride
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 bg-[#0f0f0f]/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full border border-amber-500/30 shadow-[0_0_20px_rgba(242,119,8,0.3)] ring-1 ring-white/5">
                                                <Image src="/kayaplanetlogo.png" width={16} height={16} alt="" className="w-4 h-4 object-contain opacity-90" />
                                                <span className="text-[12px] font-bold tracking-[0.1em] bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 bg-clip-text text-transparent">
                                                    KP Royal Signature
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Short Caption */}
                            <div className="absolute bottom-6 md:bottom-4 text-center">
                                <h3 className="text-white text-lg font-medium drop-shadow-md">
                                    {selectedItem.alt || "Kaya Planet Bride"}
                                </h3>
                                <p className="text-white/60 text-sm mt-1">
                                    {selectedIndex + 1} / {allItems.length}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
