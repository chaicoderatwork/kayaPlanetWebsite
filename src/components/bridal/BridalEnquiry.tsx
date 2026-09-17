"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ArrowUpRight, Loader2, MessageCircle, Phone } from "lucide-react";
import {
  bridalEnquiryLink,
  PHONE_DISPLAY,
  PHONE_TEL,
  trackContact,
  trackEnquiry,
  waLink,
} from "@/lib/contact";
import { notifyDateCheckEmail } from "@/lib/web3forms-client";

const FUNCTIONS = ["Wedding", "Engagement", "Reception", "Other"];

export default function BridalEnquiry({
  trackingLocation = "home-date-check",
}: {
  trackingLocation?: string;
}) {
  const [eventDate, setEventDate] = useState("");
  const [functionName, setFunctionName] = useState("Wedding");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const contactService = functionName === "Engagement" ? "engagement" : "bridal";
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());

  const formattedDate = useMemo(() => {
    if (!eventDate) return "";
    return new Date(`${eventDate}T00:00:00`).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [eventDate]);

  const whatsappUrl = useMemo(
    () =>
      bridalEnquiryLink({
        eventDate: formattedDate,
        functionName,
      }),
    [formattedDate, functionName],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!eventDate) {
      setError("Please choose your event date.");
      return;
    }

    setIsSubmitting(true);
    trackEnquiry(trackingLocation, contactService);

    notifyDateCheckEmail({
      eventDate,
      functionName,
      source: trackingLocation,
    });

    void fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventDate,
        service: `${contactService}-makeup`,
        functionName,
        source: trackingLocation,
      }),
    }).catch(() => {
      /* WhatsApp still opens; save must never block the bride */
    });

    window.location.assign(whatsappUrl);
  };

  return (
    <section
      id="bridal-enquiry"
      aria-labelledby="bridal-enquiry-heading"
      className="relative w-full scroll-mt-24 overflow-hidden bg-[#1E0F0B] px-5 py-16 text-white sm:px-8 md:py-24 lg:px-12"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(184,104,47,0.25),transparent_32%)]"
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E3AD70]">
              Optional date check
            </p>
            <h2
              id="bridal-enquiry-heading"
              className="mt-3 text-balance font-[family-name:var(--font-gelasio)] text-4xl leading-[1.02] md:text-5xl"
            >
              Already have a
              <span className="block font-normal italic text-[#E3AD70]">
                wedding date?
              </span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/60 sm:text-base">
              Add it here and WhatsApp opens with the date filled in. Or skip
              the form and message us now.
            </p>
            <a
              href={waLink("bridal")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackContact("whatsapp_click", `${trackingLocation}-skip`, contactService)
              }
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-[#10251A] transition hover:bg-[#1DA851]"
            >
              <MessageCircle className="h-5 w-5" />
              Message on WhatsApp
            </a>
            <div className="mt-7 border-t border-white/15 pt-5">
              <a
                href={PHONE_TEL}
                onClick={() =>
                  trackContact("call_click", trackingLocation, "bridal")
                }
                className="inline-flex items-center gap-2 text-sm text-white/75 transition hover:text-white"
              >
                <Phone className="h-4 w-4 text-[#E3AD70]" />
                {PHONE_DISPLAY}
              </a>
              <p className="mt-2 text-xs text-white/40">
                Open daily, 10:00 AM–8:30 PM · Govind Nagar
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/15 bg-white/[0.055] p-5 backdrop-blur-sm sm:p-7"
          >
            <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#DAB080]">
                  Event date
                </span>
                <input
                  required
                  type="date"
                  min={today}
                  value={eventDate}
                  onChange={(event) => setEventDate(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/15 px-4 py-3 text-sm text-white outline-none [color-scheme:dark] transition focus:border-[#DDA565] focus:ring-2 focus:ring-[#DDA565]/20"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#DAB080]">
                  Function
                </span>
                <select
                  value={functionName}
                  onChange={(event) => setFunctionName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-[#21120E] px-4 py-3 text-sm text-white outline-none transition focus:border-[#DDA565] focus:ring-2 focus:ring-[#DDA565]/20"
                >
                  {FUNCTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {error ? (
              <p role="alert" className="mt-5 text-center text-sm text-[#F3B4A2]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-[#10251A] transition hover:bg-[#1DA851] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Opening WhatsApp...
                </>
              ) : (
                <>
                  Send date on WhatsApp
                  <ArrowUpRight className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="mt-3 text-center text-[10px] leading-5 text-white/35">
              Opens WhatsApp with your date. No name or number needed.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
