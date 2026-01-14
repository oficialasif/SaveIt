"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Layers, ArrowRight, Mail, Lock, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const { loginWithGoogle, loginWithEmail } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const returnTo = searchParams.get('returnTo') || '/dashboard';

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await loginWithEmail(email, password);
            // Redirect will be handled by AuthContext, but we can override if returnTo is set
            if (returnTo !== '/dashboard') {
                router.push(returnTo);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            // Redirect will be handled by AuthContext, but we can override if returnTo is set
            if (returnTo !== '/dashboard') {
                router.push(returnTo);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to login with Google');
        }
    };

    return (
        <div className="h-screen bg-[#000d26] text-white flex overflow-hidden">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#03122f] to-[#000d26] relative overflow-hidden items-center justify-center p-12">
                {/* Background decorations */}
                <div className="absolute inset-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#2effc3]/10 blur-[120px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-md">
                    <Link href="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition">
                        <div className="w-12 h-12 bg-[#2effc3] rounded-xl flex items-center justify-center">
                            <Layers className="w-7 h-7 text-[#000d26]" />
                        </div>
                        <span className="text-3xl font-bold">SaveIt</span>
                    </Link>

                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Welcome back to your<br />
                        <span className="text-[#2effc3]">knowledge hub</span>
                    </h1>

                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                        Access all your saved content from anywhere. Your ideas, organized and ready when you need them.
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#2effc3]" />
                            <span>AI-powered organization</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#2effc3]" />
                            <span>Cloud sync</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                {/* Mobile background */}
                <div className="lg:hidden absolute inset-0 overflow-hidden">
                    <div className="absolute -bottom-[20%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-[#ff8e8e] via-[#bd67ff] to-[#2effc3] blur-[100px] opacity-20" />
                </div>

                <div className="w-full max-w-md relative z-10">
                    {/* Mobile Logo */}
                    <Link href="/" className="lg:hidden flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition">
                        <Layers className="w-8 h-8 text-[#2effc3]" />
                        <span className="text-2xl font-bold">SaveIt</span>
                    </Link>

                    <div className="bg-[#03122f] border border-white/10 rounded-2xl p-8 lg:p-10 shadow-2xl">
                        <h2 className="text-3xl font-bold mb-2">Sign in</h2>
                        <p className="text-gray-400 mb-8">Enter your credentials to continue</p>

                        {error && (
                            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleEmailLogin} className="space-y-5 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-[#0a1929] border border-white/10 rounded-xl focus:border-[#2effc3] focus:ring-2 focus:ring-[#2effc3]/20 transition outline-none"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-12 py-3 bg-[#0a1929] border border-white/10 rounded-xl focus:border-[#2effc3] focus:ring-2 focus:ring-[#2effc3]/20 transition outline-none"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 bg-[#2effc3] text-[#000d26] font-bold py-3.5 px-6 rounded-xl hover:bg-[#26ebb0] transition shadow-lg shadow-[#2effc3]/20 disabled:opacity-50 group"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-[#03122f] text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 bg-white text-[#000d26] font-semibold py-3.5 px-6 rounded-xl hover:bg-gray-100 transition shadow-lg"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                            Google
                        </button>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-400">
                                Don't have an account?{' '}
                                <Link href="/register" className="text-[#2effc3] hover:underline font-semibold">
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-6">
                        By continuing, you agree to our{' '}
                        <Link href="#" className="hover:text-gray-300">Terms</Link>
                        {' '}and{' '}
                        <Link href="#" className="hover:text-gray-300">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
