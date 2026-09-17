import Image from "next/image";
import Link from "next/link";
import ServiceContactActions from "@/components/ServiceContactActions";
import { BUSINESS_ID, GOOGLE_MAPS_URL, canonicalUrl, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/engagement",
  title: "Engagement Makeup in Kanpur",
  description: "Plan your engagement makeup at Kaya Planet in Govind Nagar, Kanpur. Explore our work, discuss your look and ask for artist availability and a personalised quote.",
  image: "/gallery/bride_saumya_1.webp",
});

const faqs = [
  {
    question: "How much does engagement makeup cost at Kaya Planet?",
    answer: "Ask the salon for an engagement quote with your date, preferred artist and getting-ready location. Confirm makeup, hairstyling, draping, accessories and any travel charges in the written quote before booking.",
  },
  {
    question: "Can I request Bhawna or Rashika for my engagement makeup?",
    answer: "Yes, you can request your preferred artist when enquiring. The salon will confirm the artist’s availability and package for your date before you book.",
  },
  {
    question: "What should I share when checking my date?",
    answer: "Send your engagement date, ready-by time, getting-ready location, outfit photo and a few makeup references. Mention any skin sensitivities and whether other family members also need appointments.",
  },
  {
    question: "Where is Kaya Planet in Kanpur?",
    answer: "Kaya Planet is at 125/53-B, opposite Viva Natraj, Lal Quarter, Govind Nagar, Kanpur, Uttar Pradesh 208006. The salon is open daily from 10 am to 8:30 pm. Call ahead to confirm your appointment.",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${canonicalUrl("/engagement")}#service`,
      name: "Engagement Makeup in Kanpur",
      serviceType: "Engagement makeup",
      url: canonicalUrl("/engagement"),
      areaServed: { "@type": "City", name: "Kanpur" },
      provider: { "@id": BUSINESS_ID },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl() },
        { "@type": "ListItem", position: 2, name: "Engagement Makeup", item: canonicalUrl("/engagement") },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(({ question, answer }) => ({
        "@type": "Question", name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function EngagementPage() {
  return (
    <main className="bg-[#FBF7F1] text-[#25211D]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className="bg-[#211C19] px-5 pb-16 pt-28 text-[#FBF7F1] sm:px-8 lg:pb-20 lg:pt-36">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 lg:gap-20">
          <div>
            <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[#CFC2B6]">
              <Link href="/" className="underline underline-offset-4">Home</Link> / Engagement makeup
            </nav>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#E3BFA1]">Kaya Planet · Govind Nagar</p>
            <h1 className="font-[family-name:var(--font-gelasio)] text-4xl leading-tight sm:text-5xl lg:text-6xl">Engagement makeup<br />in Kanpur</h1>
            <p className="mb-7 mt-6 max-w-xl text-base leading-7 text-[#E0D6CD]">A look that works with your outfit, your ceremony and the way you want to feel. Share your references with Kaya Planet and plan your engagement appointment at our Govind Nagar salon.</p>
            <ServiceContactActions service="engagement" location="engagement-hero" />
            <p className="mt-4 text-xs leading-5 text-[#CFC2B6]">Artist availability and pricing are confirmed by the salon before booking.</p>
          </div>
          <figure>
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-t-[10rem]">
              <Image src="/gallery/bride_saumya_1.webp" alt="Makeup and hairstyling from the Kaya Planet bridal portfolio" fill priority sizes="(max-width: 767px) 90vw, 450px" className="object-cover" />
            </div>
            <figcaption className="mt-3 text-center text-xs text-[#CFC2B6]">From our bridal portfolio · <Link href="/gallery" className="underline underline-offset-4">Explore the gallery</Link></figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <p className="text-xs uppercase tracking-[0.18em] text-[#805634]">Start with your look</p>
        <h2 className="mt-3 font-[family-name:var(--font-gelasio)] text-3xl sm:text-4xl">Make room for your own style</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            ["Soft and understated", "Bring references for lighter-looking skin, softly defined eyes and a lip colour that complements your outfit."],
            ["Defined evening makeup", "If your ring ceremony is in the evening, share the venue lighting and the eye or lip emphasis you have in mind."],
            ["Coordinated hair and draping", "Share your neckline, jewellery and dupatta so the team can discuss styling. Ask which elements are included in your quote."],
          ].map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-[#DDD1C5] p-6">
              <h3 className="font-[family-name:var(--font-gelasio)] text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#65594F]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#DDD1C5] bg-[#F2EADF]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:py-20">
          <div>
            <h2 className="font-[family-name:var(--font-gelasio)] text-3xl sm:text-4xl">Plan your appointment</h2>
            <ol className="mt-6 list-decimal space-y-4 pl-5 text-sm leading-7 text-[#65594F]">
              <li>Send your event date, ready-by time and getting-ready location.</li>
              <li>Share your outfit and look references, plus your preferred artist.</li>
              <li>Confirm the quote, inclusions, appointment time and booking terms with the salon.</li>
            </ol>
          </div>
          <div className="rounded-2xl bg-[#FBF7F1] p-7">
            <h3 className="font-[family-name:var(--font-gelasio)] text-2xl">Planning your wedding makeup too?</h3>
            <p className="my-4 text-sm leading-7 text-[#65594F]">Our bridal page compares packages from ₹14,000 and shows work by Bhawna and Rashika. Engagement pricing is quoted separately for your requirements.</p>
            <Link href="/" className="text-sm font-semibold underline underline-offset-4">See bridal makeup on the homepage →</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 lg:py-20">
        <h2 className="mb-7 font-[family-name:var(--font-gelasio)] text-3xl sm:text-4xl">Before your engagement appointment</h2>
        {faqs.map(({ question, answer }) => (
          <details key={question} className="border-b border-[#DDD1C5] py-5">
            <summary className="cursor-pointer pr-4 font-medium">{question}</summary>
            <p className="mt-3 text-sm leading-7 text-[#65594F]">{answer}</p>
          </details>
        ))}
      </section>

      <section className="bg-[#E9DBCA] px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-gelasio)] text-3xl sm:text-4xl">Visit Kaya Planet in Govind Nagar</h2>
          <p className="mb-2 mt-5 max-w-2xl text-sm leading-7">125/53-B, opposite Viva Natraj, Lal Quarter, Govind Nagar, Kanpur, Uttar Pradesh 208006.</p>
          <p className="mb-6 text-sm">Open daily, 10 am–8:30 pm · <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Get directions</a></p>
          <ServiceContactActions service="engagement" location="engagement-location" />
        </div>
      </section>
    </main>
  );
}
