import Image from "next/image";
import { Play } from "lucide-react";

type DeferredVideoPosterProps = {
  posterUrl: string;
  alt: string;
  sizes: string;
};

/** Poster only. The video file is loaded after a tap, never on first paint. */
export default function DeferredVideoPoster({
  posterUrl,
  alt,
  sizes,
}: DeferredVideoPosterProps) {
  return (
    <div className="relative h-full w-full bg-gray-900">
      <Image
        src={posterUrl}
        alt={alt}
        fill
        loading="lazy"
        className="object-cover"
        sizes={sizes}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm">
          <Play className="ml-0.5 h-5 w-5 fill-current" />
        </span>
      </div>
    </div>
  );
}
