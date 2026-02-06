"use client"

import Link from "next/link";
import HeroSlider from "../components/HeroSlider";
import WhatsAppChatBox from "../components/whatsapp";
// Code splitting below-the-fold components
import dynamic from "next/dynamic";

const AboutFounders = dynamic(() => import("@/components/AboutFounders"), {
  ssr: false,
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
  ssr: false,
  loading: () => <div className="h-[300px] bg-[#FDFBF9] w-full animate-pulse" />,
});
const FAQ = dynamic(() => import("@/components/FAQ"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-[#FDFBF9] w-full animate-pulse" />,
});
const InfluencerSection = dynamic(() => import("@/components/InfluencerSection"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-white w-full animate-pulse" />,
});

export default function Home() {
  return (
    <main className="flex flex-col overflow-x-hidden items-center justify-start font-[family-name:var(--font-geist-sans)] bg-[#FDFBF9] text-[#111111]">
      <WhatsAppChatBox />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Anniversary Promo Section */}
      <div className="w-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 py-4 px-4 shadow-lg text-white">
        <Link href="/anniversary" className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-center group cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="animate-bounce">👑</span>
            <span className="font-bold text-lg md:text-xl tracking-wide">
              10th Anniversary Exclusive Membership is Live!
            </span>
          </div>
          <span className="hidden md:block w-px h-6 bg-white/30"></span>
          <div className="flex items-center gap-2 text-sm md:text-base bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full group-hover:bg-white group-hover:text-orange-600 transition-all duration-300 font-semibold">
            Get Lifetime Discounts Now
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      </div>

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