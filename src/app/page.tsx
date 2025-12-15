import type { Metadata } from "next";
import Hero from "../components/hero";
import WhatsAppChatBox from "../components/whatsapp";
import { About } from "../components/about";
import Services from "../components/services";
import Testicles from "../components/testicles";
import Component from "@/components/whyus";
import Brands from "@/components/brands";
import Testimonials from "@/components/testimonials";
import InstagramC from "@/components/Instagram";

export const generateMetadata = async (): Promise<Metadata> => ({
  title: "Best Beauty Salon in Govind Nagar & Kakadeo, Kanpur | Kaya Planet",
  description:
    "Book luxury hair, skin, makeup and nail services at Kaya Planet Beauty Salon in Govind Nagar, serving Kakadeo and nearby Kanpur areas. Expert stylists for bridal looks, makeovers and grooming.",
  keywords: [
    "beauty salon Govind Nagar",
    "beauty salon Kakadeo",
    "bridal makeup Kanpur",
    "hair salon in Kanpur",
    "luxury salon Govind Nagar",
    "luxury salon Kakadeo",
    "unisex salon Kanpur",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: "Best Beauty Salon in Govind Nagar & Kakadeo, Kanpur | Kaya Planet",
    description:
      "Premium unisex salon in Govind Nagar with easy access for Kakadeo, Kanpur for bridal makeup, hair styling, facials and nail art with experienced artists.",
  },
  twitter: {
    title: "Best Beauty Salon in Govind Nagar & Kakadeo, Kanpur | Kaya Planet",
    description:
      "Schedule luxury salon services in Govind Nagar serving Kakadeo, Kanpur for hair, makeup, nails and skincare by expert artists at Kaya Planet.",
  },
});

export default function Home() {
  return (
    <div className="flex flex-col overflow-x-hidden items-center justify-start font-[family-name:var(--font-geist-sans)] bg-[#FDFBF9] text-[#111111]">
      <WhatsAppChatBox />
      <Hero />


      <About />


      <Services />
      <InstagramC />
      <Component />


      <Brands />

      {/* <Deals /> */}
      <Testimonials/>
      {/* <VideoPage /> */}
      <Testicles />
    </div>
  );
}