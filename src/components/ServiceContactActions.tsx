"use client";

import { Phone, MessageCircle } from "lucide-react";
import { PHONE_TEL, trackContact, waLink, type ContactService } from "@/lib/contact";

export default function ServiceContactActions({ service, location }: {
  service: ContactService;
  location: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a href={waLink(service)} target="_blank" rel="noopener noreferrer"
        onClick={() => trackContact("whatsapp_click", location, service)}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#227843] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#195e33]">
        <MessageCircle size={18} aria-hidden="true" /> Check my engagement date
      </a>
      <a href={PHONE_TEL} onClick={() => trackContact("phone_click", location, service)}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-current px-6 py-3 text-sm font-semibold transition hover:opacity-75">
        <Phone size={17} aria-hidden="true" /> Call the salon
      </a>
    </div>
  );
}
