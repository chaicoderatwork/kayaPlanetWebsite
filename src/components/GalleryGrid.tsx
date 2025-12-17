"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Play, Heart, Eye, Grid3X3, LayoutList, Instagram, Verified, ChevronLeft, ChevronRight, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
    id: string;
    type: "image" | "video";
    src: string;
    width: number;
    height: number;
    alt: string;
    title?: string;
    hashtags?: string[];
    views?: number;
    isPremium?: boolean; // For Royal Signature premium category
}

interface GalleryGridProps {
    items: GalleryItem[];
}

function formatViews(views: number): string {
    if (views >= 1000) {
        return (views / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return views.toString();
}

export default function GalleryGrid({ items: initialItems }: GalleryGridProps) {
    const [items, setItems] = useState<GalleryItem[]>(initialItems);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [viewMode, setViewMode] = useState<"grid" | "feed">("grid");
    const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

    // Shuffle on mount
    useEffect(() => {
        const shuffled = [...initialItems].sort(() => Math.random() - 0.5);
        setItems(shuffled);
    }, [initialItems]);

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

    const openItem = (item: GalleryItem, index: number) => {
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
            setSelectedItem(items[newIndex]);
            setSelectedIndex(newIndex);
        }
    };

    const navigateNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex < items.length - 1) {
            const newIndex = selectedIndex + 1;
            setSelectedItem(items[newIndex]);
            setSelectedIndex(newIndex);
        }
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedItem === null) return;

            if (e.key === 'ArrowLeft' && selectedIndex > 0) {
                const newIndex = selectedIndex - 1;
                setSelectedItem(items[newIndex]);
                setSelectedIndex(newIndex);
            } else if (e.key === 'ArrowRight' && selectedIndex < items.length - 1) {
                const newIndex = selectedIndex + 1;
                setSelectedItem(items[newIndex]);
                setSelectedIndex(newIndex);
            } else if (e.key === 'Escape') {
                closeItem();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedItem, selectedIndex, items]);

    const totalViews = items.reduce((sum, item) => sum + (item.views || 0), 0);

    return (
        <>
            {/* Instagram-style Profile Header */}
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
                                <button className="bg-[#efefef] hover:bg-[#dbdbdb] text-black px-2 py-1.5 rounded-lg transition-colors">
                                    <svg aria-label="Options" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                                        <circle cx="12" cy="12" r="1.5"></circle>
                                        <circle cx="6" cy="12" r="1.5"></circle>
                                        <circle cx="18" cy="12" r="1.5"></circle>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Top Row - Mobile */}
                        <div className="md:hidden flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-normal text-[#262626]">kayaplanetbeautysalon</h2>
                                <Verified className="w-5 h-5 text-[#0095F6] fill-[#0095F6] text-white" />
                                <button className="ml-auto">
                                    <svg aria-label="Options" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                                        <circle cx="12" cy="12" r="1.5"></circle>
                                        <circle cx="6" cy="12" r="1.5"></circle>
                                        <circle cx="18" cy="12" r="1.5"></circle>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <ul className="hidden md:flex items-center gap-10 mb-5 text-[16px]">
                            <li><span className="font-semibold text-[#262626]">{items.length}</span> posts</li>
                            <li><span className="font-semibold text-[#262626]">12.4K</span> followers</li>
                            <li><span className="font-semibold text-[#262626]">342</span> following</li>
                        </ul>

                        {/* Bio */}
                        <div className="text-sm text-[#262626] mb-4 md:mb-0">
                            <h1 className="font-semibold text-[14px]">Kaya Planet Salon & Academy</h1>
                            <p className="whitespace-pre-wrap leading-relaxed">
                                ✨ Kanpur&apos;s Premier Beauty Destination<br />
                                💄 Bridal | Engagement | HD Makeup<br />
                                🎓 Professional Makeup Artist Academy Courses<br />
                                📍 Kanpur
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
                            <a
                                href="tel:+919999424375"
                                className="flex-1 bg-[#efefef] text-black py-1.5 rounded-lg text-sm font-semibold text-center"
                            >
                                Contact
                            </a>
                        </div>
                    </div>
                </div>

                {/* Mobile Stats */}
                <ul className="flex md:hidden items-center justify-around py-4 border-t border-gray-100 mt-4 text-sm">
                    <li className="flex flex-col items-center">
                        <span className="font-semibold text-[#262626]">{items.length}</span>
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

                {/* View Tabs */}
                <div className="flex items-center justify-center border-t border-gray-200 mt-8 md:mt-12">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`flex items-center gap-2 h-[52px] px-4 md:px-12 text-xs font-semibold uppercase tracking-widest transition-colors ${viewMode === "grid"
                            ? "border-t border-[#262626] text-[#262626] -mt-[1px]"
                            : "text-[#8e8e8e]"
                            }`}
                    >
                        <Grid3X3 className="w-3 h-3" />
                        <span className="hidden md:inline">Posts</span>
                    </button>
                    <button
                        onClick={() => setViewMode("feed")}
                        className={`flex items-center gap-2 h-[52px] px-4 md:px-12 text-xs font-semibold uppercase tracking-widest transition-colors ${viewMode === "feed"
                            ? "border-t border-[#262626] text-[#262626] -mt-[1px]"
                            : "text-[#8e8e8e]"
                            }`}
                    >
                        <LayoutList className="w-3 h-3" />
                        <span className="hidden md:inline">Feed</span>
                    </button>
                    <button className="flex items-center gap-2 h-[52px] px-4 md:px-12 text-xs font-semibold uppercase tracking-widest text-[#8e8e8e]">
                        <span className="w-3 h-3 border border-current rotate-45 transform" />
                        <span className="hidden md:inline">Tagged</span>
                    </button>
                </div>
            </div>

            {/* Grid View */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-3 gap-1 md:gap-2">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.02 }}
                            className="relative aspect-square cursor-pointer group overflow-hidden bg-gray-100"
                            onClick={() => openItem(item, index)}
                        >
                            {item.type === "image" ? (
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 33vw, 25vw"
                                />
                            ) : (
                                <>
                                    <video
                                        src={item.src}
                                        className="w-full h-full object-cover"
                                        playsInline
                                        muted
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Play fill="white" className="w-5 h-5 text-white drop-shadow-lg" />
                                    </div>
                                </>
                            )}
                            {/* Royal Signature Premium Badge */}
                            {item.isPremium && (
                                <div className="absolute top-2 left-2 z-10">
                                    <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/10 shadow-lg">
                                        <Image src="/kayaplanetlogo.png" width={12} height={12} alt="" className="w-3 h-3 object-contain" />
                                        <span className="text-[9px] md:text-[10px] font-medium tracking-wide">
                                            Signature
                                        </span>
                                    </div>
                                </div>
                            )}
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                                <div className="flex items-center gap-1 text-white font-semibold">
                                    <Heart fill="white" className="w-5 h-5" />
                                    {formatViews((item.views || 0) * 0.7 | 0)}
                                </div>
                                <div className="flex items-center gap-1 text-white font-semibold">
                                    <Eye className="w-5 h-5" />
                                    {formatViews(item.views || 0)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                /* Feed View */
                <div className="max-w-lg mx-auto space-y-6">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            {/* Post Header */}
                            <div className="flex items-center gap-3 p-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F27708] to-pink-500 p-0.5">
                                    <div className="w-full h-full rounded-full bg-white p-0.5">
                                        <Image
                                            src="/kayaplanetlogo.png"
                                            alt="Kaya Planet"
                                            width={32}
                                            height={32}
                                            className="w-full h-full object-contain rounded-full"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">kayaplanetbeautysalon</p>
                                    <p className="text-xs text-gray-500">Kanpur, India</p>
                                </div>
                            </div>

                            {/* Media */}
                            <div
                                className="relative aspect-[4/5] bg-gray-100 cursor-pointer"
                                onClick={() => openItem(item, index)}
                            >
                                {item.type === "image" ? (
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 512px"
                                    />
                                ) : (
                                    <video
                                        src={item.src}
                                        className="w-full h-full object-cover"
                                        playsInline
                                        muted
                                        loop
                                        autoPlay
                                    />
                                )}
                                {/* Royal Signature Premium Badge */}
                                {item.isPremium && (
                                    <div className="absolute top-2 left-2 z-10">
                                        <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/10 shadow-lg">
                                            <Image src="/kayaplanetlogo.png" width={12} height={12} alt="" className="w-3 h-3 object-contain" />
                                            <span className="text-[9px] md:text-[10px] font-medium tracking-wide">
                                                Signature
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="p-3">
                                <div className="flex items-center gap-4 mb-2">
                                    <button
                                        onClick={(e) => toggleLike(item.id, e)}
                                        className="transition-transform active:scale-125"
                                    >
                                        <Heart
                                            className={`w-6 h-6 ${likedItems.has(item.id) ? "text-red-500 fill-red-500" : "text-gray-900"}`}
                                        />
                                    </button>
                                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                                        <Eye className="w-5 h-5" />
                                        {formatViews(item.views || 0)} views
                                    </div>
                                </div>

                                {/* Title & Hashtags */}
                                {item.title && (
                                    <p className="text-sm text-gray-900 mb-1">
                                        <span className="font-semibold">kayaplanetbeautysalon</span>{" "}
                                        {item.title}
                                    </p>
                                )}
                                {item.hashtags && item.hashtags.length > 0 && (
                                    <p className="text-sm text-[#F27708]">
                                        {item.hashtags.map(tag => `#${tag}`).join(" ")}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={closeItem}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-20"
                            onClick={closeItem}
                        >
                            <X size={32} />
                        </button>

                        {/* Previous Button */}
                        {selectedIndex > 0 && (
                            <button
                                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110"
                                onClick={navigatePrev}
                            >
                                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                            </button>
                        )}

                        {/* Next Button */}
                        {selectedIndex < items.length - 1 && (
                            <button
                                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110"
                                onClick={navigateNext}
                            >
                                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                            </button>
                        )}

                        <div
                            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Premium Badge in Lightbox */}
                            {selectedItem.isPremium && (
                                <div className="absolute top-4 left-4 z-10">
                                    <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                                        <Image src="/kayaplanetlogo.png" width={16} height={16} alt="" className="w-4 h-4 object-contain" />
                                        <span className="text-xs font-medium tracking-wide">
                                            KP Royal Signature
                                        </span>
                                    </div>
                                </div>
                            )}

                            {selectedItem.type === "image" ? (
                                <Image
                                    src={selectedItem.src}
                                    alt={selectedItem.alt}
                                    width={selectedItem.width}
                                    height={selectedItem.height}
                                    className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                                />
                            ) : (
                                <video
                                    src={selectedItem.src}
                                    className="max-h-[80vh] w-full max-w-lg rounded-lg shadow-2xl"
                                    controls
                                    autoPlay
                                    playsInline
                                />
                            )}

                            {/* Caption */}
                            <div className="mt-4 text-center">
                                {selectedItem.title && (
                                    <p className="text-white font-medium text-lg mb-1">{selectedItem.title}</p>
                                )}
                                {selectedItem.hashtags && (
                                    <p className="text-[#F27708] text-sm">
                                        {selectedItem.hashtags.map(tag => `#${tag}`).join(" ")}
                                    </p>
                                )}
                                <div className="flex items-center justify-center gap-4 mt-2">
                                    <p className="text-white/60 text-sm flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        {formatViews(selectedItem.views || 0)} views
                                    </p>
                                    {/* Navigation indicator */}
                                    <p className="text-white/40 text-sm">
                                        {selectedIndex + 1} / {items.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
