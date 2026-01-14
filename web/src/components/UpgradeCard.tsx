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

            console.log('Checkout response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout');
            }

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error('No checkout URL received from server');
            }
        } catch (error) {
            console.error('Upgrade error:', error);
            alert(`Failed to start checkout: ${error instanceof Error ? error.message : 'Please try again'}`);
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#2effc3]/10 to-[#03122f] border-2 border-[#2effc3] rounded-xl p-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2effc3]/20 border border-[#2effc3]/30 rounded-full text-xs text-[#2effc3] font-semibold mb-3">
                <Sparkles className="w-3 h-3" />
                SaveIt Pro
            </div>

            <h3 className="text-lg font-bold mb-1">Unlock unlimited saves</h3>
            <p className="text-gray-400 text-sm mb-4">Get access to all premium features</p>

            <div className="space-y-2 mb-4 text-left">
                {[
                    'Unlimited saves',
                    'Cloud sync across devices',
                    'Advanced search & export',
                    'Priority support'
                ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#2effc3]/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-[#2effc3]" />
                        </div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                ))}
            </div>

            <div className="mb-4">
                <div className="text-3xl font-bold text-[#2effc3]">$3<span className="text-base text-gray-400">/month</span></div>
                <p className="text-xs text-gray-500">Cancel anytime</p>
            </div>

            <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#2effc3] text-[#000d26] font-bold py-3 px-6 rounded-lg hover:bg-[#26ebb0] transition shadow-lg shadow-[#2effc3]/20 disabled:opacity-50 group"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Zap className="w-4 h-4" />
                        Upgrade to Pro
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>

            <p className="text-xs text-gray-500 mt-3">Secure payment via LemonSqueezy</p>
        </div>
    );
}
