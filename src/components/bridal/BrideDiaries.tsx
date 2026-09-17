import { ArrowUpRight, Star } from "lucide-react";
import { BRIDAL_REVIEWS, BRIDAL_TRUST } from "@/data/bridal";

export default function BrideDiaries() {
  return (
    <section
      aria-labelledby="bridal-reviews-heading"
      className="bg-[#28150F] px-5 py-16 text-white sm:px-8 md:py-24 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E3AD70]">
              Verified bridal proof
            </p>
            <h2
              id="bridal-reviews-heading"
              className="mt-3 text-balance font-[family-name:var(--font-gelasio)] text-4xl leading-[1.02] md:text-5xl"
            >
              The details brides remember.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/60">
              Natural finish, listening carefully, calm support and makeup that
              lasts are the themes brides repeat most often.
            </p>

            <a
              href={BRIDAL_TRUST.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#F0C896] underline decoration-[#B87B45] underline-offset-8"
            >
              Read all 147 WedMeGood reviews
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {BRIDAL_REVIEWS.map((review) => (
              <figure
                key={review.id}
                className="flex h-full flex-col rounded-2xl border border-white/15 bg-white/[0.055] p-6"
              >
                <div
                  className="flex gap-1 text-[#E5AE6D]"
                  aria-label="5 out of 5 stars"
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 font-[family-name:var(--font-gelasio)] text-lg leading-7 text-white/90">
                  “{review.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <p className="text-sm font-semibold text-[#F1CEA3]">
                    {review.artist}
                  </p>
                  <p className="mt-1 text-xs text-white/45">{review.source}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
