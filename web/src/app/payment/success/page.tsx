"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layers, Check, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PaymentSuccessPage() {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Trigger confetti
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#2effc3', '#bd67ff', '#ff8e8e'],
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#2effc3', '#bd67ff', '#ff8e8e'],
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
        setTimeout(() => setShowContent(true), 300);
    }, []);

    return (
        <div className="min-h-screen bg-[#000d26] text-white flex items-center justify-center p-6">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-[#2effc3] via-[#bd67ff] to-[#ff8e8e] blur-[100px] opacity-20" />
            </div>

            <div className={`relative z-10 max-w-2xl w-full text-center transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Success Icon */}
                <div className="inline-flex items-center justify-center w-24 h-24 bg-[#2effc3] rounded-full mb-8 shadow-lg shadow-[#2effc3]/50">
                    <Check className="w-12 h-12 text-[#000d26]" />
                </div>

                {/* Main Content */}
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Welcome to <span className="text-[#2effc3]">SaveIt Pro!</span>
                </h1>
                <p className="text-xl text-gray-400 mb-12">
                    Your account has been upgraded successfully. Enjoy unlimited productivity!
                </p>

                {/* Features Unlocked */}
                <div className="bg-[#03122f] border border-white/10 rounded-2xl p-8 mb-8">
                    <div className="flex items-center gap-2 justify-center mb-6">
                        <Sparkles className="w-5 h-5 text-[#2effc3]" />
                        <h2 className="text-xl font-bold">Pro Features Unlocked</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-left">
                        {[
                            'Unlimited saved items',
                            'Cloud sync across devices',
                            'Advanced search & filters',
                            'Export your data anytime',
                            'Priority customer support',
                            'Early access to new features'
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-[#2effc3]/20 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3 h-3 text-[#2effc3]" />
                                </div>
                                <span className="text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2effc3] text-[#000d26] rounded-xl font-bold hover:bg-[#26ebb0] transition shadow-lg shadow-[#2effc3]/20 group"
                    >
                        Go to Dashboard
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0a1929] border border-gray-700 text-white rounded-xl font-medium hover:bg-[#11223a] transition"
                    >
                        Back to Home
                    </Link>
                </div>

                {/* Footer */}
                <p className="text-sm text-gray-500 mt-12">
                    You can manage your subscription anytime from your dashboard settings.
                </p>
            </div>
        </div>
    );
}
