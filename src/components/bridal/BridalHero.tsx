"use client";

import {
  ArrowDown,
  MessageCircle,
  ShieldCheck,
  Star,
} from "lucide-react";
import { waLink, trackContact } from "@/lib/contact";
import { BRIDAL_SEASONS, BRIDAL_TRUST } from "@/data/bridal";
import HeroLcpImage from "@/components/HeroLcpImage";

export default function BridalHero() {
  return (
    <section
      aria-labelledby="bridal-hero-title"
      className="relative isolate overflow-hidden bg-[#1D0F0B] text-white"
    >
      <div className="grid min-h-[82svh] lg:grid-cols-[1.02fr_0.98fr]">
        <div className="relative z-10 flex items-end px-5 pb-12 pt-28 sm:px-8 md:pb-16 lg:items-center lg:px-12 lg:py-36">
          <div className="mx-auto w-full max-w-2xl lg:ml-auto lg:mr-0">
            <h1
              id="bridal-hero-title"
              className="text-balance font-[family-name:var(--font-gelasio)] text-4xl leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl"
            >
              Bridal makeup artists in Kanpur
              <span className="mt-2 block font-normal italic text-[#E8B978]">
                Bhawna &amp; Rashika
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              Bridal makeup that still looks like you—planned around your skin,
              outfit, jewellery, venue light and ready-by time.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <p>
                From{" "}
                <strong className="font-[family-name:var(--font-gelasio)] text-xl text-[#F5D8B0]">
                  ₹14,000
                </strong>
              </p>
              <span className="hidden h-4 w-px bg-white/20 sm:block" />
              <p className="flex items-center gap-1.5 text-white/70">
                <ShieldCheck className="h-4 w-4 text-[#E8B978]" />
                Paid trial available
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={waLink("bridal")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackContact("whatsapp_click", "bridal-hero", "bridal")
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white transition hover:bg-[#1DA851] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MessageCircle className="h-5 w-5" />
                Check my date on WhatsApp
              </a>
              <a
                href="#bridal-portfolio"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                See real bridal work
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-9 grid grid-cols-2 gap-3 border-t border-white/15 pt-5 sm:grid-cols-3">
              <a
                href={BRIDAL_TRUST.reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <p className="flex items-center gap-1.5 font-[family-name:var(--font-gelasio)] text-lg text-[#F3D1A6]">
                  <Star className="h-4 w-4 fill-current" />
                  {BRIDAL_TRUST.rating}
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.13em] text-white/45 group-hover:text-white/70">
                  147 WedMeGood reviews
                </p>
              </a>
              <div>
                <p className="font-[family-name:var(--font-gelasio)] text-lg text-[#F3D1A6]">
                  10+
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.13em] text-white/45">
                  Years in Kanpur
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="font-[family-name:var(--font-gelasio)] text-lg text-[#F3D1A6]">
                  Studio · Venue
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.13em] text-white/45">
                  Outstation available
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden lg:relative lg:inset-auto lg:min-h-full">
          <HeroLcpImage
            alt="Kaya Planet bride in a gold wedding look"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(29,15,11,0.25)_0%,rgba(29,15,11,0.88)_62%,rgba(29,15,11,0.98)_100%)] lg:bg-gradient-to-r lg:from-[#1D0F0B]/25 lg:to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 hidden flex-wrap gap-2 sm:left-8 sm:right-8 lg:flex">
            {BRIDAL_SEASONS.map((season) => (
              <div
                key={season.label}
                className="rounded-full border border-white/25 bg-[#1D0F0B]/70 px-4 py-2 text-xs text-white backdrop-blur-md"
              >
                <span className="font-semibold">{season.label}</span>
                <span className="ml-2 text-[#E8B978]">{season.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
