"use client";

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
    const videoId = getYouTubeId(url);

    if (!videoId) {
        return null;
    }

    return (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
            />
        </div>
    );
}
