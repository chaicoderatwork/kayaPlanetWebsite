"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
    Upload,
    Trash2,
    Plus,
    Film,
    ImageIcon,
    Users,
    LayoutGrid,
    BarChart3,
    Zap,
    Lock,
    LogOut,
    Check,
    X,
    Loader2,
    Home,
    AlertCircle,
    Edit2,
    Save,
} from "lucide-react";

// Types
interface ServiceVideo {
    id: string;
    videoUrl: string;
    posterUrl: string;
    title: string;
}

interface HeroSlide {
    id: number;
    image: string;
    title: string;
    subtitle: string;
}

interface Reel {
    id: string;
    videoUrl: string;
    posterUrl: string;
    title: string;
}

interface Influencer {
    handle: string;
    name: string;
    followers: string;
    image: string | null;
    profileUrl: string;
    reelUrl: string | null;
    testimonial?: string | null;
    isFeatured?: boolean;
}

interface GalleryItem {
    type: "image" | "video";
    src: string;
    poster?: string;
    width: number;
    height: number;
    alt: string;
    badge?: string | null;
    badgeType?: string | null;
}

// Tab configuration
const TABS = [
    { id: "services", label: "Services", icon: Film },
    { id: "hero", label: "Hero", icon: Home },
    { id: "reels", label: "Reels", icon: Film },
    { id: "influencers", label: "Influencers", icon: Users },
    { id: "gallery", label: "Gallery", icon: LayoutGrid },
    { id: "performance", label: "Performance", icon: Zap },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
];

// Badge options for gallery
const BADGE_OPTIONS = [
    { value: "", label: "No Badge" },
    { value: "real-bride", label: "KP Bride" },
    { value: "signature", label: "Signature" },
];

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [activeTab, setActiveTab] = useState("services");
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Data states
    const [services, setServices] = useState<ServiceVideo[]>([]);
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

    // Upload states
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // Check auth on mount
    useEffect(() => {
        const token = localStorage.getItem("kp-admin-token");
        if (token) {
            setIsAuthenticated(true);
            loadData();
        }
    }, []);

    // Load all data
    const loadData = async () => {
        try {
            const [servicesRes, heroRes, reelsRes, influencersRes, galleryRes] = await Promise.all([
                fetch("/api/admin/services"),
                fetch("/api/admin/hero"),
                fetch("/api/admin/reels"),
                fetch("/api/admin/influencers"),
                fetch("/api/admin/gallery"),
            ]);

            if (servicesRes.ok) setServices(await servicesRes.json());
            if (heroRes.ok) setHeroSlides(await heroRes.json());
            if (reelsRes.ok) setReels(await reelsRes.json());
            if (influencersRes.ok) setInfluencers(await influencersRes.json());
            if (galleryRes.ok) {
                const galleryData = await galleryRes.json();
                // Flatten groups
                const items = galleryData.flatMap((g: { items: GalleryItem[] }) => g.items);
                setGalleryItems(items);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };

    // Auth handlers
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                const { token } = await res.json();
                localStorage.setItem("kp-admin-token", token);
                setIsAuthenticated(true);
                loadData();
            } else {
                setAuthError("Incorrect password");
            }
        } catch {
            setAuthError("Connection error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("kp-admin-token");
        setIsAuthenticated(false);
        setPassword("");
    };

    // Notification helper
    const showNotification = (type: "success" | "error", message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    // Upload handler
    const handleUpload = async (
        file: File,
        endpoint: string,
        additionalData?: Record<string, string>
    ) => {
        setIsUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append("file", file);
        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, value);
            });
        }

        try {
            // Simulate progress (actual progress would require XHR)
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => Math.min(prev + 10, 90));
            }, 200);

            const res = await fetch(endpoint, {
                method: "POST",
                body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (res.ok) {
                showNotification("success", "Upload successful!");
                loadData(); // Refresh data
            } else {
                const error = await res.json();
                showNotification("error", error.message || "Upload failed");
            }
        } catch {
            showNotification("error", "Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // Delete handler
    const handleDelete = async (endpoint: string, id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await fetch(`${endpoint}?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                showNotification("success", "Deleted successfully!");
                loadData();
            } else {
                showNotification("error", "Delete failed");
            }
        } catch {
            showNotification("error", "Delete failed. Please try again.");
        }
    };

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#F27708]/20 flex items-center justify-center">
                            <Lock className="w-10 h-10 text-[#F27708]" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Kaya Planet Admin</h1>
                        <p className="text-gray-400 mt-2">Enter password to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                        <div className="mb-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#F27708] transition-colors"
                                autoFocus
                            />
                            {authError && (
                                <p className="mt-2 text-red-400 text-sm flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {authError}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !password}
                            className="w-full py-3 rounded-xl bg-[#F27708] hover:bg-[#F89134] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Main Admin Panel
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/kayaplanetlogo.png"
                            alt="Kaya Planet"
                            width={40}
                            height={40}
                            className="rounded-lg"
                        />
                        <div>
                            <h1 className="font-bold text-gray-900">Admin Panel</h1>
                            <p className="text-xs text-gray-500">Manage website content</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <nav className="bg-white border-b sticky top-[57px] z-40 overflow-x-auto">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? "border-[#F27708] text-[#F27708]"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Notification Toast */}
            {notification && (
                <div
                    className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in ${notification.type === "success"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                >
                    {notification.type === "success" ? (
                        <Check className="w-5 h-5" />
                    ) : (
                        <X className="w-5 h-5" />
                    )}
                    {notification.message}
                </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Loader2 className="w-6 h-6 text-[#F27708] animate-spin" />
                            <span className="font-medium">Processing upload...</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-[#F27708] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            Compressing and optimizing...
                        </p>
                    </div>
                </div>
            )}

            {/* Tab Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Services Tab */}
                {activeTab === "services" && (
                    <ServicesTab
                        services={services}
                        onUpload={(file, title) =>
                            handleUpload(file, "/api/admin/services", { title })
                        }
                        onDelete={(id) => handleDelete("/api/admin/services", id)}
                    />
                )}

                {/* Hero Tab */}
                {activeTab === "hero" && (
                    <HeroTab
                        slides={heroSlides}
                        onUpload={(file, title, subtitle) =>
                            handleUpload(file, "/api/admin/hero", { title, subtitle })
                        }
                        onDelete={(id) => handleDelete("/api/admin/hero", String(id))}
                    />
                )}

                {/* Reels Tab */}
                {activeTab === "reels" && (
                    <ReelsTab
                        reels={reels}
                        onUpload={(file, title) =>
                            handleUpload(file, "/api/admin/reels", { title })
                        }
                        onDelete={(id) => handleDelete("/api/admin/reels", id)}
                    />
                )}

                {/* Influencers Tab */}
                {activeTab === "influencers" && (
                    <InfluencersTab
                        influencers={influencers}
                        onRefresh={loadData}
                        showNotification={showNotification}
                    />
                )}

                {/* Gallery Tab */}
                {activeTab === "gallery" && (
                    <GalleryTab
                        items={galleryItems}
                        onUpload={(file, badge) =>
                            handleUpload(file, "/api/admin/gallery", { badge: badge || "" })
                        }
                        onDelete={(src) => handleDelete("/api/admin/gallery", src)}
                    />
                )}

                {/* Performance Tab */}
                {activeTab === "performance" && <PerformanceTab />}

                {/* Analytics Tab */}
                {activeTab === "analytics" && <AnalyticsTab />}
            </main>

            <style jsx global>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

// Services Tab Component
function ServicesTab({
    services,
    onUpload,
    onDelete,
}: {
    services: ServiceVideo[];
    onUpload: (file: File, title: string) => void;
    onDelete: (id: string) => void;
}) {
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const file = fileInputRef.current?.files?.[0];
        if (file && title) {
            onUpload(file, title);
            setShowForm(false);
            setTitle("");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Services</h2>
                    <p className="text-gray-500 text-sm">{services.length} service videos</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-[#F27708] text-white px-4 py-2 rounded-lg hover:bg-[#F89134] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Service
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border">
                    <h3 className="font-medium mb-4">Add New Service</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Hair Highlights"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27708]/20 focus:border-[#F27708]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Video File (MP4/MOV)
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/mp4,video/quicktime"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27708]/20"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-[#F27708] text-white px-4 py-2 rounded-lg hover:bg-[#F89134]"
                            >
                                <Upload className="w-4 h-4" />
                                Upload
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[9/16] group"
                    >
                        <video
                            src={service.videoUrl}
                            poster={service.posterUrl}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                                e.currentTarget.pause();
                                e.currentTarget.currentTime = 0;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white text-sm font-medium truncate">
                                {service.title}
                            </p>
                        </div>
                        <button
                            onClick={() => onDelete(service.id)}
                            className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Hero Tab Component
function HeroTab({
    slides,
    onUpload,
    onDelete,
}: {
    slides: HeroSlide[];
    onUpload: (file: File, title: string, subtitle: string) => void;
    onDelete: (id: number) => void;
}) {
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const file = fileInputRef.current?.files?.[0];
        if (file && title && subtitle) {
            onUpload(file, title, subtitle);
            setShowForm(false);
            setTitle("");
            setSubtitle("");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Hero Slides</h2>
                    <p className="text-gray-500 text-sm">{slides.length} hero images</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-[#F27708] text-white px-4 py-2 rounded-lg hover:bg-[#F89134] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Slide
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border">
                    <h3 className="font-medium mb-4">Add New Hero Slide</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Best Bridal Makeup Artist"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27708]/20 focus:border-[#F27708]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subtitle
                            </label>
                            <input
                                type="text"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                placeholder="e.g., Book Your Dream Wedding Look"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27708]/20 focus:border-[#F27708]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image File
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27708]/20"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-[#F27708] text-white px-4 py-2 rounded-lg hover:bg-[#F89134]"
                            >
                                <Upload className="w-4 h-4" />
                                Upload
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video group"
                    >
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white font-medium">{slide.title}</p>
                            <p className="text-white/70 text-sm">{slide.subtitle}</p>
                        </div>
                        <button
                            onClick={() => onDelete(slide.id)}
                            className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Reels Tab Component
function ReelsTab({
    reels,
    onUpload,
    onDelete,
}: {
    reels: Reel[];
    onUpload: (file: File, title: string) => void;
    onDelete: (id: string) => void;
}) {
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const file = fileInputRef.current?.files?.[0];
        if (file && title) {
            onUpload(file, title);
            setShowForm(false);
            setTitle("");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Portfolio Reels</h2>
                    <p className="text-gray-500 text-sm">{reels.length} reels</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-[#F27708] text-white px-4 py-2 rounded-lg hover:bg-[#F89134] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Reel
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border">
                    <h3 className="font-medium mb-4">Add New Reel</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reel Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Royal Signature Bridal"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27708]/20 focus:border-[#F27708]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Video File (MP4/MOV)
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/mp4,video/quicktime"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27708]/20"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-[#F27708] text-white px-4 py-2 rounded-lg hover:bg-[#F89134]"
                            >
                                <Upload className="w-4 h-4" />
                                Upload
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {reels.map((reel) => (
                    <div
                        key={reel.id}
                        className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[9/16] group"
                    >
                        <video
                            src={reel.videoUrl}
                            poster={reel.posterUrl}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                                e.currentTarget.pause();
                                e.currentTarget.currentTime = 0;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white text-sm font-medium truncate">
                                {reel.title}
                            </p>
                        </div>
                        <button
                            onClick={() => onDelete(reel.id)}
                            className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Influencers Tab Component
function InfluencersTab({
    influencers,
    onRefresh,
    showNotification,
}: {
    influencers: Influencer[];
    onRefresh: () => void;
    showNotification: (type: "success" | "error", message: string) => void;
}) {
    const [showForm, setShowForm] = useState(false);
    const [editingHandle, setEditingHandle] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        handle: "",
        name: "",
        followers: "",
        profileUrl: "",
        reelUrl: "",
        testimonial: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/influencers", {
                method: editingHandle ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    originalHandle: editingHandle,
                }),
            });

            if (res.ok) {
                showNotification("success", editingHandle ? "Updated!" : "Added!");
                onRefresh();
                setShowForm(false);
                setEditingHandle(null);
                setFormData({
                    handle: "",
                    name: "",
                    followers: "",
                    profileUrl: "",
                    reelUrl: "",
                    testimonial: "",
                });
            } else {
                showNotification("error", "Operation failed");
            }
        } catch {
            showNotification("error", "Error saving influencer");
        }
    };

    const handleEdit = (inf: Influencer) => {
        setFormData({
            handle: inf.handle,
            name: inf.name,
            followers: inf.followers,
            profileUrl: inf.profileUrl,
            reelUrl: inf.reelUrl || "",
            testimonial: inf.testimonial || "",
        });
        setEditingHandle(inf.handle);
        setShowForm(true);
    };

    const handleDelete = async (handle: string) => {
        if (!confirm("Delete this influencer?")) return;
        try {
            const res = await fetch(`/api/admin/influencers?handle=${handle}`, {
                method: "DELETE",
            });
            if (res.ok) {
                showNotification("success", "Deleted!");
                onRefresh();
            }
        } catch {
            showNotification("error", "Delete failed");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Influencers</h2>
                    <p className="text-gray-500 text-sm">{influencers.length} influencers</p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingHandle(null);
                        setFormData({
                            handle: "",
                            name: "",
                            followers: "",
                            profileUrl: "",
                            reelUrl: "",
                            testimonial: "",
                        });
                    }}
                    className="flex items-center gap-2 bg-[#F27708] text-white px-4 py-2 rounded-lg hover:bg-[#F89134] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Influencer
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border">
                    <h3 className="font-medium mb-4">
                        {editingHandle ? "Edit Influencer" : "Add New Influencer"}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Instagram Handle
                                </label>
                                <input
                                    type="text"
                                    value={formData.handle}
                                    onChange={(e) =>
                                        setFormData({ ...formData, handle: e.target.value })
                                    }
                                    placeholder="@username"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27708]/20 focus:border-[#F27708]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder="Full name"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27708]/20 focus:border-[#F27708]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Followers
                                </label>
                                <input
                                    type="text"
                                    value={formData.followers}
                                    onChange={(e) =>
                                        setFormData({ ...formData, followers: e.target.value })
                                    }
                                    placeholder="e.g., 1.5M"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27708]/20 focus:border-[#F27708]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Profile URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.profileUrl}
                                    onChange={(e) =>
                                        setFormData({ ...formData, profileUrl: e.target.value })
                                    }
                                    placeholder="https://instagram.com/..."
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27708]/20 focus:border-[#F27708]"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reel URL (optional)
                            </label>
                            <input
                                type="url"
                                value={formData.reelUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, reelUrl: e.target.value })
                                }
                                placeholder="https://instagram.com/reel/..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27708]/20 focus:border-[#F27708]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Testimonial (optional)
                            </label>
                            <textarea
                                value={formData.testimonial}
                                onChange={(e) =>
                                    setFormData({ ...formData, testimonial: e.target.value })
                                }
                                placeholder="Their quote about Kaya Planet..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27708]/20 focus:border-[#F27708] resize-none"
                                rows={2}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-[#F27708] text-white px-4 py-2 rounded-lg hover:bg-[#F89134]"
                            >
                                <Save className="w-4 h-4" />
                                {editingHandle ? "Save Changes" : "Add Influencer"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingHandle(null);
                                }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {influencers.map((inf) => (
                    <div
                        key={inf.handle}
                        className="bg-white rounded-xl p-4 shadow-sm border group relative"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F27708] to-pink-500 flex items-center justify-center text-white font-bold">
                                {inf.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{inf.name}</p>
                                <p className="text-gray-500 text-sm">@{inf.handle}</p>
                                <p className="text-[#F27708] text-sm font-medium">
                                    {inf.followers} followers
                                </p>
                            </div>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(inf)}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(inf.handle)}
                                className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Gallery Tab Component
function GalleryTab({
    items,
    onUpload,
    onDelete,
}: {
    items: GalleryItem[];
    onUpload: (file: File, badge: string) => void;
    onDelete: (src: string) => void;
}) {
    const [showForm, setShowForm] = useState(false);
    const [badge, setBadge] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const file = fileInputRef.current?.files?.[0];
        if (file) {
            onUpload(file, badge);
            setShowForm(false);
            setBadge("");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Gallery</h2>
                    <p className="text-gray-500 text-sm">{items.length} items</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-[#F27708] text-white px-4 py-2 rounded-lg hover:bg-[#F89134] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Item
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border">
                    <h3 className="font-medium mb-4">Add Gallery Item</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image or Video File
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/mp4,video/quicktime"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27708]/20"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Badge (optional)
                            </label>
                            <select
                                value={badge}
                                onChange={(e) => setBadge(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27708]/20 focus:border-[#F27708]"
                            >
                                {BADGE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-[#F27708] text-white px-4 py-2 rounded-lg hover:bg-[#F89134]"
                            >
                                <Upload className="w-4 h-4" />
                                Upload
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square group"
                    >
                        {item.type === "image" ? (
                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <video
                                src={item.src}
                                poster={item.poster}
                                className="w-full h-full object-cover"
                                muted
                            />
                        )}
                        {item.badge && (
                            <span className="absolute bottom-1 left-1 text-[8px] bg-white/90 px-1.5 py-0.5 rounded-full font-medium">
                                {item.badge}
                            </span>
                        )}
                        <button
                            onClick={() => onDelete(item.src)}
                            className="absolute top-1 right-1 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Performance Tab Component
function PerformanceTab() {
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<{
        totalImages: number;
        totalVideos: number;
        unoptimized: string[];
        largeFiles: { name: string; size: string }[];
        recommendations: string[];
    } | null>(null);

    const runAudit = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/performance");
            if (res.ok) {
                setReport(await res.json());
            }
        } catch {
            console.error("Failed to run performance audit");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Performance</h2>
                    <p className="text-gray-500 text-sm">Check asset optimization & site speed</p>
                </div>
                <button
                    onClick={runAudit}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-[#F27708] text-white px-4 py-2 rounded-lg hover:bg-[#F89134] transition-colors disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Scanning...
                        </>
                    ) : (
                        <>
                            <Zap className="w-4 h-4" />
                            Run Audit
                        </>
                    )}
                </button>
            </div>

            {!report ? (
                <div className="bg-white rounded-xl p-8 text-center border">
                    <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Click &quot;Run Audit&quot; to scan your assets</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-4 border">
                            <p className="text-3xl font-bold text-[#F27708]">{report.totalImages}</p>
                            <p className="text-gray-500 text-sm">Images</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border">
                            <p className="text-3xl font-bold text-[#F27708]">{report.totalVideos}</p>
                            <p className="text-gray-500 text-sm">Videos</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border">
                            <p className="text-3xl font-bold text-green-500">
                                {report.unoptimized.length === 0 ? "✓" : report.unoptimized.length}
                            </p>
                            <p className="text-gray-500 text-sm">Unoptimized</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border">
                            <p className="text-3xl font-bold text-amber-500">
                                {report.largeFiles.length}
                            </p>
                            <p className="text-gray-500 text-sm">Large Files</p>
                        </div>
                    </div>

                    {/* Recommendations */}
                    {report.recommendations.length > 0 && (
                        <div className="bg-white rounded-xl p-6 border">
                            <h3 className="font-medium mb-4">Recommendations</h3>
                            <ul className="space-y-2">
                                {report.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Large Files */}
                    {report.largeFiles.length > 0 && (
                        <div className="bg-white rounded-xl p-6 border">
                            <h3 className="font-medium mb-4">Large Files (&gt;1MB)</h3>
                            <div className="space-y-2">
                                {report.largeFiles.map((file, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between py-2 border-b last:border-0"
                                    >
                                        <span className="text-sm truncate max-w-[70%]">{file.name}</span>
                                        <span className="text-sm text-red-500 font-medium">{file.size}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Analytics Tab Component
function AnalyticsTab() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
                    <p className="text-gray-500 text-sm">Website traffic & visitor insights</p>
                </div>
            </div>

            <div className="bg-white rounded-xl p-8 text-center border">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                    Google Analytics not configured yet.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto text-left">
                    <p className="text-sm text-amber-800 font-medium mb-2">Setup Steps:</p>
                    <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                        <li>Create a Google Analytics 4 property</li>
                        <li>Copy your Measurement ID (starts with G-)</li>
                        <li>Add <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_GA_ID</code> to .env.local</li>
                        <li>Restart the dev server</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
