"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Registration {
    id: string;
    name: string;
    mobile: string;
    email: string;
    address: string;
    birthday: string;
    anniversary: string;
    verified: boolean;
    cardNumber: string | null;
    createdAt: string;
    verifiedAt: string | null;
    paymentScreenshot?: string;
}

interface Stats {
    total: number;
    pending: number;
    verified: number;
}

export default function AnniversaryAdminPage() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, verified: 0 });
    const [filter, setFilter] = useState<"all" | "pending" | "verified">("all");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedUser, setSelectedUser] = useState<Registration | null>(null);
    const [cardInput, setCardInput] = useState("");
    const [updating, setUpdating] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedUser || fullscreenImage) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [selectedUser, fullscreenImage]);

    const fetchRegistrations = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/anniversary/registrations?filter=${filter}`,
                {
                    headers: { "x-admin-password": password },
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    setIsAuthenticated(false);
                    setError("Session expired. Please login again.");
                    return;
                }
                throw new Error("Failed to fetch registrations");
            }

            const data = await response.json();
            setRegistrations(data.registrations);
            setStats(data.stats);
        } catch {
            setError("Failed to load registrations");
        } finally {
            setLoading(false);
        }
    }, [filter, password]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchRegistrations();
        }
    }, [isAuthenticated, filter, fetchRegistrations]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/anniversary/registrations", {
                headers: { "x-admin-password": password },
            });

            if (response.ok) {
                setIsAuthenticated(true);
                const data = await response.json();
                setRegistrations(data.registrations);
                setStats(data.stats);
            } else {
                setError("Invalid password");
            }
        } catch {
            setError("Failed to authenticate");
        } finally {
            setLoading(false);
        }
    };

    const toggleVerification = async (verified: boolean) => {
        if (!selectedUser) return;
        setUpdating(true);
        try {
            const response = await fetch("/api/anniversary/verify", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-password": password,
                },
                body: JSON.stringify({
                    registrationId: selectedUser.id,
                    verified,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSelectedUser(data.registration);
                fetchRegistrations();
            }
        } catch {
            setError("Failed to update verification status");
        } finally {
            setUpdating(false);
        }
    };

    const updateCardNumber = async () => {
        if (!selectedUser) return;

        // Validate 16 digits
        if (cardInput && !/^\d{16}$/.test(cardInput)) {
            setError("Card number must be exactly 16 digits");
            return;
        }

        setUpdating(true);
        setError("");
        try {
            const response = await fetch("/api/anniversary/verify", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-password": password,
                },
                body: JSON.stringify({
                    registrationId: selectedUser.id,
                    cardNumber: cardInput || null,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSelectedUser(data.registration);
                fetchRegistrations();
            }
        } catch {
            setError("Failed to update card number");
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const openUserModal = (reg: Registration) => {
        setSelectedUser(reg);
        setCardInput(reg.cardNumber || "");
        setError("");
    };

    const closeModal = () => {
        setSelectedUser(null);
        setCardInput("");
        setError("");
    };

    // Format card number with spaces for display
    const formatCardNumber = (card: string) => {
        return card.replace(/(\d{4})/g, "$1 ").trim();
    };

    // Export to CSV for Excel
    const exportToCSV = () => {
        const headers = [
            "Registration ID",
            "Name",
            "Mobile",
            "Email",
            "Address",
            "Birthday",
            "Anniversary",
            "Card Number",
            "Status",
            "Registered At",
            "Verified At"
        ];

        const rows = registrations.map(reg => [
            reg.id,
            reg.name,
            reg.mobile,
            reg.email,
            reg.address || "",
            reg.birthday,
            reg.anniversary || "",
            reg.cardNumber || "",
            reg.verified ? "Verified" : "Pending",
            reg.createdAt,
            reg.verifiedAt || ""
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `anniversary-registrations-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
    };

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 pt-20">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">🎊 Anniversary Admin</h1>
                        <p className="text-gray-500 mt-2">Membership Registration Management</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Admin Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Enter admin password"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? "Authenticating..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Admin Dashboard
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">🎊 Anniversary Membership Admin</h1>
                        <p className="text-sm text-gray-500">Manage registrations & verify payments</p>
                    </div>
                    <button
                        onClick={() => {
                            setIsAuthenticated(false);
                            setPassword("");
                        }}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                        <p className="text-sm text-gray-500">Total Registrations</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-3xl font-bold text-amber-500">{stats.pending}</p>
                        <p className="text-sm text-gray-500">Pending Verification</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-3xl font-bold text-green-500">{stats.verified}</p>
                        <p className="text-sm text-gray-500">Verified</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-4">
                    {(["all", "pending", "verified"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                                ? "bg-orange-500 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                    <button
                        onClick={exportToCSV}
                        className="ml-auto px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                    >
                        📥 Export CSV
                    </button>
                    <button
                        onClick={fetchRegistrations}
                        className="px-4 py-2 bg-white rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                    >
                        🔄 Refresh
                    </button>
                </div>

                {/* Registrations Grid */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : registrations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No registrations found</div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {registrations.map((reg) => (
                                <button
                                    key={reg.id}
                                    onClick={() => openUserModal(reg)}
                                    className="text-left p-4 border border-gray-100 rounded-xl hover:border-orange-300 hover:shadow-md transition-all bg-white"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-800">{reg.name}</p>
                                            <p className="text-sm text-gray-500">{reg.mobile}</p>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${reg.verified
                                                ? "bg-green-100 text-green-700"
                                                : "bg-amber-100 text-amber-700"
                                                }`}
                                        >
                                            {reg.verified ? "✓ Verified" : "Pending"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        {formatDateTime(reg.createdAt)}
                                    </p>
                                    {reg.cardNumber && (
                                        <p className="text-xs text-orange-600 mt-1 font-mono">
                                            Card: {formatCardNumber(reg.cardNumber)}
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* User Detail Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold">{selectedUser.name}</h2>
                                    <button onClick={closeModal} className="text-white/80 hover:text-white">
                                        ✕
                                    </button>
                                </div>
                                <p className="text-sm text-white/80">{selectedUser.id}</p>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-4">
                                {/* Contact Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-500">📞</span>
                                        <a href={`tel:+91${selectedUser.mobile}`} className="text-orange-600 hover:underline">
                                            {selectedUser.mobile}
                                        </a>
                                        <a
                                            href={`https://wa.me/91${selectedUser.mobile}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 text-sm hover:underline"
                                        >
                                            WhatsApp
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-500">📧</span>
                                        <span className="text-gray-700">{selectedUser.email}</span>
                                    </div>
                                    {selectedUser.address && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-500">📍</span>
                                            <span className="text-gray-700">{selectedUser.address}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Dates */}
                                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">🎂 Birthday</span>
                                        <span className="font-medium">{formatDate(selectedUser.birthday)}</span>
                                    </div>
                                    {selectedUser.anniversary && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">💝 Anniversary</span>
                                            <span className="font-medium">{formatDate(selectedUser.anniversary)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">📅 Registered</span>
                                        <span className="font-medium">{formatDateTime(selectedUser.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Card Number */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Card Number (16 digits)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="\d*"
                                            maxLength={16}
                                            value={cardInput}
                                            onChange={(e) => {
                                                // Only allow digits
                                                const value = e.target.value.replace(/\D/g, "");
                                                setCardInput(value);
                                            }}
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono tracking-wider"
                                            placeholder="0000000000000000"
                                        />
                                        <button
                                            onClick={updateCardNumber}
                                            disabled={updating}
                                            className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50"
                                        >
                                            {updating ? "..." : "Save"}
                                        </button>
                                    </div>
                                    {cardInput && cardInput.length !== 16 && (
                                        <p className="text-xs text-red-500">{16 - cardInput.length} more digits needed</p>
                                    )}
                                </div>

                                {/* Payment Screenshot */}
                                {selectedUser.paymentScreenshot && (
                                    <div className="space-y-2 pt-2 border-t">
                                        <p className="block text-sm font-medium text-gray-700">Payment Proof</p>
                                        <div
                                            className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 cursor-zoom-in"
                                            onClick={() => setFullscreenImage(selectedUser.paymentScreenshot!)}
                                        >
                                            <img
                                                src={selectedUser.paymentScreenshot}
                                                alt="Payment Proof"
                                                className="w-full h-auto max-h-60 object-contain"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Error */}
                                {error && (
                                    <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Verification Status & Action */}
                                <div className="pt-4 border-t">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Payment Status</p>
                                            <p className={`font-semibold ${selectedUser.verified ? "text-green-600" : "text-amber-600"}`}>
                                                {selectedUser.verified ? "✓ Verified" : "⏳ Pending Verification"}
                                            </p>
                                            {selectedUser.verifiedAt && (
                                                <p className="text-xs text-gray-400">
                                                    Verified on {formatDateTime(selectedUser.verifiedAt)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleVerification(!selectedUser.verified)}
                                        disabled={updating}
                                        className={`w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 ${selectedUser.verified
                                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                                            : "bg-green-500 text-white hover:bg-green-600"
                                            }`}
                                    >
                                        {updating
                                            ? "Updating..."
                                            : selectedUser.verified
                                                ? "❌ Mark as Unverified"
                                                : "✓ Verify Payment"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fullscreen Image Modal */}
            <AnimatePresence>
                {fullscreenImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black flex items-center justify-center p-2"
                        onClick={() => setFullscreenImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-white/20"
                            onClick={() => setFullscreenImage(null)}
                        >
                            ✕
                        </button>
                        <img
                            src={fullscreenImage}
                            alt="Full Screen Proof"
                            className="max-w-full max-h-full object-contain"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
