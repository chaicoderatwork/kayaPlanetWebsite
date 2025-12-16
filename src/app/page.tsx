"use client"

import HeroSlider from "../components/HeroSlider";
import WhatsAppChatBox from "../components/whatsapp";
// Code splitting below-the-fold components
import dynamic from "next/dynamic";

const AboutFounders = dynamic(() => import("@/components/AboutFounders"), {
  loading: () => <div className="h-[400px] bg-white w-full animate-pulse" />,
});
const ReelSlider = dynamic(() => import("@/components/ReelSlider"), {
  loading: () => <div className="h-[400px] bg-white w-full animate-pulse" />,
});
const SalonInterior = dynamic(() => import("@/components/SalonInterior"), {
  loading: () => <div className="h-[400px] bg-[#FDFBF9] w-full animate-pulse" />,
});
const ServicesSlider = dynamic(() => import("@/components/ServicesSlider"), {
  loading: () => <div className="h-[400px] bg-[#111111] w-full animate-pulse" />,
});
const Testimonials = dynamic(() => import("@/components/testimonials"), {
  loading: () => <div className="h-[300px] bg-[#FDFBF9] w-full animate-pulse" />,
});

export default function Home() {
  return (
    <div className="flex flex-col overflow-x-hidden items-center justify-start font-[family-name:var(--font-geist-sans)] bg-[#FDFBF9] text-[#111111]">
      <WhatsAppChatBox />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Reel Slider */}
      <ReelSlider />

      {/* Salon Interior */}
      <SalonInterior />

      {/* About Founders */}
      <AboutFounders />

      {/* Services */}
      <ServicesSlider />

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
}