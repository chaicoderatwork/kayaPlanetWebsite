import type { Metadata } from "next";
import BridalHero from "@/components/bridal/BridalHero";
import LookAtelier from "@/components/bridal/LookAtelier";
import PackageExplorer from "@/components/bridal/PackageExplorer";
import FounderPromise from "@/components/bridal/FounderPromise";
import BrideDiaries from "@/components/bridal/BrideDiaries";
import BridalFAQ from "@/components/bridal/BridalFAQ";
import BridalEnquiry from "@/components/bridal/BridalEnquiry";
import { BRIDAL_FAQS, BRIDAL_PACKAGES } from "@/data/bridal";
import { BUSINESS_ID, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Bridal Makeup Artist in Kanpur | Prices & Real Brides",
  description:
    "Compare Kaya Planet bridal makeup by Bhawna and Rashika in Kanpur. See real brides, packages from ₹14,000, inclusions, trials, venue travel and check your date on WhatsApp.",
  keywords: [
    "bridal makeup artist Kanpur",
    "bridal makeup price Kanpur",
    "Bhawna Vij bridal makeup",
    "Rashika Vij bridal makeup",
    "airbrush bridal makeup Kanpur",
    "bridal makeup packages Kanpur",
  ],
  alternates: {
    canonical: canonicalUrl("/bridal"),
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: canonicalUrl("/bridal"),
    siteName: "Kaya Planet Salon & Academy",
    title: "Bridal Makeup in Kanpur by Bhawna & Rashika",
    description:
      "Real bridal work, clear packages from ₹14,000 and a direct WhatsApp date check.",
    images: [
      {
        url: "/hero1.webp",
        width: 1200,
        height: 1800,
        alt: "Kaya Planet bridal makeup in Kanpur",
      },
    ],
  },
};

const bridalSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: canonicalUrl(),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Bridal Makeup",
          item: canonicalUrl("/bridal"),
        },
      ],
    },
    {
      "@type": "Service",
      name: "Bridal Makeup by Bhawna & Rashika",
      serviceType:
        "Bridal makeup, hairstyling, draping and pre-bridal consultation",
      url: canonicalUrl("/bridal"),
      description:
        "Founder-led bridal makeup packages in Kanpur with paid trials, venue bookings and outstation availability.",
      areaServed: ["Kanpur", "Uttar Pradesh", "India"],
      provider: {
        "@type": "BeautySalon",
        "@id": BUSINESS_ID,
        name: "Kaya Planet Salon & Academy",
        url: canonicalUrl(),
        telephone: "+919999424375",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "125/53-B, opp. Viva Natraj, Lal Quarter, Govind Nagar",
          addressLocality: "Kanpur",
          addressRegion: "Uttar Pradesh",
          postalCode: "208006",
          addressCountry: "IN",
        },
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Bridal makeup packages",
        itemListElement: BRIDAL_PACKAGES.map((bridalPackage) => ({
          "@type": "Offer",
          priceCurrency: "INR",
          price: bridalPackage.startingPrice,
          itemOffered: {
            "@type": "Service",
            name: bridalPackage.name,
            description: bridalPackage.idealFor,
          },
        })),
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: BRIDAL_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function BridalPage() {
  return (
    <main className="w-full overflow-x-hidden bg-[#FBF7F1]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bridalSchema) }}
      />
      <BridalHero />
      <LookAtelier />
      <PackageExplorer />
      <FounderPromise />
      <BrideDiaries />
      <BridalFAQ />
      <BridalEnquiry trackingLocation="bridal-page-date-check" />
    </main>
  );
}
