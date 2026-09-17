type HeroLcpImageProps = {
  alt: string;
  className?: string;
};

export default function HeroLcpImage({ alt, className }: HeroLcpImageProps) {
  return (
    <picture className="block h-full w-full">
      <source
        media="(max-width: 767px)"
        srcSet="/hero1-mobile.avif"
        type="image/avif"
      />
      <source
        media="(max-width: 767px)"
        srcSet="/hero1-mobile.webp"
        type="image/webp"
      />
      <source
        media="(min-width: 768px)"
        srcSet="/hero1.avif"
        type="image/avif"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero1.webp"
        alt={alt}
        width={1272}
        height={1771}
        fetchPriority="high"
        decoding="async"
        className={className}
      />
    </picture>
  );
}
