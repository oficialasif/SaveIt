"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, Check, Zap, Download, Chrome, Users, MousePointer2 } from 'lucide-react';
import { motion } from 'framer-motion';

function SaveDemo() {
    const [typedText, setTypedText] = useState("");
    const [showButton, setShowButton] = useState(false);
    const [showCursor, setShowCursor] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const animationRef = useRef<NodeJS.Timeout | null>(null);

    const fullText = "The best ideas often come at unexpected moments...";

    useEffect(() => {
        const runAnimation = () => {
            let currentIndex = 0;

            // Typing phase
            const typeInterval = setInterval(() => {
                if (currentIndex < fullText.length) {
                    setTypedText(fullText.substring(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    clearInterval(typeInterval);

                    // Show button and cursor after typing
                    setTimeout(() => {
                        setShowButton(true);
                        setTimeout(() => {
                            setShowCursor(true);

                            // Move cursor and click
                            setTimeout(() => {
                                setIsClicking(true);
                                setTimeout(() => {
                                    setIsSaved(true);
                                    setShowCursor(false);

                                    // Reset after showing saved state
                                    setTimeout(() => {
                                        setTypedText("");
                                        setShowButton(false);
                                        setIsClicking(false);
                                        setIsSaved(false);

                                        // Restart animation
                                        animationRef.current = setTimeout(runAnimation, 1000);
                                    }, 2000);
                                }, 300);
                            }, 1500);
                        }, 500);
                    }, 500);
                }
            }, 50);
        };

        runAnimation();

        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
            }
        };
    }, []);

    return (
        <div className="flex-1 bg-[#03122f] border border-white/10 rounded-2xl p-8 relative">
            <div className="bg-[#0a1929] rounded-lg p-4 mb-4 min-h-[80px] flex items-center">
                <div>
                    <div className="text-sm text-gray-400 mb-2">Selected Text:</div>
                    <div className="text-white">
                        "{typedText}"
                        <span className="inline-block w-0.5 h-4 bg-[#2effc3] ml-1 animate-pulse"></span>
                    </div>
                </div>
            </div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: showButton ? 1 : 0 }}
                className={`relative w-full py-3 rounded-lg font-bold transition ${isSaved
                    ? 'bg-green-500 text-white'
                    : 'bg-[#2effc3] text-[#000d26]'
                    }`}
            >
                {isSaved ? (
                    <span className="flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" /> Saved!
                    </span>
                ) : (
                    'Save to SaveIt'
                )}

                {/* Animated Mouse Cursor */}
                {showCursor && (
                    <motion.div
                        initial={{ opacity: 0, x: -50, y: -50 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            y: 0,
                            scale: isClicking ? 0.9 : 1
                        }}
                        transition={{ duration: 0.8 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    >
                        <MousePointer2 className="w-6 h-6 text-white drop-shadow-lg" />
                    </motion.div>
                )}
            </motion.button>
        </div>
    );
}

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-[#000d26] text-white">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -bottom-[20%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-[#ff8e8e] via-[#bd67ff] to-[#2effc3] blur-[100px] opacity-20" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 flex justify-between items-center p-6 md:px-12 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2">
                    <Layers className="w-6 h-6 text-[#2effc3]" />
                    <span className="text-2xl font-bold">SaveIt</span>
                </Link>
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
                    Back to Home
                </Link>
            </nav>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-20">
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        How <span className="text-[#2effc3]">SaveIt</span> Works
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Save, organize, and access your ideas from anywhere in just three simple steps.
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-20">
                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-[#2effc3] text-[#000d26] flex items-center justify-center text-2xl font-bold">
                                    1
                                </div>
                                <h2 className="text-3xl font-bold">Install the Extension</h2>
                            </div>
                            <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                Add SaveIt to your Chrome browser with a single click. The extension integrates seamlessly into your browsing experience.
                            </p>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <Chrome className="w-5 h-5 text-[#2effc3]" />
                                <span>Available for Chrome & Edge</span>
                            </div>
                        </div>
                        <div className="flex-1 bg-[#03122f] border border-white/10 rounded-2xl p-8 text-center">
                            <Download className="w-16 h-16 mx-auto mb-4 text-[#2effc3]" />
                            <div className="text-lg font-semibold">Chrome Web Store</div>
                            <div className="text-sm text-gray-400 mt-2">Free installation</div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-[#2effc3] text-[#000d26] flex items-center justify-center text-2xl font-bold">
                                    2
                                </div>
                                <h2 className="text-3xl font-bold">Save Anything</h2>
                            </div>
                            <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                Right-click any text on any webpage and select "Save to SaveIt". Your content is instantly saved to the cloud with AI-powered tagging.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Articles', 'Quotes', 'Code Snippets', 'Ideas'].map((tag) => (
                                    <span key={tag} className="px-3 py-1 bg-[#2effc3]/10 border border-[#2effc3]/20 rounded-full text-xs text-[#2effc3]">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <SaveDemo />
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-[#2effc3] text-[#000d26] flex items-center justify-center text-2xl font-bold">
                                    3
                                </div>
                                <h2 className="text-3xl font-bold">Access Everywhere</h2>
                            </div>
                            <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                Log in to your dashboard from any device to view, search, and manage all your saved items. Everything syncs automatically across all your devices.
                            </p>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <Users className="w-5 h-5 text-[#2effc3]" />
                                <span>Cloud sync • Search • AI organization</span>
                            </div>
                        </div>
                        <div className="flex-1 bg-[#03122f] border border-white/10 rounded-2xl p-8">
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-[#0a1929] rounded-lg p-4 border border-white/5 hover:border-[#2effc3]/30 transition">
                                        <div className="h-2 w-3/4 bg-white/10 rounded mb-2"></div>
                                        <div className="h-2 w-1/2 bg-white/5 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-20 bg-gradient-to-br from-[#2effc3]/10 to-[#03122f] border-2 border-[#2effc3] rounded-2xl p-12">
                    <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
                    <p className="text-gray-400 mb-8">Join thousands of users saving their best ideas.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register" className="px-8 py-4 bg-[#2effc3] text-[#000d26] rounded-lg font-bold hover:bg-[#26ebb0] transition flex items-center justify-center gap-2">
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/" className="px-8 py-4 bg-[#0a1929] border border-gray-700 text-white rounded-lg font-medium hover:bg-[#11223a] transition">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
