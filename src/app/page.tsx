"use client"

import HeroSlider from "../components/HeroSlider";
<<<<<<< Updated upstream
=======
import BridalSeasonStrip from "../components/BridalSeasonStrip";
>>>>>>> Stashed changes
// Code splitting below-the-fold components
import dynamic from "next/dynamic";

const AboutFounders = dynamic(() => import("@/components/AboutFounders"), {
  loading: () => <div className="h-[400px] bg-white w-full animate-pulse" />,
});
const ReelSlider = dynamic(() => import("@/components/ReelSlider"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-white w-full animate-pulse" />,
});
const GalleryShowcase = dynamic(() => import("@/components/GalleryShowcase"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-[#FDFBF9] w-full animate-pulse" />,
});
const SalonInterior = dynamic(() => import("@/components/SalonInterior"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-[#FDFBF9] w-full animate-pulse" />,
});
const ServicesSlider = dynamic(() => import("@/components/ServicesSlider"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-[#111111] w-full animate-pulse" />,
});
const Testimonials = dynamic(() => import("@/components/testimonials"), {
  loading: () => <div className="h-[300px] bg-[#FDFBF9] w-full animate-pulse" />,
});
const FAQ = dynamic(() => import("@/components/FAQ"), {
  loading: () => <div className="h-[300px] bg-[#FDFBF9] w-full animate-pulse" />,
});
const InfluencerSection = dynamic(() => import("@/components/InfluencerSection"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-white w-full animate-pulse" />,
});

export default function Home() {
  return (
    <main className="flex flex-col overflow-x-hidden items-center justify-start font-[family-name:var(--font-geist-sans)] bg-[#FDFBF9] text-[#111111]">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Bridal season: product, price anchor, dates, WhatsApp */}
      <BridalSeasonStrip />

      {/* Reel Slider - Our Work */}
      <ReelSlider />

      {/* Influencer Trust Section */}
      <InfluencerSection />

      {/* Gallery Showcase */}
      <GalleryShowcase />

      {/* Services */}
      <ServicesSlider />

      {/* Salon Interior */}
      <SalonInterior />

      {/* About Founders */}
      <AboutFounders />

      {/* FAQ - SEO Content */}
      <FAQ />

      {/* Testimonials */}

      <Testimonials />
    </main>
  );
}