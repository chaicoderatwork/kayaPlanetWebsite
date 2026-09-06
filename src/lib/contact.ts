/**
 * Single source of truth for every "contact us" action on the site.
 *
 * - WhatsApp links always open the front-desk business number with a
 *   pre-filled message, so the reply team knows the function, date and
 *   area before they type a word.
 * - Every click is reported to GA4 (and to the Meta Pixel when it is
 *   installed) so ads can be judged on conversations, not impressions.
 */

export const WHATSAPP_NUMBER = "919999424375"; // country code + number, digits only
export const PHONE_TEL = "tel:+919999424375";
export const PHONE_DISPLAY = "+91 99994 24375";

export type ContactService =
  | "bridal"
  | "engagement"
  | "royal-bride"
  | "party"
  | "pre-bridal"
  | "general";

const MESSAGES: Record<ContactService, string> = {
  bridal:
    "Hi Kaya Planet! I want to check a bridal makeup date.\nWedding date: ___\nArea: ___",
  engagement:
    "Hi Kaya Planet! I want to check an engagement makeup date.\nEngagement date: ___\nArea: ___",
  "royal-bride":
    "Hi Kaya Planet! I'm interested in KP Royal Bride.\nWedding date: ___\nArea: ___",
  party:
    "Hi Kaya Planet! I want to book party makeup.\nDate: ___\nNumber of people: ___",
  "pre-bridal":
    "Hi Kaya Planet! I want to know about the pre-bridal package.\nWedding date: ___",
  general:
    "Hi Kaya Planet! I'd like to book.\nFunction: ___\nDate: ___\nArea: ___",
};

/** WhatsApp deep link with the pre-filled message for a service. */
export function waLink(service: ContactService = "general"): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGES[service])}`;
}

type ContactEvent = "whatsapp_click" | "call_click";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Report a contact click to GA4 and (if present) the Meta Pixel.
 * `location` names where on the page the click happened, e.g. "hero",
 * "navbar", "sticky-bar", "float", "footer".
 */
export function trackContact(
  event: ContactEvent,
  location: string,
  service: ContactService = "general",
): void {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, {
      event_category: "contact",
      location,
      service,
      page_path: window.location.pathname,
    });
    window.fbq?.("track", "Contact", {
      content_name: service,
      content_category: event,
    });
  } catch {
    /* analytics must never break the click */
  }
}
