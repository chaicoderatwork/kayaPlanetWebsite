import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "@/components/footer";

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


export const metadata: Metadata = {
  metadataBase: new URL("https://kayaplanet.com"),
  title: {
    default: "Kaya Planet Beauty Salon & Academy | Govind Nagar & Kakadeo, Kanpur",
    template: "%s | Kaya Planet Beauty Salon & Academy",
  },
  description:
    "Luxury unisex beauty salon and professional training academy in Govind Nagar serving Kakadeo and nearby Kanpur neighborhoods with expert hair, makeup, skin and nail services.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Kaya Planet Beauty Salon & Academy | Govind Nagar & Kakadeo, Kanpur",
    description:
      "Premium salon services and advanced beauty academy courses in Govind Nagar with easy access for Kakadeo, Kanpur for bridal makeup, hair styling, skin care, and nail artistry.",
    images: [
      {
        url: "/bg1.jpg",
        width: 1200,
        height: 630,
        alt: "Kaya Planet Beauty Salon & Academy in Kanpur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaya Planet Beauty Salon & Academy | Govind Nagar & Kakadeo, Kanpur",
    description:
      "Explore Kaya Planet's luxury salon services and beauty academy training in Govind Nagar and Kakadeo, Kanpur for hair, makeup, skin and nail excellence.",
    images: ["/bg1.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BeautySalon",
              name: "Kaya Planet Beauty Salon & Academy",
              image: "https://kayaplanet.com/bg1.jpg",
              url: "https://kayaplanet.com/",
              telephone: "+91-93052-92186",
              priceRange: "₹₹",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Govind Nagar",
                addressLocality: "Kanpur",
                addressRegion: "Uttar Pradesh",
                postalCode: "208025",
                addressCountry: "IN",
              },
              areaServed: ["Govind Nagar", "Kakadeo", "Kanpur"],
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "10:00",
                  closes: "20:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Sunday",
                  opens: "10:00",
                  closes: "18:00",
                },
              ],
              sameAs: [
                "https://www.facebook.com/kayaplanetsalon",
                "https://www.instagram.com/kayaplanet_kanpur/",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-93052-92186",
                contactType: "customer service",
                areaServed: "Kanpur",
                availableLanguage: ["English", "Hindi"],
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${Stardom.variable} antialiased`}
      >
        <Navbar />
        {children}
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
