import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BRIDAL_LOOKS } from "@/data/bridal";

const PORTFOLIO_ITEMS = BRIDAL_LOOKS.flatMap((look) =>
  look.frames.slice(0, 2).map((image, index) => ({
    id: `${look.id}-${index}`,
    image,
    title: look.title,
    category: look.category,
    event: look.event,
    artist: look.artist,
  })),
);

export default function LookAtelier() {
  return (
    <section
      id="bridal-portfolio"
      aria-labelledby="bridal-portfolio-heading"
      className="bg-[#FBF7F1] px-5 py-16 text-[#25150F] sm:px-8 md:py-24 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A45D2C]">
              Real bridal work
            </p>
            <h2
              id="bridal-portfolio-heading"
              className="mt-3 max-w-3xl text-balance font-[family-name:var(--font-gelasio)] text-4xl leading-[1.02] md:text-5xl"
            >
              Choose an artist by the work,
              <span className="block font-normal italic text-[#A45D2C]">
                not by a promise.
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6D5A50] sm:text-base">
              A concise edit of natural, traditional and modern looks created
              for real Kaya Planet brides and celebrations.
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#77421F] underline decoration-[#C89567] underline-offset-8"
          >
            View the full gallery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {PORTFOLIO_ITEMS.map((item, index) => (
            <figure
              key={item.id}
              className={`group ${
                index === 0 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <div
                className={`relative overflow-hidden rounded-2xl bg-[#E7DBCF] ${
                  index === 0
                    ? "aspect-[5/4] md:aspect-[4/5]"
                    : "aspect-[4/5]"
                }`}
              >
                <Image
                  src={item.image}
                  alt={`${item.category} ${item.event.toLowerCase()} look by Kaya Planet`}
                  fill
                  className="object-cover object-top transition duration-500 group-hover:scale-[1.025]"
                  sizes={
                    index === 0
                      ? "(max-width: 768px) 100vw, 33vw"
                      : "(max-width: 768px) 50vw, 33vw"
                  }
                />
              </div>
              <figcaption className="px-1 pt-3">
                <p className="font-[family-name:var(--font-gelasio)] text-base sm:text-lg">
                  {item.category}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#826B5E]">
                  {item.event} · {item.artist}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
