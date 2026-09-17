import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "@/components/footer";
import Script from "next/script";
import WhatsAppChatBox from "@/components/whatsapp";
import EnquiryPopup from "@/components/EnquiryPopup";
import { EnquiryPopupProvider } from "@/components/EnquiryPopupContext";
import { Analytics } from "@vercel/analytics/next";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import MetaPixel from "@/components/MetaPixel";
import { BUSINESS_ID, SITE_URL } from "@/lib/seo";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const Stardom = localFont({
  src: "./fonts/Stardom-Regular.woff",
  variable: "--font-stardom",
  weight: "100 900",
});

import { Poppins, Gelasio } from "next/font/google";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const gelasio = Gelasio({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gelasio",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    url: SITE_URL,
    siteName: "Kaya Planet Salon & Academy",
    title: "Kaya Planet Salon & Academy | Luxury Beauty in Kanpur",
    description: "Discover bridal artistry, hair, skin, nails, engagement looks and professional makeup courses at Kaya Planet in Govind Nagar, Kanpur.",
    images: [
      {
        url: "/hs1.jpg",
        width: 1200,
        height: 630,
        alt: "Best Bridal Makeup Artist in Kanpur - Kaya Planet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaya Planet Salon & Academy | Kanpur",
    description: "Luxury bridal artistry, salon services and professional makeup courses in Kanpur.",
    images: ["/hs1.jpg"],
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
    "url": SITE_URL,
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${Stardom.variable} ${poppins.variable} ${gelasio.variable} antialiased font-[family-name:var(--font-gelasio)]`}
      >
        <script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <EnquiryPopupProvider>
          <Navbar />
          {/* <EnquiryPopup /> */}
          {children}
          <WhatsAppChatBox />
          <StickyMobileCTA />
          <footer className="pb-20 md:pb-0">
            <Footer />
          </footer>
        </EnquiryPopupProvider>
        <MetaPixel />
        <Analytics />
      </body>
    </html>
  );
}
