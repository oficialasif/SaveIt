"use client";
import React from 'react';
import Link from 'next/link';
import { Layers, FileText, Shield, AlertCircle, UserCheck } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#000d26] text-white">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -bottom-[20%] -right-[10%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-[#ff8e8e] via-[#bd67ff] to-[#2effc3] blur-[100px] opacity-20" />
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
            <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-gray-400">Last updated: January 13, 2026</p>
                </div>

                <div className="prose prose-invert max-w-none">
                    <div className="bg-[#03122f] border border-white/10 rounded-2xl p-8 mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="w-6 h-6 text-[#2effc3]" />
                            <h2 className="text-2xl font-bold m-0">Agreement to Terms</h2>
                        </div>
                        <p className="text-gray-400 m-0">
                            By accessing or using SaveIt, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                        </p>
                    </div>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-[#2effc3]" />
                            User Accounts
                        </h2>
                        <ul className="text-gray-400 space-y-2">
                            <li>You must be at least 13 years old to use SaveIt</li>
                            <li>You are responsible for maintaining the security of your account</li>
                            <li>You must provide accurate and complete information</li>
                            <li>One person or entity may not maintain more than one free account</li>
                            <li>You are responsible for all activity under your account</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Acceptable Use</h2>
                        <p className="text-gray-400 mb-4">You agree NOT to use SaveIt to:</p>
                        <ul className="text-gray-400 space-y-2">
                            <li>Violate any laws or regulations</li>
                            <li>Infringe on intellectual property rights</li>
                            <li>Transmit malicious code or viruses</li>
                            <li>Harass, abuse, or harm others</li>
                            <li>Spam or send unsolicited content</li>
                            <li>Attempt to gain unauthorized access</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Content Ownership</h2>
                        <p className="text-gray-400 mb-4">
                            <strong className="text-white">Your Content:</strong> You retain all rights to the content you save. We claim no ownership over your saved items.
                        </p>
                        <p className="text-gray-400 mb-4">
                            <strong className="text-white">Our Content:</strong> SaveIt's interface, features, and branding are protected by copyright and trademark laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Subscription and Payments</h2>
                        <ul className="text-gray-400 space-y-2">
                            <li><strong className="text-white">Free Plan:</strong> Limited to 10 saved items with basic features</li>
                            <li><strong className="text-white">Pro Plan:</strong> $3/month with unlimited items and premium features</li>
                            <li>Subscriptions auto-renew unless cancelled</li>
                            <li>Refunds are handled on a case-by-case basis</li>
                            <li>We reserve the right to change pricing with 30 days notice</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[#2effc3]" />
                            Service Availability
                        </h2>
                        <p className="text-gray-400">
                            We strive for 99.9% uptime but cannot guarantee uninterrupted service. We reserve the right to modify or discontinue features with notice.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-[#2effc3]" />
                            Limitation of Liability
                        </h2>
                        <p className="text-gray-400 mb-4">
                            SaveIt is provided "as is" without warranties. We are not liable for:
                        </p>
                        <ul className="text-gray-400 space-y-2">
                            <li>Loss of data or content</li>
                            <li>Service interruptions or errors</li>
                            <li>Indirect or consequential damages</li>
                            <li>Third-party actions or content</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Termination</h2>
                        <p className="text-gray-400">
                            We may terminate or suspend your account for violations of these terms. You may close your account at any time through settings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
                        <p className="text-gray-400">
                            We may update these terms from time to time. Continued use after changes constitutes acceptance of new terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Contact</h2>
                        <p className="text-gray-400">
                            Questions about these Terms? Contact us at{' '}
                            <a href="mailto:legal@saveit.com" className="text-[#2effc3] hover:underline">
                                legal@saveit.com
                            </a>
                        </p>
                    </section>
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#2effc3] text-[#000d26] rounded-xl font-bold hover:bg-[#26ebb0] transition"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
