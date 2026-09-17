"use client";

import { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Star,
  Volume2,
  VolumeX,
} from "lucide-react";
import { BRIDAL_REVIEWS, BRIDAL_TRUST } from "@/data/bridal";

function ReviewVideo({
  videoUrl,
  posterUrl,
  label,
}: {
  videoUrl: string;
  posterUrl: string;
  label: string;
}) {
  const [isMuted, setIsMuted] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);

  if (!shouldLoad) {
    return (
      <button
        type="button"
        onClick={() => setShouldLoad(true)}
        className="absolute inset-0"
        aria-label={`Play ${label}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="absolute inset-0">
      <video
        src={videoUrl}
        poster={posterUrl}
        muted={isMuted}
        autoPlay
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={() => setIsMuted((muted) => !muted)}
        aria-label={isMuted ? `Play ${label} with sound` : `Mute ${label}`}
        className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md"
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="w-full bg-[#24140F] px-5 py-16 text-white sm:px-8 md:py-20 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E2AC70]">
              Real bridal reviews
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-gelasio)] text-2xl leading-tight sm:text-4xl">
              Real brides. Real words.
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous bridal review"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition hover:bg-white hover:text-[#24140F]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next bridal review"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition hover:bg-white hover:text-[#24140F]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={emblaRef} className="mt-8 overflow-hidden">
          <div className="-ml-3 flex">
            {BRIDAL_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="min-w-0 flex-[0_0_86%] pl-3 sm:flex-[0_0_48%] lg:flex-[0_0_33.333%]"
              >
                <article>
                  <div className="relative h-[58vh] overflow-hidden rounded-2xl bg-[#120A07] sm:h-auto sm:aspect-[9/16]">
                    <ReviewVideo
                      videoUrl={review.videoUrl}
                      posterUrl={review.posterUrl}
                      label={review.videoLabel}
                    />
                  </div>
                  <div className="px-0.5 pt-3">
                    <div
                      className="flex gap-0.5 text-[#F0C086]"
                      aria-label="5 out of 5 stars"
                    >
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className="h-3 w-3 fill-current"
                        />
                      ))}
                    </div>
                    <blockquote className="mt-1.5 font-[family-name:var(--font-gelasio)] text-[15px] leading-5 text-white line-clamp-2 sm:text-base sm:leading-6">
                      “{review.quote}”
                    </blockquote>
                    <p className="mt-1.5 text-[11px] text-white/45">
                      {review.artist}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-white/45">
          <a
            href={BRIDAL_TRUST.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-[#F2CE9F] underline decoration-[#B77A43] underline-offset-4"
          >
            Watch more
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href={BRIDAL_TRUST.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-[#F2CE9F] underline decoration-[#B77A43] underline-offset-4"
          >
            147 reviews
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
