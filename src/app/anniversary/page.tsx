"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// UPI Configuration
const UPI_ID = "9935295614@pthdfc";
const UPI_NAME = "Kaya Planet";
const AMOUNT = 1000;
const WHATSAPP_NUMBER = "9795133335";

// Offer dates (Feb 7-14, 2026)
const OFFER_START = new Date("2026-02-07T00:00:00+05:30");
const OFFER_END = new Date("2026-02-14T23:59:59+05:30");

interface CountdownTime {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function AnniversaryPage() {
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        address: "",
        birthday: "",
        anniversary: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState<"register" | "lookup" | "payment" | "success" | "already-verified">("register");
    const [error, setError] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [registrationId, setRegistrationId] = useState("");
    const [copied, setCopied] = useState(false);
    const [lookupMobile, setLookupMobile] = useState("");
    const [isLookingUp, setIsLookingUp] = useState(false);
    const [countdown, setCountdown] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [offerStatus, setOfferStatus] = useState<"upcoming" | "active" | "ended">("active");

    // Countdown timer
    useEffect(() => {
        const calculateCountdown = () => {
            const now = new Date();

            if (now < OFFER_START) {
                setOfferStatus("upcoming");
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            if (now > OFFER_END) {
                setOfferStatus("ended");
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            setOfferStatus("active");
            const diff = OFFER_END.getTime() - now.getTime();

            return {
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            };
        };

        setCountdown(calculateCountdown());
        const timer = setInterval(() => {
            setCountdown(calculateCountdown());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Generate UPI deep link for mobile
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${AMOUNT}&cu=INR&tn=${encodeURIComponent(`Membership-${formData.mobile}`)}`;

    // WhatsApp message link
    const whatsappMessage = `Hi! I have completed the payment of ₹1000 for Kaya Planet 10th Anniversary Membership.\n\nMy Details:\nName: ${formData.name}\nMobile: ${formData.mobile}\nRegistration ID: ${registrationId}\n\nPlease find my payment screenshot attached.`;
    const whatsappLink = `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    const copyUpiId = () => {
        navigator.clipboard.writeText(UPI_ID);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Lookup existing registration
    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLookingUp(true);
        setError("");

        try {
            const response = await fetch("/api/anniversary/lookup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile: lookupMobile }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration not found");
            }

            // If already verified, show message
            if (data.registration.verified) {
                setFormData({
                    name: data.registration.name,
                    mobile: data.registration.mobile,
                    email: data.registration.email,
                    address: "",
                    birthday: data.registration.birthday,
                    anniversary: data.registration.anniversary || "",
                });
                setRegistrationId(data.registration.id);
                setStep("already-verified");
                return;
            }

            // Load their data and go to payment
            setFormData({
                name: data.registration.name,
                mobile: data.registration.mobile,
                email: data.registration.email,
                address: "",
                birthday: data.registration.birthday,
                anniversary: data.registration.anniversary || "",
            });
            setRegistrationId(data.registration.id);
            setStep("payment");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLookingUp(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!acceptedTerms) {
            setError("Please accept the terms and conditions");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/anniversary/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            setRegistrationId(data.registrationId);
            setStep("payment");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Countdown Display Component
    const CountdownDisplay = () => (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-4">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
                <span className="font-medium">⏰ Offer ends in:</span>
                <div className="flex gap-2 text-sm sm:text-base">
                    <div className="bg-white/20 rounded px-2 py-1">
                        <span className="font-bold">{countdown.days}</span>d
                    </div>
                    <div className="bg-white/20 rounded px-2 py-1">
                        <span className="font-bold">{countdown.hours}</span>h
                    </div>
                    <div className="bg-white/20 rounded px-2 py-1">
                        <span className="font-bold">{countdown.minutes}</span>m
                    </div>
                    <div className="bg-white/20 rounded px-2 py-1">
                        <span className="font-bold">{countdown.seconds}</span>s
                    </div>
                </div>
            </div>
        </div>
    );

    // Already Verified Screen
    if (step === "already-verified") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center px-4 pt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md text-center"
                >
                    <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                        Already Verified! 🎉
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Hi <strong>{formData.name}</strong>! Your membership has already been verified.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Registration ID: <strong>{registrationId}</strong>
                    </p>
                    <p className="text-gray-600 mb-6">
                        You should have received your membership card details. If not, please contact us on WhatsApp.
                    </p>
                    <div className="flex flex-col gap-3">
                        <a
                            href={`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I need help with my membership. Mobile: ${formData.mobile}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                        >
                            Contact on WhatsApp
                        </a>
                        <Link
                            href="/"
                            className="text-orange-600 font-medium hover:underline"
                        >
                            Back to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Success Screen
    if (step === "success") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center px-4 pt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md text-center"
                >
                    <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                        Thank You! 🎉
                    </h2>
                    <p className="text-gray-600 mb-6">
                        We have received your registration. Our team will verify your payment and share your membership card details within 24 hours.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Registration ID: <strong>{registrationId}</strong>
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    // Offer ended screen
    if (offerStatus === "ended") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center px-4 pt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md text-center"
                >
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">⏰</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                        Offer Ended
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Our 10th Anniversary Membership offer has ended. Thank you for your interest!
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Follow us on social media for future offers.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    // Payment Screen (Step 2)
    if (step === "payment") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
                {offerStatus === "active" && <CountdownDisplay />}
                <div className="py-8 px-4">
                    <div className="max-w-lg mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white text-center">
                                <h1 className="text-2xl font-bold mb-1">Complete Payment</h1>
                                <p className="text-white/90">Step 2 of 2</p>
                            </div>

                            <div className="p-6 md:p-8">
                                {/* Amount Display */}
                                <div className="text-center mb-6">
                                    <p className="text-gray-500 text-sm mb-1">Amount to Pay</p>
                                    <p className="text-4xl font-bold text-orange-600">₹{AMOUNT}</p>
                                </div>

                                {/* Pay Now Button (UPI Deep Link) */}
                                <a
                                    href={upiLink}
                                    className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold text-lg text-center hover:shadow-lg transition-all mb-4"
                                >
                                    📱 Pay Now (Open UPI App)
                                </a>
                                <p className="text-xs text-center text-gray-500 mb-6">
                                    Works on mobile with GPay, PhonePe, Paytm, etc.
                                </p>

                                {/* Divider */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex-1 h-px bg-gray-200" />
                                    <span className="text-gray-400 text-sm">OR</span>
                                    <div className="flex-1 h-px bg-gray-200" />
                                </div>

                                {/* QR Code */}
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl mb-6">
                                    <p className="text-center text-gray-700 font-medium mb-4">Scan QR Code</p>
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-white p-3 rounded-xl shadow-md">
                                            <Image
                                                src="/anniversary/payment-qr.png"
                                                alt="Payment QR Code"
                                                width={180}
                                                height={180}
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* UPI ID with Copy */}
                                    <div className="flex items-center justify-center gap-2 bg-white rounded-lg p-3">
                                        <span className="text-gray-600 text-sm">UPI ID:</span>
                                        <code className="font-mono text-orange-600 font-medium">{UPI_ID}</code>
                                        <button
                                            onClick={copyUpiId}
                                            className="ml-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-md text-sm hover:bg-orange-200 transition-all"
                                        >
                                            {copied ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                    <h3 className="font-semibold text-amber-800 mb-2">📋 After Payment:</h3>
                                    <ol className="text-sm text-amber-700 space-y-2">
                                        <li>1. Take a screenshot of your payment confirmation</li>
                                        <li>2. Click the WhatsApp button below</li>
                                        <li>3. Send the screenshot along with your mobile number</li>
                                    </ol>
                                </div>

                                {/* WhatsApp Button */}
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#128C7E] transition-all mb-4"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Send Screenshot on WhatsApp
                                </a>
                                <p className="text-xs text-center text-gray-500 mb-6">
                                    WhatsApp: {WHATSAPP_NUMBER}
                                </p>

                                {/* Done Button */}
                                <button
                                    onClick={() => setStep("success")}
                                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                                >
                                    I&apos;ve Completed Payment ✓
                                </button>
                            </div>
                        </motion.div>

                        {/* Registration Info */}
                        <div className="mt-6 text-center text-sm text-gray-500">
                            <p>Registered as: <strong className="text-gray-700">{formData.name}</strong></p>
                            <p>Mobile: <strong className="text-gray-700">{formData.mobile}</strong></p>
                            <p className="text-xs mt-2">Registration ID: {registrationId}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Lookup Screen
    if (step === "lookup") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
                {offerStatus === "active" && <CountdownDisplay />}
                <div className="py-12 px-4">
                    <div className="max-w-md mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl shadow-2xl p-8"
                        >
                            <button
                                onClick={() => { setStep("register"); setError(""); }}
                                className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-2"
                            >
                                ← Back to Registration
                            </button>

                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Already Registered?
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Enter your mobile number to continue to payment
                            </p>

                            <form onSubmit={handleLookup} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        pattern="[6-9][0-9]{9}"
                                        value={lookupMobile}
                                        onChange={(e) => setLookupMobile(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-lg"
                                        placeholder="Enter your registered mobile"
                                        maxLength={10}
                                    />
                                </div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm"
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    type="submit"
                                    disabled={isLookingUp}
                                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {isLookingUp ? "Looking up..." : "Continue to Payment →"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    // Registration Form (Step 1)
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
            {/* Countdown Banner */}
            {offerStatus === "active" && <CountdownDisplay />}

            {/* Hero Section */}
            <section className="relative py-12 md:py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-orange-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                            🎊 Celebrating 10 Years 🎊
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
                            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                10th Anniversary
                            </span>
                            <br />
                            Exclusive Membership
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                            Get a <strong>lifetime 10% discount</strong> on all services with our exclusive membership card worth just <strong>₹1,000</strong>
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center text-sm md:text-base">
                            <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                                ✨ Lifetime 10% Off
                            </span>
                            <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                                🎂 Extra 10% on Birthday Month
                            </span>
                            <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                                💝 Extra 10% on Anniversary Month
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8 md:py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        {/* Registration Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl shadow-xl p-6 md:p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Register for Membership
                                </h2>
                            </div>

                            {/* Already Registered Link */}
                            <button
                                onClick={() => { setStep("lookup"); setError(""); }}
                                className="w-full mb-6 py-3 border-2 border-dashed border-orange-200 rounded-xl text-orange-600 font-medium hover:bg-orange-50 transition-all"
                            >
                                Already registered? Click here to complete payment →
                            </button>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mobile Number *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        pattern="[6-9][0-9]{9}"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        placeholder="10-digit mobile number"
                                        maxLength={10}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        placeholder="Your address (optional)"
                                        rows={2}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Birthday *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.birthday}
                                            onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Anniversary
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.anniversary}
                                            onChange={(e) => setFormData({ ...formData, anniversary: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 -mt-2">
                                    * Birthday & Anniversary dates cannot be changed after registration
                                </p>

                                {/* Terms Checkbox */}
                                <div className="flex items-start gap-3 pt-2">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        className="mt-1 w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                    />
                                    <label htmlFor="terms" className="text-sm text-gray-600">
                                        I have read and agree to the <a href="#terms" className="text-orange-600 underline">Terms & Conditions</a>
                                    </label>
                                </div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm"
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Submitting..." : "Proceed to Payment →"}
                                </button>
                            </form>
                        </motion.div>

                        {/* Benefits & Info Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Benefits Card */}
                            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 md:p-8 text-white">
                                <h3 className="text-xl font-bold mb-4">Membership Benefits</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</span>
                                        <span>Lifetime 10% discount on all services</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</span>
                                        <span>Extra 10% off during birthday month</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</span>
                                        <span>Extra 10% off during anniversary month</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</span>
                                        <span>Priority booking & appointments</span>
                                    </li>
                                </ul>
                            </div>

                            {/* How it works */}
                            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">How It Works</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                                        <div>
                                            <p className="font-medium text-gray-800">Fill the form</p>
                                            <p className="text-sm text-gray-500">Enter your details and accept T&C</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                                        <div>
                                            <p className="font-medium text-gray-800">Pay ₹1,000</p>
                                            <p className="text-sm text-gray-500">Pay via UPI app, QR, or UPI ID</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                                        <div>
                                            <p className="font-medium text-gray-800">Send screenshot</p>
                                            <p className="text-sm text-gray-500">WhatsApp payment proof to {WHATSAPP_NUMBER}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold shrink-0">✓</div>
                                        <div>
                                            <p className="font-medium text-gray-800">Get your card!</p>
                                            <p className="text-sm text-gray-500">Receive your membership within 24hrs</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Terms & Conditions */}
            <section id="terms" className="py-12 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                        Terms & Conditions
                    </h2>

                    <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                        <ol className="space-y-4 text-gray-700">
                            <li className="flex gap-3">
                                <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                                <span>This offer is <strong>not valid on any makeup services</strong> - discount applies only to other salon services.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                                <span>The membership card is <strong>non-transferable</strong>.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                                <span>The membership card is <strong>non-redeemable</strong> for cash.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
                                <span>Services can only be availed under the <strong>name of the registered cardholder</strong>.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">5</span>
                                <span><strong>Prior appointment is mandatory</strong> to avail services with this membership.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">6</span>
                                <span><strong>Additional 10% discount</strong> during your birthday and anniversary month (total 20% off!).</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">7</span>
                                <span>Valid only at <strong>Kaya Planet Govind Nagar outlet</strong>.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">8</span>
                                <span>Cannot be combined with other offers or promotions.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">9</span>
                                <span>Management reserves the right to modify these terms.</span>
                            </li>
                        </ol>
                    </div>
                </div>
            </section>

            {/* Footer Message */}
            <section className="py-12 px-4 text-center bg-gradient-to-r from-orange-50 to-amber-50">
                <div className="max-w-2xl mx-auto">
                    <p className="text-gray-600 italic text-lg mb-4">
                        &ldquo;We started with a simple dream to give every woman in Kanpur a truly luxurious and confidence boosting experience. 10 years later, it still feels unreal.&rdquo;
                    </p>
                    <p className="text-gray-800 font-semibold">
                        With love,<br />
                        <span className="text-orange-600">Team Kaya Planet</span>
                    </p>
                </div>
            </section>
        </div>
    );
}
