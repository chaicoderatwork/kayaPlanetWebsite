import Image from "next/image"
import hero from "./../../public/bg1.jpg"
const HeroSection = () => {
  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      aria-labelledby="hero-heading"
      role="banner"
    >
      <div className="absolute inset-0">
        <Image
          src={hero}
          alt="Salon Academy"
          fill
          priority
          className="object-cover object-right md:object-center"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 lg:px-24">
        <div className="max-w-3xl md:mt-0 mt-[30vw]">
          <h1
            id="hero-heading"
            className="text-5xl font-[family-name:var(--font-stardom)] sm:text-5xl md:text-[10vw] lg:text-[5.3vw] text-white mb-6 leading-tight"
          >
            Beauty
            <br />
            That<br />Turns
            <br />
            Heads
          </h1>
          <div className="lg:w-[80%] md:w-[60%] w-[100%] border-t py-7 border-yellow-400">
            <p className="text-gray-200 font-light poppins text-md md:text-2xl max-w-2xl">
              From glamorous makeup to on-point styling and fabulous hair, our team at Kaya Planet creates looks that
              leave a lasting impression.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

