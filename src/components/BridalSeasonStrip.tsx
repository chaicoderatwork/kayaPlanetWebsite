"use client";

import { MessageCircle, Phone } from "lucide-react";
import { waLink, PHONE_TEL, trackContact } from "@/lib/contact";

/**
 * The first thing a bride sees under the hero: the real product, the real
 * price anchor, and the two seasons she is choosing between.
 * Edit SEASON when the diary changes; set OFFER to a string to show an
 * early-bird line (e.g. "Book a Nov–Dec date by 10 Oct: pre-wedding trial on us").
 */
const SEASON = [
  { label: "Nov – Dec 2026", status: "a few dates left" },
  { label: "15 Jan – 14 Mar 2027", status: "booking now" },
];
const OFFER: string | null = null;

const TIERS = [
  { name: "MAC", price: "₹20,000" },
  { name: "HD", price: "₹24,000" },
  { name: "Signature / Airbrush", price: "₹28,000" },
  { name: "Royal Signature", price: "₹32,000" },
  { name: "KP's Royal Bride", price: "₹42,000" },
];

export default function BridalSeasonStrip() {
  return (
    <section
      id="bridal"
      aria-labelledby="bridal-heading"
      className="w-full bg-[#FDFBF9] px-4 py-12 md:py-16"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#F27708]">
          Wedding season 2026–27
        </p>
        <h2
          id="bridal-heading"
          className="mt-2 text-3xl md:text-5xl font-[family-name:var(--font-gelasio)] text-[#111111]"
        >
          Bridal by Bhawna &amp; Rashika, from ₹20,000
        </h2>
        <p className="mt-3 max-w-2xl text-gray-600 md:text-lg">
          Makeup, advance hairstyling, draping, lashes and lenses by the founders themselves.
          Senior-artist bridal from ₹16,000 · Engagement from ₹10,000 · Pre-bridal package from ₹12,000.
        </p>

        {/* Tiers */}
        <ul className="mt-6 flex flex-wrap gap-2">
          {TIERS.map((t) => (
            <li
              key={t.name}
              className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-800"
            >
              <span className="font-medium">{t.name}</span>{" "}
              <span className="text-gray-500">{t.price}</span>
            </li>
          ))}
        </ul>

        {/* Season / dates */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {SEASON.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between rounded-xl border border-orange-100 bg-white px-5 py-4 shadow-sm"
            >
              <span className="font-semibold text-[#111111]">{s.label}</span>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#F27708]">
                {s.status}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          We take a limited number of brides on each date, so your date is confirmed only once the advance is paid.
          {OFFER ? ` ${OFFER}.` : ""}
        </p>

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={waLink("bridal")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContact("whatsapp_click", "season-strip", "bridal")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3 font-medium text-white transition-colors hover:bg-[#1DA851]"
          >
            <MessageCircle className="h-5 w-5" />
            Check my date on WhatsApp
          </a>
          <a
            href={PHONE_TEL}
            onClick={() => trackContact("call_click", "season-strip")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3 font-medium text-[#111111] transition-colors hover:border-[#F27708] hover:text-[#F27708]"
          >
            <Phone className="h-5 w-5" />
            Call +91 99994 24375
          </a>
        </div>

        {/* Trust row */}
        <p className="mt-6 text-sm text-gray-500">
          10+ years in Govind Nagar · 660+ Google reviews · WedMeGood Best MUA Kanpur · MAC, Huda Beauty, NARS, Charlotte Tilbury
        </p>
      </div>
    </section>
  );
}
