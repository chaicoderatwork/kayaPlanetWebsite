import HeroSlider from "../components/HeroSlider";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/",
  title: "Makeup Artist & Salon in Kanpur",
  description:
    "Bridal makeup at Kaya Planet in Govind Nagar, Kanpur. Bridal packages from ₹14,000. Explore work by Bhawna and Rashika and check your date.",
});
// Code splitting below-the-fold components
import dynamic from "next/dynamic";

const AboutFounders = dynamic(() => import("@/components/AboutFounders"), {
  loading: () => <div className="h-[400px] bg-white w-full animate-pulse" />,
});
const ReelSlider = dynamic(() => import("@/components/ReelSlider"), {
  loading: () => <div className="h-[400px] bg-white w-full animate-pulse" />,
});
const GalleryShowcase = dynamic(() => import("@/components/GalleryShowcase"), {
  loading: () => <div className="h-[400px] bg-[#FDFBF9] w-full animate-pulse" />,
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
const BridalEnquiry = dynamic(() => import("@/components/bridal/BridalEnquiry"), {
  loading: () => <div className="h-[400px] bg-[#1E0F0B] w-full animate-pulse" />,
});
const FAQ = dynamic(() => import("@/components/FAQ"), {
  loading: () => <div className="h-[300px] bg-[#FDFBF9] w-full animate-pulse" />,
});
const InfluencerSection = dynamic(() => import("@/components/InfluencerSection"), {
  loading: () => <div className="h-[300px] bg-white w-full animate-pulse" />,
});

export default function Home() {
  return (
    <main className="flex flex-col overflow-x-hidden items-center justify-start font-[family-name:var(--font-geist-sans)] bg-[#FDFBF9] text-[#111111]">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Portfolio reels directly below the hero */}
      <ReelSlider />

      {/* Sourced review proof followed by the bridal gallery */}
      <Testimonials />
      <GalleryShowcase />
      <InfluencerSection />

      {/* Place, then the date check — once a bride can picture herself here */}
      <SalonInterior />
      <BridalEnquiry />

      {/* Services */}
      <ServicesSlider />

      {/* About Founders */}
      <AboutFounders />

      {/* FAQ - SEO Content */}
      <FAQ />
    </main>
  );
}
