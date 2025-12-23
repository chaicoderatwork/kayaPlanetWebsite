"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
    {
        question: "How do I book the Best Makeup Artist in Kanpur?",
        answer: "Booking the best makeup artist in Kanpur is easy! You can call us at +91-9999424375 or book a pre-wedding trial at our Govind Nagar salon to finalize your look."
    },
    {
        question: "What is the price of a Makeup Artist in Kanpur?",
        answer: "Prices for a professional makeup artist in Kanpur vary, but at Kaya Planet, our HD and Airbrush bridal packages start from ₹15,000, ensuring luxury quality at best rates."
    },
    {
        question: "Do you provide Makeup Academy courses?",
        answer: "Yes, we are a leading Makeup Academy in Kanpur offering basic to advanced professional makeup and hair styling courses with certification and hands-on practice."
    },
    {
        question: "Which makeup brands do you use?",
        answer: "We use only premium international luxury brands including MAC, Huda Beauty, NARS, Charlotte Tilbury, and Shopaarel to ensure a flawless, long-lasting finish."
    },
    {
        question: "Can I book a pre-wedding trial?",
        answer: "Absolutely! We highly recommend a paid trial session so you can experience our quality and finalize your dream wedding look before the big day."
    },
    {
        question: "Do you travel to venues for makeup?",
        answer: "Yes, our team is available for venue bookings in Kanpur and outstation weddings. Travel and accommodation charges apply for outstation venues."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-16 bg-[#FDFBF9] relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F27708]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <span className="text-xs font-semibold text-[#F27708] uppercase tracking-wider">
                        Common Questions
                    </span>
                    <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-gelasio)] mt-2 text-[#111111]">
                        Everything You Need to Know
                    </h2>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {FAQS.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50"
                            >
                                <span className="font-semibold text-gray-900 pr-4">
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-[#F27708]" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="px-5 pb-5 pt-0 text-gray-600 border-t border-gray-50 mt-1">
                                    <div className="pt-3 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
