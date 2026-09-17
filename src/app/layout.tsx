import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "@/components/footer";
import WhatsAppChatBox from "@/components/whatsapp";
import { EnquiryPopupProvider } from "@/components/EnquiryPopupContext";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import MetaPixel from "@/components/MetaPixel";
import SiteAnalytics from "@/components/SiteAnalytics";
import { BUSINESS_ID, SITE_URL, canonicalUrl } from "@/lib/seo";
import { Poppins, Gelasio } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  preload: false,
});

const gelasio = Gelasio({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gelasio",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: canonicalUrl(),
  },
  verification: {
    google: "Pid-L7klulPZY8LgoDimtiRPmyWR-i-27WndJ63rk6Y",
  },
  title: {
    default: "Luxury Salon & Makeup Academy in Kanpur | Kaya Planet",
    template: "%s | Kaya Planet"
  },
  description: "Kaya Planet is a luxury salon and makeup academy in Govind Nagar, Kanpur, offering bridal and engagement makeup, hair, skin, nails, and professional beauty courses.",
  keywords: [
    "Best Bridal Makeup Artist in Kanpur",
    "Top Makeup Academy in Kanpur",
    "Engagement Makeup Kanpur",
    "Best Salon in Kanpur",
    "Luxury Salon Govind Nagar",
    "Best Makeup Artist Kanpur",
    "Airbrush Bridal Makeup Kanpur",
    "HD Makeup Artist Kanpur",
    "Professional Makeup Courses Kanpur"
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: canonicalUrl(),
    siteName: "Kaya Planet Salon & Academy",
    title: "Kaya Planet Salon & Academy | Luxury Beauty in Kanpur",
    description: "Discover bridal artistry, hair, skin, nails, engagement looks and professional makeup courses at Kaya Planet in Govind Nagar, Kanpur.",
    images: [
      {
        url: "/hero1.webp",
        width: 1272,
        height: 1771,
        alt: "Best Bridal Makeup Artist in Kanpur - Kaya Planet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaya Planet Salon & Academy | Kanpur",
    description: "Luxury bridal artistry, salon services and professional makeup courses in Kanpur.",
    images: ["/hero1.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": BUSINESS_ID,
    "name": "Kaya Planet Salon & Academy",
    "image": `${SITE_URL}/kayaplanetlogo.png`,
    "url": canonicalUrl(),
    "telephone": "+919999424375",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "125/53-B, opp. Viva Natraj, Lal Quarter, Govind Nagar",
      "addressLocality": "Kanpur",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "208006",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.4496,
      "longitude": 80.2988
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "10:00",
      "closes": "20:30"
    },
    "priceRange": "₹₹₹",
    "sameAs": [
      "https://www.instagram.com/kayaplanetbeautysalon/",
      "https://www.facebook.com/kayaplanetbeauty/"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Salon Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Bridal Makeup",
            "description": "Bridal makeup by Bhawna Vij & Rashika Vij in Kanpur: MAC, HD, Signature/Airbrush, Royal Signature and KP's Royal Bride."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Engagement Makeup",
            "description": "HD and Airbrush engagement makeup in Kanpur."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pre-Bridal Package",
            "description": "Skin and hair care sessions before the wedding."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Makeup Academy Courses",
            "description": "Professional makeup and hair styling certification courses."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Party Makeup",
            "description": "Glamorous party makeup for engagements, receptions, and special occasions."
          }
        }
      ]
    }
  };

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${gelasio.variable} antialiased font-[family-name:var(--font-poppins)]`}
      >
        <script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <EnquiryPopupProvider>
          <Navbar />
          {children}
          <WhatsAppChatBox />
          <StickyMobileCTA />
          <footer className="pb-20 md:pb-0">
            <Footer />
          </footer>
        </EnquiryPopupProvider>
        <MetaPixel />
        <SiteAnalytics />
      </body>
    </html>
  );
}
