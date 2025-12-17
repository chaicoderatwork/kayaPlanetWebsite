import { Instagram, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import kp from '../../public/kayaplanetlogo.png'

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-300 py-10 w-full">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo - Left aligned */}
          <div className="flex flex-col items-start">
            <Link href="/" className="inline-block">
              <Image
                src={kp}
                alt="Kaya Planet"
                width={70}
                height={70}
              />
            </Link>
            <h3 className="font-[family-name:var(--font-stardom)] text-xl mb-4 text-[#F27708]">
              Kaya Planet
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Rating as the <strong>Best Makeup Artist in Kanpur</strong>. We specialize in luxury bridal makeovers, engagement looks, and professional academy courses.
            </p>
          </div>

          {/* Contact - Left aligned */}
          <div className="flex flex-col items-start space-y-2">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Contact</h3>
            <a href="tel:+919999424375" className="flex items-center gap-2 text-sm hover:text-[#F27708] transition-colors">
              <Phone size={14} />
              +91 99994 24375
            </a>
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={14} className="mt-0.5 flex-shrink-0" />
              <span>125/53-B, Govind Nagar, Kanpur</span>
            </div>
          </div>

          {/* Social - Left aligned */}
          <div className="flex flex-col items-start space-y-2">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Follow Us</h3>
            <Link
              href="https://www.instagram.com/kayaplanetbeautysalon/"
              target="_blank"
              className="flex items-center gap-2 text-sm hover:text-[#F27708] transition-colors"
            >
              <Instagram size={16} />
              @kayaplanetbeautysalon
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-4">
          <p className="text-[10px] text-gray-500">
            © {new Date().getFullYear()} Kaya Planet Salon & Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}