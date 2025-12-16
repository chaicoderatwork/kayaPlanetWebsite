import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "@/components/footer";
import Script from "next/script";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import MysteryBox from "@/components/MysteryBox";

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

import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});


export const metadata: Metadata = {
  title: {
    default: "Kaya Planet | Best Bridal Makeup Artist in Kanpur & Luxury Salon",
    template: "%s | Kaya Planet Salon & Academy"
  },
  description: "Transform your look with Kaya Planet, Kanpur's premier beauty salon and makeup academy. Specializing in bridal makeup, engagement looks, and professional beauty courses. Book your appointment today!",
  keywords: ["Best Makeup Artist in Kanpur", "Bridal Makeup Artist Kanpur", "Engagement Makeup Kanpur", "Salon in Kanpur", "Makeup Academy Kanpur", "Kaya Planet", "Beauty Salon Govind Nagar", "Party Makeup Kanpur", "Hair Styling Kanpur"],
  alternates: {
    canonical: "https://kayaplanet.com",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://kayaplanet.com",
    siteName: "Kaya Planet Salon & Academy",
    title: "Kaya Planet | Best Bridal Makeup Artist & Luxury Salon in Kanpur",
    description: "Expert bridal makeup, hair styling, and beauty academy in Kanpur. Visit Kaya Planet for a transformative beauty experience.",
    images: [
      {
        url: "/hs1.jpg",
        width: 1200,
        height: 630,
        alt: "Kaya Planet Salon Interior and Makeup",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaya Planet | Top Makeup Artist in Kanpur",
    description: "Book the best bridal makeup artist in Kanpur. Luxury salon services and professional academy.",
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
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "10:00",
      "closes": "21:00"
    },
    "priceRange": "$$",
    "sameAs": [
      "https://www.instagram.com/kayaplanetbeautysalon/",
      "https://www.facebook.com/kayaplanet/"
    ]
  };

  return (
    <html lang="en">
      <head>

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${Stardom.variable} ${poppins.variable} antialiased`}
      >
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <MysteryBox />
        {children}
        <StickyMobileCTA />
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
