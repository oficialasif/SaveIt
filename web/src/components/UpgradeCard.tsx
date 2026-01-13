"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Check, Zap, ArrowRight, Loader2 } from 'lucide-react';

export default function UpgradeCard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        if (!user) return;

        setLoading(true);

        try {
            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    userId: user.uid,
                    name: user.displayName || 'SaveIt User',
                }),
            });

            const data = await response.json();

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (error) {
            console.error('Upgrade error:', error);
            alert('Failed to start checkout. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#2effc3]/10 to-[#03122f] border-2 border-[#2effc3] rounded-2xl p-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2effc3]/20 border border-[#2effc3]/30 rounded-full text-sm text-[#2effc3] font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                SaveIt Pro
            </div>

            <h3 className="text-2xl font-bold mb-2">Unlock your full productivity</h3>
            <p className="text-gray-400 mb-6">Get unlimited access to all premium features</p>

            <div className="space-y-3 mb-8 text-left">
                {[
                    'Unlimited saves',
                    'Cloud sync across devices',
                    'Advanced search & export',
                    'Priority support'
                ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#2effc3]/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-[#2effc3]" />
                        </div>
                        <span className="text-gray-300">{feature}</span>
                    </div>
                ))}
            </div>

            <div className="mb-6">
                <div className="text-4xl font-bold text-[#2effc3] mb-1">$3<span className="text-lg text-gray-400">/month</span></div>
                <p className="text-sm text-gray-500">Cancel anytime, no commitments</p>
            </div>

            <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#2effc3] text-[#000d26] font-bold py-4 px-8 rounded-xl hover:bg-[#26ebb0] transition shadow-lg shadow-[#2effc3]/20 disabled:opacity-50 group"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Zap className="w-5 h-5" />
                        Upgrade to Pro
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>

            <p className="text-xs text-gray-500 mt-4">Secure payment powered by LemonSqueezy</p>
        </div>
    );
}
