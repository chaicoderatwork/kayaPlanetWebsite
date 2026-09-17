"use client";

import { CalendarDays, MessageCircle } from "lucide-react";
import { BRIDAL_SEASONS } from "@/data/bridal";
import { waLink, trackContact } from "@/lib/contact";

export default function BridalSeasonStrip() {
  return (
    <section
      id="bridal"
      aria-label="Current bridal booking availability"
      className="w-full bg-[#F7F0E8] px-5 py-12 sm:px-8 md:py-16 lg:px-12"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex max-w-3xl items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#E8D4C0] text-[#8B4D27]">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A592D]">
              Bridal dates 2026–27
            </p>
            <p className="mt-1 font-[family-name:var(--font-gelasio)] text-2xl text-[#28170F] sm:text-3xl">
              Check your wedding date before choosing a package.
            </p>
            <p className="mt-4 text-sm leading-7 text-[#6B584F] sm:text-base">
              Shortlisting a bridal artist should feel clear. Here is what you
              need to know before starting a conversation with Kaya Planet.
            </p>
            <p className="mt-3 text-sm leading-7 text-[#6B584F] sm:text-base">
              Natural, long-lasting bridal looks planned around your features,
              outfit and wedding schedule. Bridal packages start at
              ₹14,000.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid flex-1 gap-2 sm:grid-cols-2">
            {BRIDAL_SEASONS.map((season) => (
              <div
                key={season.label}
                className="rounded-xl border border-[#DFCBB9] bg-white/75 px-4 py-3"
              >
                <p className="text-sm font-semibold text-[#2C1A13]">
                  {season.label}
                </p>
                <p className="mt-0.5 text-xs text-[#9A592D]">{season.status}</p>
              </div>
            ))}
          </div>

          <a
            href={waLink("bridal")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackContact(
                "whatsapp_click",
                "home-bridal-availability",
                "bridal",
              )
            }
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white transition hover:bg-[#1DA851] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7D431F]"
          >
            <MessageCircle className="h-5 w-5" />
            Check my date on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
