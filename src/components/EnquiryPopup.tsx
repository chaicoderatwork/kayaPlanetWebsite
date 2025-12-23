"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Phone, User, Sparkles, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEnquiryPopup } from "./EnquiryPopupContext";

const SERVICES = [
    { value: "bridal-makeup", label: "Bridal Makeup" },
    { value: "engagement-makeup", label: "Engagement Makeup" },
    { value: "party-makeup", label: "Party Makeup" },
    { value: "reception-makeup", label: "Reception Makeup" },
    { value: "hair-styling", label: "Hair Styling" },
    { value: "nail-art", label: "Nail Art" },
    { value: "skin-treatment", label: "Skin Treatment" },
    { value: "other", label: "Other" },
];

const STORAGE_KEY = "kp_enquiry_shown";
const POPUP_DELAY = 12000; // 12 seconds

export default function EnquiryPopup() {
    const { isOpen, closeEnquiryPopup, openEnquiryPopup } = useEnquiryPopup();
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        eventDate: "",
        service: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    // Auto-show popup after delay (only once per session)
    useEffect(() => {
        const hasSeenPopup = localStorage.getItem(STORAGE_KEY);

        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                openEnquiryPopup();
            }, POPUP_DELAY);

            return () => clearTimeout(timer);
        }
    }, [openEnquiryPopup]);

    const handleClose = () => {
        closeEnquiryPopup();
        localStorage.setItem(STORAGE_KEY, "true");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.mobile || !formData.service) {
            setError("Please fill all required fields");
            return;
        }

        if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
            setError("Please enter a valid 10-digit mobile number");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsSuccess(true);
                localStorage.setItem(STORAGE_KEY, "true");
                setTimeout(() => {
                    handleClose();
                    setIsSuccess(false);
                    setFormData({ name: "", mobile: "", eventDate: "", service: "" });
                }, 3000);
            } else {
                const data = await response.json();
                setError(data.message || "Something went wrong. Please try again.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute -top-2 -right-2 z-10 p-2 bg-white rounded-full shadow-lg text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        {/* Main Card */}
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#F27708] to-[#F89134] p-6 text-center">
                                <div className="w-14 h-14 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-3">
                                    <Sparkles className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-white text-xl font-semibold">
                                    Book Your Appointment
                                </h3>
                                <p className="text-white/90 text-sm mt-1">
                                    Get a callback from our expert team
                                </p>
                            </div>

                            {/* Form or Success */}
                            <div className="p-6">
                                {isSuccess ? (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-center py-8"
                                    >
                                        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                            <CheckCircle className="w-8 h-8 text-green-500" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                            Thank You! 🎉
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            We&apos;ll call you back shortly to confirm your appointment.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Name */}
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Your Name *"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F27708]/20 focus:border-[#F27708] outline-none transition-all text-sm"
                                                required
                                            />
                                        </div>

                                        {/* Mobile */}
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="mobile"
                                                placeholder="Mobile Number *"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                pattern="[6-9][0-9]{9}"
                                                maxLength={10}
                                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F27708]/20 focus:border-[#F27708] outline-none transition-all text-sm"
                                                required
                                            />
                                        </div>

                                        {/* Event Date */}
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="date"
                                                name="eventDate"
                                                value={formData.eventDate}
                                                onChange={handleChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F27708]/20 focus:border-[#F27708] outline-none transition-all text-sm text-gray-600"
                                            />
                                        </div>

                                        {/* Service Selection */}
                                        <div className="relative">
                                            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <select
                                                name="service"
                                                value={formData.service}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F27708]/20 focus:border-[#F27708] outline-none transition-all text-sm appearance-none bg-white text-gray-600"
                                                required
                                            >
                                                <option value="">Select Service *</option>
                                                {SERVICES.map((service) => (
                                                    <option key={service.value} value={service.value}>
                                                        {service.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Error Message */}
                                        {error && (
                                            <p className="text-red-500 text-sm text-center">{error}</p>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-[#F27708] to-[#F89134] text-white font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                "Get Callback"
                                            )}
                                        </button>

                                        <p className="text-center text-xs text-gray-400">
                                            We respect your privacy. No spam, ever.
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
