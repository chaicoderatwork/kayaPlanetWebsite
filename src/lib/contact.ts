/**
 * Single source of truth for every "contact us" action on the site.
 *
 * - WhatsApp links always open the front-desk business number with a
 *   pre-filled message, so the reply team knows the function, date and
 *   area before they type a word.
 * - Contact clicks and accepted enquiries are reported separately to
 *   GA4 and the Meta Pixel when installed.
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

export type BridalEnquiryDetails = {
  name?: string;
  mobile?: string;
  eventDate?: string;
  functionName?: string;
  area?: string;
  look?: string;
  packageName?: string;
};

function cleanMessageValue(value?: string): string | undefined {
  const cleaned = value?.replace(/[\r\n]+/g, " ").trim().slice(0, 120);
  return cleaned || undefined;
}

/**
 * Build a bridal WhatsApp link from choices made on the bridal page.
 * Values are kept short and flattened to one line before URL encoding.
 */
export function bridalEnquiryLink(details: BridalEnquiryDetails = {}): string {
  const name = cleanMessageValue(details.name);
  const mobile = cleanMessageValue(details.mobile);
  const eventDate = cleanMessageValue(details.eventDate);
  const functionName = cleanMessageValue(details.functionName);
  const area = cleanMessageValue(details.area);
  const look = cleanMessageValue(details.look);
  const packageName = cleanMessageValue(details.packageName);

  const lines = [
    `Hi Kaya Planet!${name ? ` I’m ${name}.` : ""} I’d like to check ${functionName === "Engagement" ? "engagement" : "bridal"} makeup availability.`,
    `Event date: ${eventDate ?? "___"}`,
    `Function: ${functionName ?? "___"}`,
    `Area / venue: ${area ?? "___"}`,
    mobile ? `Mobile: ${mobile}` : undefined,
    look ? `Look I loved: ${look}` : undefined,
    packageName ? `Package I’m considering: ${packageName}` : undefined,
  ].filter((line): line is string => Boolean(line));

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

type ContactEvent = "whatsapp_click" | "phone_click";

const GTAG_WAIT_MS = 1200;

function waitForGtag(): Promise<((...args: unknown[]) => void) | undefined> {
  if (typeof window === "undefined") return Promise.resolve(undefined);
  if (typeof window.gtag === "function") return Promise.resolve(window.gtag);

  return new Promise((resolve) => {
    const started = Date.now();
    const tick = () => {
      if (typeof window.gtag === "function") {
        resolve(window.gtag);
        return;
      }
      if (Date.now() - started >= GTAG_WAIT_MS) {
        resolve(undefined);
        return;
      }
      window.setTimeout(tick, 40);
    };
    tick();
  });
}

/**
 * Primary conversion: a captured enquiry that continues to WhatsApp.
 * Wait for gtag to flush generate_lead before navigating away.
 * Never pass personal details.
 */
export async function trackEnquiry(
  location: string,
  service: ContactService = "bridal",
): Promise<void> {
  if (typeof window === "undefined") return;

  const params = {
    event_category: "conversion",
    location,
    service,
    page_path: window.location.pathname,
    transport_type: "beacon",
  };

  try {
    window.fbq?.("track", "Lead", {
      content_name: service,
      content_category: "enquiry_submit",
    });
  } catch {
    /* analytics must never interrupt the success message */
  }

  const gtag = await waitForGtag();
  if (!gtag) return;

  await new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    const timer = window.setTimeout(finish, 800);
    gtag("event", "enquiry_submit", params);
    gtag("event", "generate_lead", {
      ...params,
      event_callback: () => {
        window.clearTimeout(timer);
        finish();
      },
    });
  });
}

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
      transport_type: "beacon",
    });
    window.fbq?.("track", "Contact", {
      content_name: service,
      content_category: event,
    });
  } catch {
    /* analytics must never break the click */
  }
}
