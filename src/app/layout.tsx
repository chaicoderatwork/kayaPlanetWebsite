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
  title: {
    default: "Best Bridal Makeup Artist in Kanpur | Kaya Planet Salon & Academy",
    template: "%s | Kaya Planet"
  },
  description: "Looking for the Best Makeup Artist in Kanpur? Kaya Planet offers expert Bridal Makeup, Engagement Looks, and Party Makeup. Top-rated Luxury Salon & Makeup Academy in Govind Nagar.",
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
  alternates: {
    canonical: "https://kayaplanet.com",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://kayaplanet.com",
    siteName: "Kaya Planet Salon & Academy",
    title: "Best Bridal Makeup Artist in Kanpur | Kaya Planet Salon",
    description: "Book the Best Bridal Makeup Artist in Kanpur. We offer HD/Airbrush Makeup, Engagement Looks & Pro Makeup Courses at Kaya Planet Beauty Salon.",
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
    title: "Best Bridal Makeup Artist in Kanpur | Kaya Planet",
    description: "Top-rated Bridal Makeup & Beauty Salon in Kanpur. Book your appointment today!",
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
    "name": "Kaya Planet Salon & Academy",
    "image": "https://kayaplanet.com/kayaplanetlogo.png",
    "url": "https://kayaplanet.com",
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
      "latitude": 26.4499,
      "longitude": 80.3319
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "10:00",
      "closes": "21:00"
    },
    "priceRange": "$$",
    "sameAs": [
      "https://www.instagram.com/kayaplanetbeautysalon/",
      "https://www.facebook.com/kayaplanet/"
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
            "description": "Professional HD and Airbrush Bridal Makeup by expert artists in Kanpur."
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
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who is the best bridal makeup artist in Kanpur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kaya Planet is rated as the best bridal makeup artist in Kanpur, known for flawless HD and Airbrush makeup for weddings and engagements."
          }
        },
        {
          "@type": "Question",
          "name": "Which is the best makeup academy in Kanpur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kaya Planet Academy offers the best professional makeup and hair styling courses in Kanpur with hands-on training and certification."
          }
        },
        {
          "@type": "Question",
          "name": "Where can I get the best engagement makeup in Govind Nagar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kaya Planet Salon in Govind Nagar provides premium engagement and party makeup services using luxury international brands."
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
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <EnquiryPopupProvider>
          <Navbar />
          <EnquiryPopup />
          {children}
          <WhatsAppChatBox />
          <footer>
            <Footer />
          </footer>
        </EnquiryPopupProvider>
        <Analytics />
      </body>
    </html>
  );
}
