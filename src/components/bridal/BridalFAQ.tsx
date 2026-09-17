import { BRIDAL_FAQS } from "@/data/bridal";

export default function BridalFAQ() {
  return (
    <section
      id="bridal-faq"
      aria-labelledby="bridal-faq-heading"
      className="bg-[#F8F1E8] px-5 py-16 sm:px-8 md:py-24 lg:px-12"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A45D2C]">
            Before you enquire
          </p>
          <h2
            id="bridal-faq-heading"
            className="mt-3 text-balance font-[family-name:var(--font-gelasio)] text-4xl leading-[1.02] text-[#24130E] md:text-5xl"
          >
            Practical answers,
            <span className="block font-normal italic text-[#A45D2C]">
              clearly stated.
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#67554E] sm:text-base">
            Trial, travel, timing and booking details to help you compare
            artists before sending your wedding date.
          </p>
        </div>
        <div className="divide-y divide-[#DCC9BA] border-y border-[#DCC9BA]">
          {BRIDAL_FAQS.map((faq, index) => (
            <details key={faq.question} className="group py-1" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 font-[family-name:var(--font-gelasio)] text-xl text-[#321B14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A86732] sm:text-2xl">
                {faq.question}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#CCAE94] text-base text-[#8F592F] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-7 pr-10 text-sm leading-7 text-[#6E5A51] sm:text-base">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
