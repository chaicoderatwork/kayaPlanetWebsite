"use client"

import { Instagram, Phone, MapPin, MessageCircle } from "lucide-react"
import Link from "next/link"
import { waLink, PHONE_TEL, PHONE_DISPLAY, trackContact } from "@/lib/contact"
import Image from "next/image"
import kp from '../../public/kayaplanetlogo.png'
import { GOOGLE_MAPS_URL } from '@/lib/seo'

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-300 py-10 w-full">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Brand - Left aligned */}
          <div className="flex flex-col items-start">
            <Link href="/" className="inline-block mb-3">
              <Image
                src={kp}
                alt="Kaya Planet"
                width={60}
                height={60}
              />
            </Link>
            <Image
              src="/kp-logo-white.png"
              alt="Kaya Planet"
              width={120}
              height={28}
              className="mb-4 h-7 w-auto object-contain"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Kaya Planet is a salon and makeup academy in Govind Nagar, Kanpur, offering bridal makeup, engagement looks, hair, skin and nail services.
            </p>
          </div>

          {/* Contact - Left aligned */}
          <div className="flex flex-col items-start space-y-2">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Contact</h3>
            <a href={PHONE_TEL} onClick={() => trackContact("phone_click", "footer")} className="flex items-center gap-2 text-sm hover:text-[#F27708] transition-colors">
              <Phone size={14} />
              {PHONE_DISPLAY}
            </a>
            <a href={waLink("general")} target="_blank" rel="noopener noreferrer" onClick={() => trackContact("whatsapp_click", "footer")} className="flex items-center gap-2 text-sm hover:text-[#25D366] transition-colors">
              <MessageCircle size={14} />
              WhatsApp us
            </a>
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={14} className="mt-0.5 flex-shrink-0" />
              <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#F27708]">125/53-B, opp. Viva Natraj, Lal Quarter, Govind Nagar, Kanpur, Uttar Pradesh 208006</a>
            </div>
            <p className="text-sm">Open daily: 10 am–8:30 pm</p>
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
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider pt-4">Explore</h3>
            <Link href="/#bridal-enquiry" className="text-sm hover:text-[#F27708]">Bridal makeup in Kanpur</Link>
            <Link href="/gallery" className="text-sm hover:text-[#F27708]">Makeup gallery</Link>
            <Link href="/academy" className="text-sm hover:text-[#F27708]">Makeup academy</Link>
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
