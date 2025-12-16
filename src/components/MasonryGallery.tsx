"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Instagram, User } from "lucide-react";
import { cn } from "@/lib/utils";

// Interface for Gallery Items
interface GalleryItem {
    id: string;
    imageUrl: string;
    title: string; // Bride name or style
    instagramUrl?: string;
    category?: string;
}

// Static fallback data (ISR will be better, but initializing with this)
const GALLERY_ITEMS: GalleryItem[] = [
    { id: "1", imageUrl: "/hs1.webp", title: "Rhea's Bridal Look", instagramUrl: "https://instagram.com/reel/1" },
    { id: "2", imageUrl: "/hs2.webp", title: "Simran's Engagement", instagramUrl: "https://instagram.com/reel/2" },
    { id: "3", imageUrl: "/poster1.webp", title: "Mehendi Vibes", instagramUrl: "https://instagram.com/reel/3" },
    { id: "4", imageUrl: "/poster2.webp", title: "Reception Glam", instagramUrl: "https://instagram.com/reel/4" },
    { id: "5", imageUrl: "/poster3.webp", title: "Party Makeup", instagramUrl: "https://instagram.com/reel/5" },
    { id: "6", imageUrl: "/bg1.webp", title: "Airbrush Finish", instagramUrl: "https://instagram.com/reel/6" },
    { id: "7", imageUrl: "/bg2.webp", title: "HD Makeup", instagramUrl: "https://instagram.com/reel/7" },
    { id: "8", imageUrl: "/sonam.webp", title: "Sonam's Big Day", instagramUrl: "https://instagram.com/reel/8" },
    // Add many more items here...
];


export default function MasonryGallery() {
    const [items, setItems] = useState<GalleryItem[]>(GALLERY_ITEMS);
    // In real ISR implementation, items would be passed as props

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-stardom)] text-center mb-4 text-[#111111]">Our Masterpieces</h1>
            <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">Explore our portfolio of beautiful brides and transformations. Click to see details and watch the reel.</p>

            {/* Masonry Grid using CSS Columns */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {items.map((item, idx) => (
                    <div key={item.id} className="relative group break-inside-avoid rounded-xl overflow-hidden cursor-pointer bg-gray-100">
                        <Image
                            src={item.imageUrl}
                            alt={item.title}
                            width={500}
                            height={700}
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" // Basic placeholder
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <h3 className="text-white text-xl font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                {item.title}
                            </h3>

                            {item.instagramUrl && (
                                <a
                                    href={item.instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[#F27708] mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 hover:text-white"
                                >
                                    <Instagram size={18} />
                                    <span className="text-sm font-medium">Watch Reel</span>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
