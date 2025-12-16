"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Play, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
    id: string;
    type: "image" | "video";
    src: string;
    width: number;
    height: number;
    alt: string;
}

interface GalleryGridProps {
    items: GalleryItem[];
}

export default function GalleryGrid({ items: initialItems }: GalleryGridProps) {
    const [items, setItems] = useState<GalleryItem[]>(initialItems);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    // Simple shuffle on mount for "dynamic ordering"
    useEffect(() => {
        const shuffled = [...initialItems].sort(() => Math.random() - 0.5);
        setItems(shuffled);
    }, [initialItems]);

    return (
        <>
            {/* Masonry Grid */}
            <div className="columns-2 md:columns-3 gap-4 px-4 space-y-4">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden bg-gray-100"
                        onClick={() => setSelectedItem(item)}
                    >
                        {item.type === "image" ? (
                            <Image
                                src={item.src}
                                alt={item.alt}
                                width={item.width}
                                height={item.height}
                                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="relative w-full">
                                <video
                                    src={item.src}
                                    className="w-full h-auto object-cover"
                                    playsInline
                                    muted
                                    loop
                                    autoPlay
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Play fill="white" className="w-4 h-4 text-white ml-0.5" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white font-medium flex items-center gap-2">
                                <Maximize2 size={16} /> View
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox / Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedItem(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
                            onClick={() => setSelectedItem(null)}
                        >
                            <X size={32} />
                        </button>

                        <div
                            className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedItem.type === "image" ? (
                                <Image
                                    src={selectedItem.src}
                                    alt={selectedItem.alt}
                                    width={selectedItem.width}
                                    height={selectedItem.height}
                                    className="max-h-[90vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                                />
                            ) : (
                                <video
                                    src={selectedItem.src}
                                    className="max-h-[85vh] w-full max-w-5xl rounded-lg shadow-2xl"
                                    controls
                                    autoPlay
                                    playsInline
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
