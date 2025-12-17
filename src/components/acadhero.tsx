import Image from "next/image"
import hero from "./../../public/bg2.jpg"
const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
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
          <h1 className="text-5xl font-[family-name:var(--font-gelasio)] sm:text-5xl md:text-[10vw] lg:text-[5.3vw] text-white mb-6 leading-tight">
            Master
            <br />Skills,
            <br />Build
            <br />
            Careers
          </h1>
          <div className="lg:w-[80%] md:w-[60%] w-[100%] border-t py-7 border-yellow-400">
            <p className="text-gray-200 font-light poppins text-md md:text-2xl max-w-2xl">
              Learn everything from stunning makeup to perfect styling and amazing hair techniques at Kaya Planet Academy. Create looks that truly stand out!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

