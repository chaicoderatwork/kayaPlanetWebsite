import type { Metadata } from "next";

// Match the host used by the production redirect and keep every page self-canonical.
export const SITE_URL = "https://www.kayaplanet.com";
export const BUSINESS_ID = `${SITE_URL}/#salon`;
export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps?q=Kaya+Planet+Salon+125/53-B+Govind+Nagar+Kanpur";

export function canonicalUrl(path = "/"): string {
  const url = new URL(path, `${SITE_URL}/`);
  if (url.pathname === "/") return SITE_URL;
  return `${SITE_URL}${url.pathname.replace(/\/$/, "")}`;
}

export function pageMetadata({
  path,
  title,
  description,
  image = "/hero1.webp",
  titleSuffix = "Kaya Planet Beauty Salon",
}: {
  path: string;
  title: string;
  description: string;
  image?: string;
  titleSuffix?: string;
}): Metadata {
  const fullTitle = `${title} | ${titleSuffix}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: canonicalUrl(path) },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "Kaya Planet Salon & Academy",
      url: canonicalUrl(path),
      title: fullTitle,
      description,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
