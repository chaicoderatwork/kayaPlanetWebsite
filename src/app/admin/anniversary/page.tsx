"use client";

import { useState, useEffect, useCallback } from "react";

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
    const [editingCard, setEditingCard] = useState<string | null>(null);
    const [cardInput, setCardInput] = useState("");

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

    const toggleVerification = async (registrationId: string, currentStatus: boolean) => {
        try {
            const response = await fetch("/api/anniversary/verify", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-password": password,
                },
                body: JSON.stringify({
                    registrationId,
                    verified: !currentStatus,
                }),
            });

            if (response.ok) {
                fetchRegistrations();
            }
        } catch {
            setError("Failed to update verification status");
        }
    };

    const updateCardNumber = async (registrationId: string) => {
        try {
            const response = await fetch("/api/anniversary/verify", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-password": password,
                },
                body: JSON.stringify({
                    registrationId,
                    cardNumber: cardInput,
                }),
            });

            if (response.ok) {
                setEditingCard(null);
                setCardInput("");
                fetchRegistrations();
            }
        } catch {
            setError("Failed to update card number");
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
            <header className="bg-white shadow-sm sticky top-0 z-10">
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
                        onClick={fetchRegistrations}
                        className="ml-auto px-4 py-2 bg-white rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                    >
                        🔄 Refresh
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                        {error}
                    </div>
                )}

                {/* Registrations Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : registrations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No registrations found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            ID
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Contact
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Birthday / Anniversary
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Card #
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {registrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                                    {reg.id}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {formatDateTime(reg.createdAt)}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-800">{reg.name}</p>
                                                <p className="text-xs text-gray-500">{reg.address || "No address"}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <a
                                                    href={`tel:+91${reg.mobile}`}
                                                    className="text-orange-600 hover:underline block"
                                                >
                                                    📞 {reg.mobile}
                                                </a>
                                                <p className="text-xs text-gray-500">{reg.email}</p>
                                                <a
                                                    href={`https://wa.me/91${reg.mobile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-green-600 hover:underline"
                                                >
                                                    💬 WhatsApp
                                                </a>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <p>🎂 {formatDate(reg.birthday)}</p>
                                                {reg.anniversary && (
                                                    <p>💝 {formatDate(reg.anniversary)}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {editingCard === reg.id ? (
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={cardInput}
                                                            onChange={(e) => setCardInput(e.target.value)}
                                                            className="w-24 px-2 py-1 border rounded text-sm"
                                                            placeholder="Card #"
                                                        />
                                                        <button
                                                            onClick={() => updateCardNumber(reg.id)}
                                                            className="text-green-600 text-sm"
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingCard(null)}
                                                            className="text-red-600 text-sm"
                                                        >
                                                            ✗
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setEditingCard(reg.id);
                                                            setCardInput(reg.cardNumber || "");
                                                        }}
                                                        className="text-sm text-gray-600 hover:text-orange-600"
                                                    >
                                                        {reg.cardNumber || "Assign Card #"}
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${reg.verified
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-amber-100 text-amber-700"
                                                        }`}
                                                >
                                                    {reg.verified ? "✓ Verified" : "⏳ Pending"}
                                                </span>
                                                {reg.verifiedAt && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatDateTime(reg.verifiedAt)}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => toggleVerification(reg.id, reg.verified)}
                                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${reg.verified
                                                        ? "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                                                        : "bg-green-500 text-white hover:bg-green-600"
                                                        }`}
                                                >
                                                    {reg.verified ? "Unverify" : "Verify Payment"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
