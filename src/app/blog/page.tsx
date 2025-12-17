"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Play, Send, MessageCircle, ArrowRight } from "lucide-react";
import blogPosts from "@/data/blog-posts.json";
import BlogCard from "@/components/BlogCard";
import YouTubeEmbed from "@/components/YouTubeEmbed";

export default function BlogPage() {
    const [question, setQuestion] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const featuredPost = blogPosts.find((post) => post.featured);
    const otherPosts = blogPosts.filter((post) => !post.featured);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        setIsSubmitting(true);
        // Simulate submission (replace with actual email API later)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        setSubmitted(true);
        setQuestion("");
    };

    return (
        <main className="min-h-screen bg-[#FDFBF9]">
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-[#F27708]/20 to-pink-500/10 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/10 to-[#F27708]/10 rounded-full blur-3xl -z-10" />

                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#F27708]/20 text-[#F27708] text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-6">
                            <Sparkles className="w-3.5 h-3.5" />
                            Beauty Insights
                        </div>
                        <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-stardom)] text-[#111111] mb-4">
                            Makeup Tips & Guides
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Expert advice, tutorials, and beauty secrets from the <strong>Best Makeup Artist in Kanpur</strong>. Learn professional techniques for your perfect look.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Featured Post with Video */}
            {featuredPost && featuredPost.youtubeUrl && (
                <section className="pb-16 md:pb-24">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                        >
                            <div className="grid md:grid-cols-2 gap-0">
                                {/* Video Side */}
                                <div className="p-6 md:p-8 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                                    <YouTubeEmbed
                                        url={featuredPost.youtubeUrl}
                                        title={featuredPost.title}
                                    />
                                </div>
                                {/* Content Side */}
                                <div className="p-6 md:p-10 flex flex-col justify-center">
                                    <div className="inline-flex items-center gap-2 text-[#F27708] text-xs font-semibold uppercase tracking-wider mb-4">
                                        <Play fill="#F27708" className="w-4 h-4" />
                                        Featured Video
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {featuredPost.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                    <Link
                                        href={`/blog/${featuredPost.slug}`}
                                        className="inline-flex items-center gap-2 bg-[#F27708] hover:bg-[#F89134] text-white font-medium px-6 py-3 rounded-full transition-colors w-fit"
                                    >
                                        Read Full Article
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Blog Grid */}
            <section className="pb-16 md:pb-24">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-stardom)] text-[#111111]">
                            Latest Articles
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {otherPosts.map((post) => (
                            <BlogCard
                                key={post.slug}
                                slug={post.slug}
                                title={post.title}
                                excerpt={post.excerpt}
                                coverImage={post.coverImage}
                                date={post.date}
                                hasVideo={!!post.youtubeUrl}
                                tags={post.tags}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Q&A Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-[#111111] to-gray-900 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                        backgroundSize: "32px 32px"
                    }} />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-[#F27708] text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-6">
                                <MessageCircle className="w-3.5 h-3.5" />
                                Ask a Question
                            </div>
                            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-stardom)] text-white mb-4">
                                Got Makeup Questions?
                            </h2>
                            <p className="text-gray-400 mb-8">
                                Whether you&apos;re a bride-to-be or just curious about beauty tips, drop your question below. Our expert artists will get back to you!
                            </p>

                            {!submitted ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative">
                                        <textarea
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            placeholder="Type your makeup question here..."
                                            rows={4}
                                            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#F27708] resize-none transition-colors"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !question.trim()}
                                        className="inline-flex items-center gap-2 bg-[#F27708] hover:bg-[#F89134] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-full transition-colors"
                                    >
                                        {isSubmitting ? (
                                            "Sending..."
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Submit Question
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6"
                                >
                                    <p className="text-green-400 font-medium">
                                        ✨ Thank you! We&apos;ve received your question and will respond soon.
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-r from-[#F27708] to-[#F89134] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-4xl font-[family-name:var(--font-stardom)] text-white mb-4">
                                Ready to Glow?
                            </h2>
                            <p className="text-white/90 mb-8 max-w-xl mx-auto">
                                Book your appointment with the best makeup artist in Kanpur and let us create your dream look.
                            </p>
                            <a
                                href="tel:+919999424375"
                                className="inline-flex items-center gap-2 bg-white text-[#F27708] font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                Book Now
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
