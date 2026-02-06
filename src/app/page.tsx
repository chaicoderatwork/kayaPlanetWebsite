"use client"

import Link from "next/link";
import Image from "next/image";
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

      {/* Anniversary Dedication Letter Section */}
      <section className="w-full py-12 md:py-20 px-4 bg-[#FDFBF9]">
        <div className="max-w-2xl mx-auto">
          <Link href="/anniversary" className="block group">
            <Image
              src="/anniversary/letter.png"
              alt="A letter from Team Kaya Planet celebrating 10 years"
              width={800}
              height={1130}
              className="w-full h-auto rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
              priority
            />
            <div className="text-center mt-6">
              <span className="inline-block bg-[#111] text-white px-8 py-3 rounded-full group-hover:bg-orange-600 transition-colors duration-300 tracking-wider text-sm font-medium uppercase">
                Join the Celebration
              </span>
            </div>
          </Link>
        </div>
      </section>

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