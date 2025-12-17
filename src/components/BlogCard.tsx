"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

interface BlogCardProps {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    date: string;
    hasVideo?: boolean;
    tags?: string[];
}

export default function BlogCard({
    slug,
    title,
    excerpt,
    coverImage,
    date,
    hasVideo,
    tags,
}: BlogCardProps) {
    const formattedDate = new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            {/* Image */}
            <Link href={`/blog/${slug}`} className="block relative aspect-[16/10] overflow-hidden">
                <Image
                    src={coverImage}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Play Icon for Video Posts */}
                {hasVideo && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                        <Play fill="#F27708" className="w-4 h-4 text-[#F27708]" />
                    </div>
                )}
            </Link>

            {/* Content */}
            <div className="p-5">
                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {tags.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="text-[10px] font-semibold uppercase tracking-wider text-[#F27708] bg-[#F27708]/10 px-2 py-1 rounded-full"
                            >
                                {tag.replace("-", " ")}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <Link href={`/blog/${slug}`}>
                    <h3 className="font-semibold text-lg text-gray-900 leading-tight mb-2 group-hover:text-[#F27708] transition-colors line-clamp-2">
                        {title}
                    </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{excerpt}</p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {formattedDate}
                    </div>
                    <Link
                        href={`/blog/${slug}`}
                        className="flex items-center gap-1 text-sm font-medium text-[#F27708] hover:gap-2 transition-all"
                    >
                        Read
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}
