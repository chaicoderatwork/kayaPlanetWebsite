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

      {/* Anniversary Dedication Letter Section */}
      <section className="w-full py-16 md:py-24 px-4 bg-[#FDFBF9]">
        <div className="max-w-3xl mx-auto bg-[#F8F5F2] p-8 md:p-12 rounded-sm shadow-sm border border-[#E8E4DF] relative">
          {/* Paper Texture Effect */}
          <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

          <div className="relative z-10 text-center space-y-6 md:space-y-8">
            {/* Logo / Header */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-stardom)] text-gray-800">
                KAYA PLANET
              </h2>
              <div className="w-16 h-px bg-orange-300 mx-auto mt-4"></div>
            </div>

            {/* Letter Body */}
            <div className="font-[family-name:var(--font-gelasio)] text-gray-700 leading-relaxed space-y-6 text-justify md:text-center text-sm md:text-base">
              <p>
                <span className="text-3xl float-left mr-2 font-[family-name:var(--font-stardom)] text-orange-600">W</span>
                e started with a simple dream to give every woman in Kanpur a truly luxurious and soothing experience.
              </p>
              <p>
                On 14th of Feb as we complete <span className="text-orange-600 italic font-medium">10 beautiful years</span>, it still feels unreal. What began as a women-only space has now grown into a premium unisex salon, and we are happy to share that our homegrown brand <span className="font-bold text-orange-800">tich</span> is now serving more than <span className="font-semibold">5k+ customers</span> every month. None of this would have been possible without <em>you</em> who stayed with us through the journey.
              </p>
              <p>
                This gift box is our small way of saying thank you for being a part of our story. Your loyalty has helped us grow, your feedback has made us better, and your love has kept us going, especially on the hard days. We truly don't take it for granted.
              </p>
              <p>
                To celebrate our anniversary with you, we would also love to give you a <span className="font-bold text-gray-900">lifetime 10% discount on all services</span> when you purchase our membership card just at Rs. 1000 (Terms & Conditions apply).
              </p>
              <p className="italic text-gray-600 mt-8">
                From the bottom of our hearts, thank you for trusting us for 10 years. Here's to many more smiles, transformations, and moments together.
              </p>
            </div>

            {/* Signature */}
            <div className="mt-12 pt-8">
              <p className="font-[family-name:var(--font-stardom)] text-4xl text-orange-400 mb-2">Thank You</p>
              <p className="font-[family-name:var(--font-gelasio)] text-gray-600 italic">for being a part of our story..</p>

              <div className="mt-6 text-gray-800 font-medium">
                <p>With love,</p>
                <p className="text-lg">Team Kaya Planet</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <Link
                href="/anniversary"
                className="inline-block bg-[#111] text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors duration-300 tracking-wider text-sm font-medium uppercase"
              >
                Join the Celebration
              </Link>
            </div>
          </div>
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