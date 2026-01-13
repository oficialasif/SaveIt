"use client";
import React from 'react';
import Link from 'next/link';
import { Layers, Shield, Lock, Eye, Server } from 'lucide-react';

export default function PrivacyPage() {
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
            <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-gray-400">Last updated: January 13, 2026</p>
                </div>

                <div className="prose prose-invert max-w-none">
                    <div className="bg-[#03122f] border border-white/10 rounded-2xl p-8 mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-6 h-6 text-[#2effc3]" />
                            <h2 className="text-2xl font-bold m-0">Your Privacy Matters</h2>
                        </div>
                        <p className="text-gray-400 m-0">
                            At SaveIt, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.
                        </p>
                    </div>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-[#2effc3]" />
                            Information We Collect
                        </h2>
                        <p className="text-gray-400 mb-4">We collect the following types of information:</p>
                        <ul className="text-gray-400 space-y-2">
                            <li><strong className="text-white">Account Information:</strong> Name, email address, and password when you create an account</li>
                            <li><strong className="text-white">Saved Content:</strong> Text, URLs, and metadata of items you save</li>
                            <li><strong className="text-white">Usage Data:</strong> How you interact with our service to improve user experience</li>
                            <li><strong className="text-white">Device Information:</strong> Browser type, operating system, and IP address</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Server className="w-5 h-5 text-[#2effc3]" />
                            How We Use Your Information
                        </h2>
                        <ul className="text-gray-400 space-y-2">
                            <li>To provide and maintain our service</li>
                            <li>To sync your saved items across devices</li>
                            <li>To improve our AI-powered features</li>
                            <li>To send you important updates about our service</li>
                            <li>To ensure the security of your account</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-[#2effc3]" />
                            Data Security
                        </h2>
                        <p className="text-gray-400 mb-4">
                            We implement industry-standard security measures to protect your data:
                        </p>
                        <ul className="text-gray-400 space-y-2">
                            <li>End-to-end encryption for sensitive data</li>
                            <li>Secure cloud storage with Firebase</li>
                            <li>Regular security audits and updates</li>
                            <li>Two-factor authentication support</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
                        <p className="text-gray-400 mb-4">
                            We use the following third-party services:
                        </p>
                        <ul className="text-gray-400 space-y-2">
                            <li><strong className="text-white">Firebase:</strong> For authentication and data storage</li>
                            <li><strong className="text-white">Google Analytics:</strong> For usage analytics (optional)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                        <p className="text-gray-400 mb-4">You have the right to:</p>
                        <ul className="text-gray-400 space-y-2">
                            <li>Access your personal data</li>
                            <li>Request data deletion</li>
                            <li>Export your saved items</li>
                            <li>Opt-out of optional data collection</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                        <p className="text-gray-400">
                            If you have questions about this Privacy Policy, please contact us at{' '}
                            <a href="mailto:privacy@saveit.com" className="text-[#2effc3] hover:underline">
                                privacy@saveit.com
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
