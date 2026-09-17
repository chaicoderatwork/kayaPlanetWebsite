"use client";

import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import {
  BRIDAL_CORE_INCLUSIONS,
  BRIDAL_PACKAGES,
} from "@/data/bridal";
import { bridalEnquiryLink, trackContact } from "@/lib/contact";

export default function PackageExplorer() {
  return (
    <section
      id="bridal-packages"
      aria-labelledby="bridal-packages-heading"
      className="bg-[#F0E3D5] px-5 py-16 text-[#28170F] sm:px-8 md:py-24 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#985528]">
              Bridal prices
            </p>
            <h2
              id="bridal-packages-heading"
              className="mt-3 text-balance font-[family-name:var(--font-gelasio)] text-4xl leading-[1.02] md:text-5xl"
            >
              Five clear starting points.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#6C584D] sm:text-base">
              Every founder-led package includes the essentials below. The
              finish, products and added details determine the tier.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {BRIDAL_CORE_INCLUSIONS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-[#49362C]"
                >
                  <Check className="h-4 w-4 text-[#9B592D]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-5 text-[#7A675D]">
              Prices are per bridal function and start at the amount shown.
              Venue, outstation, family and timing requirements are confirmed
              in your written quote.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#D4BDA8] bg-[#F8F1E9]">
            {BRIDAL_PACKAGES.map((bridalPackage, index) => (
              <article
                key={bridalPackage.id}
                className={`grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7 ${
                  index > 0 ? "border-t border-[#D9C6B5]" : ""
                } ${
                  bridalPackage.featured
                    ? "bg-[#2A1711] text-white"
                    : "text-[#28170F]"
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-[family-name:var(--font-gelasio)] text-2xl">
                      {bridalPackage.name}
                    </h3>
                    {bridalPackage.featured && (
                      <span className="rounded-full bg-[#E8B978]/15 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#F2CC99]">
                        Most complete
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-2 text-sm leading-6 ${
                      bridalPackage.featured
                        ? "text-white/62"
                        : "text-[#705D53]"
                    }`}
                  >
                    {bridalPackage.idealFor}
                  </p>
                  {bridalPackage.inclusions.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                      {bridalPackage.inclusions.map((item) => (
                        <li
                          key={item}
                          className={`flex items-center gap-1.5 text-xs ${
                            bridalPackage.featured
                              ? "text-white/70"
                              : "text-[#614D43]"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5 text-[#B96D37]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="sm:text-right">
                  <p
                    className={`text-[9px] font-semibold uppercase tracking-[0.16em] ${
                      bridalPackage.featured
                        ? "text-[#E4B477]"
                        : "text-[#9A5A30]"
                    }`}
                  >
                    Starting at
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-gelasio)] text-2xl">
                    {bridalPackage.priceLabel}
                  </p>
                  <a
                    href={bridalEnquiryLink({
                      packageName: bridalPackage.name,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackContact(
                        "whatsapp_click",
                        `bridal-package-${bridalPackage.id}`,
                        "bridal",
                      )
                    }
                    className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold underline underline-offset-4 ${
                      bridalPackage.featured
                        ? "text-[#F1C58C]"
                        : "text-[#78421F]"
                    }`}
                  >
                    Ask about this package
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-white/60 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <p className="font-[family-name:var(--font-gelasio)] text-xl">
              Not sure which finish is right for you?
            </p>
            <p className="mt-1 text-sm text-[#725F54]">
              Send your date, venue and outfit. The team will recommend a
              sensible starting point.
            </p>
          </div>
          <a
            href={bridalEnquiryLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackContact("whatsapp_click", "bridal-packages-help", "bridal")
            }
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white transition hover:bg-[#1DA851]"
          >
            <MessageCircle className="h-4 w-4" />
            Check my date on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
