import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { BRIDAL_PROCESS } from "@/data/bridal";

export default function FounderPromise() {
  return (
    <section
      aria-labelledby="founder-promise-heading"
      className="bg-[#FFFDFC] px-5 py-16 text-[#28170F] sm:px-8 md:py-24 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem_2.5rem_1rem_1rem] bg-[#E7DBCF]">
            <Image
              src="/founder_image.webp"
              alt="Kaya Planet founders Bhawna Vij and Rashika Vij"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A45D2C]">
              Why Bhawna &amp; Rashika
            </p>
            <h2
              id="founder-promise-heading"
              className="mt-3 text-balance font-[family-name:var(--font-gelasio)] text-4xl leading-[1.02] md:text-5xl"
            >
              A named artist. A planned look.
              <span className="block font-normal italic text-[#A45D2C]">
                No last-minute guesswork.
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6B584F] sm:text-base">
              Bhawna brings over a decade of finishing experience and calm
              precision. Rashika brings a modern eye for complexion, colour and
              complete styling. Your available artist and chosen package are
              confirmed before the booking advance.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {BRIDAL_PROCESS.map((item) => (
                <article
                  key={item.step}
                  className="rounded-2xl border border-[#E5D9CE] bg-[#FAF6F2] p-5"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#A45D2C]" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#96715A]">
                      Step {item.step}
                    </p>
                  </div>
                  <h3 className="mt-3 font-[family-name:var(--font-gelasio)] text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#745F54]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
