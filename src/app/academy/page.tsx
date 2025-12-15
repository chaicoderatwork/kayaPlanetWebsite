import type { Metadata } from "next";
import WhatsAppChatBox from "@/components/whatsapp";
// import Testicles from "@/components/testicles";
import HeroSection from "@/components/acadhero";
import AboutUs from "@/components/academy/about-us";
import PosterGrid from "@/components/posterGrid";
import Strip from "@/components/horizontal-strip";
import StudentShowcase from "@/components/sw";
import Component from "@/components/form";
import Acadtestimonials from "@/components/acadtestimonials";
//import Poster from "@/components/poster";

export const generateMetadata = async (): Promise<Metadata> => ({
  title: "Beauty Academy in Govind Nagar & Kakadeo, Kanpur | Kaya Planet Courses",
  description:
    "Enroll in Kaya Planet Beauty Academy in Govind Nagar with easy access for Kakadeo, Kanpur for professional hair, makeup, skin and nail courses with certification and hands-on training.",
  keywords: [
    "beauty academy Kanpur",
    "makeup course Govind Nagar",
    "makeup course Kakadeo",
    "hair stylist training Kanpur",
    "beauty classes Kanpur",
    "nail art course Govind Nagar",
    "nail art course Kakadeo",
  ],
  alternates: {
    canonical: "/academy",
  },
  openGraph: {
    url: "/academy",
    title: "Beauty Academy in Govind Nagar & Kakadeo, Kanpur | Kaya Planet Courses",
    description:
      "Professional beauty academy in Govind Nagar serving Kakadeo, Kanpur providing bridal makeup, hair, skin and nail certification programs with expert trainers.",
  },
  twitter: {
    title: "Beauty Academy in Govind Nagar & Kakadeo, Kanpur | Kaya Planet Courses",
    description:
      "Join Kaya Planet Academy in Govind Nagar, also serving Kakadeo, Kanpur for certified beauty courses in hair, makeup, skincare and nail artistry.",
  },
});

export default function Home() {
  return (
    <div className="flex overflow-x-hidden flex-col items-center justify-start font-[family-name:var(--font-geist-sans)] bg-[#FDFBF9] text-[#111111]">
      <WhatsAppChatBox />
      <HeroSection />
      <Strip/>
      <AboutUs />
      <PosterGrid/>
      <Component />
      {/* <Poster/> */}
      {/* <Courses /> */}
      <StudentShowcase/>
      <Acadtestimonials/>
    </div>
  );
}