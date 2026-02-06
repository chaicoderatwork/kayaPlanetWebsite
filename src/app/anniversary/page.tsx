"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// UPI Configuration
const UPI_ID = "paytmqr6ezi7g@ptys";
const UPI_NAME = "Kaya Planet";
const AMOUNT = 1000;
const WHATSAPP_NUMBER = "9795133335";

// Offer dates (Feb 7-14, 2026)
const OFFER_START = new Date("2026-02-06T00:00:00+05:30");
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
    const [hasCard, setHasCard] = useState(false);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Scroll to top when step changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);

    // Compress image before upload
    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new globalThis.Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 800;
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;

                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL("image/jpeg", 0.7)); // Compress to 70% quality JPEG
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                if (file.size > 5 * 1024 * 1024) {
                    setError("File size should be less than 5MB");
                    return;
                }
                const compressed = await compressImage(file);
                setUploadPreview(compressed);
                setError("");
            } catch (err) {
                console.error(err);
                setError("Failed to process image");
            }
        }
    };

    const handleUpload = async () => {
        if (!uploadPreview || !registrationId) return;
        setIsUploading(true);
        setError("");

        try {
            const response = await fetch("/api/anniversary/payment-proof", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    registrationId,
                    screenshot: uploadPreview
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to upload screenshot");
            }

            setStep("success");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            setError("Failed to upload. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

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
                setHasCard(data.registration.hasCard || false);
                setStep("already-verified");
                window.scrollTo({ top: 0, behavior: "smooth" });
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
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLookingUp(false);
        }
    };

    // Validate mobile number (10 digits, Indian format)
    const isValidMobile = (mobile: string) => {
        return /^[6-9]\d{9}$/.test(mobile);
    };

    // Validate email format
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate mobile
        if (!isValidMobile(formData.mobile)) {
            setError("Please enter a valid 10-digit mobile number");
            return;
        }

        // Validate email
        if (!isValidEmail(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);

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
            window.scrollTo({ top: 0, behavior: "smooth" });
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

                    {hasCard ? (
                        <p className="text-gray-600 mb-6">
                            ✅ Your membership card has been assigned. Please collect it from our salon or contact us for details.
                        </p>
                    ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                            <p className="text-amber-800">
                                ⏳ Your card number is being assigned. Please contact us on WhatsApp or visit our salon to collect your membership card.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <a
                            href="https://wa.me/+919795133335"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                        >
                            {hasCard ? "Contact on WhatsApp" : "📞 Contact for Card Pickup"}
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
                            <div className=" bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white text-center">
                                <h1 className="text-2xl font-bold mb-1">Complete Payment</h1>
                                <p className="text-white/90">Step 2 of 2</p>
                            </div>

                            <div className="p-6 md:p-8">
                                {/* Amount Display */}
                                <div className="text-center mb-6">
                                    <p className="text-gray-500 text-sm mb-1">Amount to Pay</p>
                                    <p className="text-4xl font-bold text-orange-600">₹{AMOUNT}</p>
                                </div>

                                {/* Terms and Conditions - Must accept before payment */}
                                {!acceptedTerms ? (
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 rounded-xl p-4 max-h-48 overflow-y-auto text-sm text-gray-600">
                                            <h4 className="font-semibold text-gray-800 mb-2">Terms & Conditions</h4>
                                            <ul className="space-y-2 list-disc list-inside">
                                                <li>Membership is valid for 1 year from the date of activation.</li>
                                                <li>Benefits are non-transferable and available only to the registered member.</li>
                                                <li>Discounts cannot be combined with other offers unless specified.</li>
                                                <li>Discount not valid on retail products - discount on retail products is as per salon's discretion.</li>
                                                <li>Payment is non-refundable once the membership is activated.</li>
                                                <li>Kaya Planet reserves the right to modify benefits with prior notice.</li>
                                                <li>Birthday and Anniversary dates cannot be changed after registration.</li>
                                            </ul>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                id="terms-payment"
                                                checked={acceptedTerms}
                                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                                className="mt-1 w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                            />
                                            <label htmlFor="terms-payment" className="text-sm text-gray-700">
                                                I have read and agree to the Terms & Conditions
                                            </label>
                                        </div>
                                        <button
                                            onClick={() => setAcceptedTerms(true)}
                                            disabled={!acceptedTerms}
                                            className="w-full py-3 rounded-xl font-semibold bg-gray-300 text-gray-500 cursor-not-allowed"
                                        >
                                            Accept Terms to Continue
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* UPI App Buttons */}
                                        <p className="text-sm text-gray-600 mb-3 text-center">Tap to Pay via:</p>
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <a
                                                href={`gpay://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${AMOUNT}&cu=INR&tn=${encodeURIComponent(`Membership-${formData.mobile}`)}`}
                                                className="flex flex-col items-center gap-1 p-3 bg-white border-2 border-gray-100 rounded-xl hover:border-blue-400 hover:shadow-md transition-all"
                                            >
                                                {/* GPay Logo SVG */}
                                                <div className="w-10 h-10 flex items-center justify-center">
                                                    <svg viewBox="0 0 24 24" className="w-8 h-8">
                                                        <path fill="#4285F4" d="M23.49 12.275c0-.85-.07-1.68-.21-2.48H12v4.71h6.44c-.28 1.48-1.11 2.73-2.41 3.6l3.9 3.02c2.28-2.1 3.56-5.2 3.56-8.85z" />
                                                        <path fill="#34A853" d="M12 24c3.23 0 5.94-1.07 7.92-2.9l-3.9-3.02c-1.07.72-2.44 1.14-4.02 1.14-3.11 0-5.75-2.1-6.69-4.93H1.27v3.1C3.25 21.32 7.37 24 12 24z" />
                                                        <path fill="#FBBC05" d="M5.31 14.29c-.24-.72-.37-1.49-.37-2.29s.13-1.57.37-2.29V6.61H1.27C.46 8.22 0 10.05 0 12s.46 3.78 1.27 5.39l4.04-3.1z" />
                                                        <path fill="#EA4335" d="M12 4.75c1.76 0 3.33.6 4.58 1.8l3.43-3.43C17.93 1.18 15.22 0 12 0 7.37 0 3.25 2.68 1.27 6.61l4.04 3.1c.94-2.83 3.58-4.93 6.69-4.93z" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs font-medium text-gray-700">GPay</span>
                                            </a>
                                            <a
                                                href={`phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${AMOUNT}&cu=INR&tn=${encodeURIComponent(`Membership-${formData.mobile}`)}`}
                                                className="flex flex-col items-center gap-1 p-3 bg-white border-2 border-gray-100 rounded-xl hover:border-purple-400 hover:shadow-md transition-all"
                                            >
                                                {/* PhonePe Logo SVG */}
                                                <div className="w-10 h-10 flex items-center justify-center bg-[#5f259f] rounded-lg text-white font-bold text-xs p-1">
                                                    PhonePe
                                                </div>
                                                <span className="text-xs font-medium text-gray-700">PhonePe</span>
                                            </a>
                                            <a
                                                href={`paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${AMOUNT}&cu=INR&tn=${encodeURIComponent(`Membership-${formData.mobile}`)}`}
                                                className="flex flex-col items-center gap-1 p-3 bg-white border-2 border-gray-100 rounded-xl hover:border-blue-400 hover:shadow-md transition-all"
                                            >
                                                {/* Paytm Logo SVG */}
                                                <div className="w-10 h-10 flex items-center justify-center">
                                                    <svg viewBox="0 0 100 32" className="w-full h-full"> {/* Simplified Text Logo */}
                                                        <path fill="#002E6E" d="M14.07 27.6h4.51V4.8h-4.51v22.8zm11.23 0h4.5V16.38c0-2.58 1.93-3.1 3.22-3.1 1.77 0 2.9.86 2.9 3.22v11.1h4.51V15.58c0-5.16-3.06-6.6-5.8-6.6-2.58 0-4.35 1.29-4.83 2.74h-.16V9.48H25.3v18.12zm25.93.32c5.64 0 9.18-3.54 9.18-9.18v-9.18h-4.51v8.86c0 3.38-1.93 5.32-4.83 5.32-2.74 0-4.51-1.77-4.51-5.15V9.48h-4.51v9.66c0 5.48 3.54 8.7 9.18 8.78zm16.75-.32h4.51V13.83h3.54V9.63h-3.54V4.8h-4.51v4.83h-2.58v4.2h2.58v13.77zm19.33.32c3.54 0 5.96-1.77 6.92-4.67h-4.67c-.48 1.13-1.13 1.29-2.09 1.29-1.93 0-3.38-1.29-3.38-4.03h10.47c.16-5.8-3.06-9.82-7.57-9.82-5.15 0-7.9 3.86-7.9 9.02 0 4.83 3.06 8.21 8.22 8.21zm3.22-10.47h-5.96c.32-2.09 1.61-3.06 3.06-3.06 1.61 0 2.74.97 2.9 3.06z" />
                                                        <path fill="#00B9F1" d="M6.2 16.54C2.5 16.2.22 14.61.22 10.95c0-3.58 2.66-6.13 6.6-6.13 4.84 0 6.61 2.74 6.77 5.64H9.08c-.16-1.29-.8-2.1-2.42-2.1-1.45 0-2.25.8-2.25 2.1 0 1.29.8 1.93 2.58 2.1l2.42.32c4.03.48 6.44 2.25 6.44 5.96 0 3.86-2.9 6.44-7.09 6.44-5.16 0-7.25-2.74-7.41-6.12h4.51c.16 1.45 1.13 2.42 2.9 2.42 1.45 0 2.58-.97 2.58-2.42 0-1.29-.97-2.1-2.9-2.25l-2.25-.33z" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs font-medium text-gray-700">Paytm</span>
                                            </a>
                                        </div>

                                        {/* Generic UPI fallback */}
                                        <a
                                            href={upiLink}
                                            className="block w-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 py-3 rounded-xl font-semibold text-center hover:shadow-lg transition-all mb-2"
                                        >
                                            📱 Other UPI App
                                        </a>

                                        {/* Divider */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="flex-1 h-px bg-gray-200" />
                                            <span className="text-gray-400 text-sm">Or scan QR</span>
                                            <div className="flex-1 h-px bg-gray-200" />
                                        </div>

                                        {/* QR Code */}
                                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl mb-6">
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

                                        {/* File Upload Section */}
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                            <h3 className="font-semibold text-amber-800 mb-2">📋 Final Step: Upload Proof</h3>
                                            <p className="text-sm text-gray-700 mb-4">
                                                Please upload the payment screenshot to complete your registration.
                                            </p>

                                            <div className="space-y-4">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileSelect}
                                                    className="block w-full text-sm text-gray-500
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-full file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-orange-50 file:text-orange-700
                                                        hover:file:bg-orange-100
                                                    "
                                                />

                                                <p className="text-xs text-amber-700 italic">
                                                    For faster verification, please ensure the screenshot clearly shows the <strong>UTR / Reference Number</strong>.
                                                </p>

                                                {uploadPreview && (
                                                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                        <Image
                                                            src={uploadPreview}
                                                            alt="Preview"
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                )}

                                                {error && (
                                                    <p className="text-sm text-red-600">{error}</p>
                                                )}

                                                <button
                                                    onClick={handleUpload}
                                                    disabled={!uploadPreview || isUploading}
                                                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isUploading ? "Uploading Proof..." : "Submit Registration ✓"}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div >
            </div >
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
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-lg bg-white text-gray-900"
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
                        {/* Benefits & Info Card - Moved above/left of registration form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white text-center">
                                    <h3 className="text-xl font-bold">Why Join?</h3>
                                    <p className="opacity-90">Flat 10% off on all services</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Flat 10% Lifetime Discount</h4>
                                            <p className="text-sm text-gray-600">Save on every visit for a lifetime. No minimum spend required.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Double Discount (20%)</h4>
                                            <p className="text-sm text-gray-600">Get 20% off during your birthday and anniversary months.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Flat 20% on all tich products</h4>
                                            <p className="text-sm text-gray-600">Exclusive discount on our premium tich product range.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* How it works */}
                            <div className="bg-white/80 backdrop-blur rounded-3xl p-6 border border-white/50">
                                <h3 className="font-bold text-gray-800 mb-4">How it works</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm">1</div>
                                        <p className="text-sm text-gray-600">Fill the registration form</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm">2</div>
                                        <p className="text-sm text-gray-600">Pay ₹1,000 one-time fee</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm">3</div>
                                        <p className="text-sm text-gray-600">Get your physical card</p>
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial */}
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-6 border border-orange-100 mt-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex text-orange-400">
                                        {"★★★★★"}
                                    </div>
                                    <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Client Feedback</span>
                                </div>
                                <blockquote className="text-gray-700 italic text-sm leading-relaxed mb-3">
                                    &ldquo;This was the single smartest purchase I did in my lifetime as the breakeven is literally one salon visit. That too at a place you already visit and trust.&rdquo;
                                </blockquote>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center font-bold text-orange-700 text-xs">KP</div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">r</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Registration Form - Now on right side (desktop) or below (mobile) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl shadow-xl p-6 md:p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Register for Membership
                                </h2>
                            </div>

                            {/* Already Registered Link */}
                            {/* Already Registered Link */}
                            {/* <button
                                onClick={() => {
                                    setStep("lookup");
                                    setError("");
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="w-full mb-6 py-3 border-2 border-dashed border-orange-200 rounded-xl text-orange-600 font-medium hover:bg-orange-50 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            >
                                Already registered? Click here to complete payment →
                            </button> */}

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
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-gray-900"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mobile Number *
                                    </label>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        required
                                        pattern="[6-9][0-9]{9}"
                                        value={formData.mobile}
                                        onChange={(e) => {
                                            // Only allow digits
                                            const value = e.target.value.replace(/\D/g, "");
                                            setFormData({ ...formData, mobile: value });
                                        }}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-gray-900"
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
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-gray-900"
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
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-gray-900"
                                        placeholder="Your address (optional)"
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Birthday *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            max={new Date().toISOString().split('T')[0]}
                                            value={formData.birthday}
                                            onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none bg-white text-gray-900"
                                            style={{ minHeight: '48px' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Anniversary (optional)
                                        </label>
                                        <input
                                            type="date"
                                            max={new Date().toISOString().split('T')[0]}
                                            value={formData.anniversary}
                                            onChange={(e) => setFormData({ ...formData, anniversary: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none bg-white text-gray-900"
                                            style={{ minHeight: '48px' }}
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 -mt-2">
                                    * Birthday & Anniversary dates cannot be changed after registration
                                </p>

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
                                    className="w-full py-4 rounded-xl font-semibold text-lg transition-all bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
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
