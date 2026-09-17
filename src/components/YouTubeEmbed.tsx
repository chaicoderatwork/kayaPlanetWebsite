"use client";

import { useState } from "react";

interface YouTubeEmbedProps {
    url: string;
    title?: string;
}

function getYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
}

export default function YouTubeEmbed({ url, title = "YouTube video" }: YouTubeEmbedProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoId = getYouTubeId(url);

    if (!videoId) {
        return null;
    }

    if (!isPlaying) {
        return (
            <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black"
                aria-label={`Play ${title}`}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute inset-0 grid place-items-center bg-black/25">
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-red-600 text-white">
                        <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-current" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </span>
                </span>
            </button>
        );
    }

    return (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
            />
        </div>
    );
}
