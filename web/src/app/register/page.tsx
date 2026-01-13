"use client";
import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Layers, ArrowRight, Check, Mail, Lock, User, Phone, Sparkles, Zap, AlertCircle, Eye, EyeOff } from 'lucide-react';

const COUNTRY_CODES = [
    { code: '+1', country: 'US/CA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+91', country: 'IN', flag: '🇮🇳' },
    { code: '+86', country: 'CN', flag: '🇨🇳' },
    { code: '+81', country: 'JP', flag: '🇯🇵' },
    { code: '+49', country: 'DE', flag: '🇩🇪' },
    { code: '+33', country: 'FR', flag: '🇫🇷' },
    { code: '+61', country: 'AU', flag: '🇦🇺' },
    { code: '+55', country: 'BR', flag: '🇧🇷' },
    { code: '+880', country: 'BD', flag: '🇧🇩' },
];

export default function RegisterPage() {
    const { loginWithGoogle, signupWithEmail } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [countryCode, setCountryCode] = useState('+1');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Email validation
    const emailError = useMemo(() => {
        if (!email) return '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) ? '' : 'Invalid email format';
    }, [email]);

    // Phone validation
    const phoneError = useMemo(() => {
        if (!phone) return '';
        const phoneRegex = /^\d{10,15}$/;
        return phoneRegex.test(phone) ? '' : 'Phone must be 10-15 digits';
    }, [phone]);

    // Password strength calculation
    const passwordStrength = useMemo(() => {
        if (!password) return { score: 0, label: '', color: '' };

        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
        if (score <= 3) return { score, label: 'Medium', color: 'bg-yellow-500' };
        return { score, label: 'Strong', color: 'bg-green-500' };
    }, [password]);

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validations
        if (emailError) {
            setError(emailError);
            return;
        }

        if (phoneError) {
            setError(phoneError);
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (!firstName || !lastName || !phone) {
            setError('All fields are required');
            return;
        }

        setLoading(true);

        try {
            const displayName = `${firstName} ${lastName}`;
            await signupWithEmail(email, password, displayName);
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please login instead.');
            } else {
                setError(err.message || 'Failed to create account');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#000d26] text-white flex overflow-hidden">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#03122f] to-[#000d26] relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#2effc3]/10 blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-md">
                    <Link href="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition">
                        <div className="w-12 h-12 bg-[#2effc3] rounded-xl flex items-center justify-center">
                            <Layers className="w-7 h-7 text-[#000d26]" />
                        </div>
                        <span className="text-3xl font-bold">SaveIt</span>
                    </Link>

                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Start saving your<br />
                        <span className="text-[#2effc3]">best ideas today</span>
                    </h1>

                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                        Join thousands of users organizing their knowledge with AI-powered tagging and cloud sync.
                    </p>

                    <div className="space-y-4">
                        {[
                            { icon: Sparkles, text: 'AI-powered organization' },
                            { icon: Zap, text: 'Instant cloud sync' },
                            { icon: Check, text: 'Free to get started' }
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#2effc3]/10 border border-[#2effc3]/20 flex items-center justify-center">
                                    <feature.icon className="w-4 h-4 text-[#2effc3]" />
                                </div>
                                <span className="text-gray-300">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="lg:hidden absolute inset-0 overflow-hidden">
                    <div className="absolute -bottom-[20%] -right-[10%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-[#ff8e8e] via-[#bd67ff] to-[#2effc3] blur-[100px] opacity-20" />
                </div>

                <div className="w-full max-w-md relative z-10 max-h-full flex flex-col">
                    <Link href="/" className="lg:hidden flex items-center justify-center gap-2 mb-6 hover:opacity-80 transition flex-shrink-0">
                        <Layers className="w-8 h-8 text-[#2effc3]" />
                        <span className="text-2xl font-bold">SaveIt</span>
                    </Link>

                    <div className="bg-[#03122f] border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl flex flex-col max-h-[calc(100vh-80px)] overflow-hidden">
                        <div className="flex-shrink-0">
                            <h2 className="text-2xl lg:text-3xl font-bold mb-1">Create account</h2>
                            <p className="text-gray-400 text-sm mb-4">Get started with SaveIt for free</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 flex-shrink-0">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                            <form onSubmit={handleEmailSignup} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium mb-1.5 text-gray-300">First name *</label>
                                        <div className="relative">
                                            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required
                                                className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#0a1929] border border-white/10 rounded-lg focus:border-[#2effc3] focus:ring-2 focus:ring-[#2effc3]/20 transition outline-none"
                                                placeholder="John"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium mb-1.5 text-gray-300">Last name *</label>
                                        <div className="relative">
                                            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required
                                                className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#0a1929] border border-white/10 rounded-lg focus:border-[#2effc3] focus:ring-2 focus:ring-[#2effc3]/20 transition outline-none"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium mb-1.5 text-gray-300">Email address *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className={`w-full pl-9 pr-3 py-2.5 text-sm bg-[#0a1929] border rounded-lg focus:ring-2 transition outline-none ${emailError && email ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-white/10 focus:border-[#2effc3] focus:ring-[#2effc3]/20'
                                                }`}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {emailError && email && (
                                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {emailError}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium mb-1.5 text-gray-300">Phone number *</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="w-24 px-2 py-2.5 text-sm bg-[#0a1929] border border-white/10 rounded-lg focus:border-[#2effc3] focus:ring-2 focus:ring-[#2effc3]/20 transition outline-none"
                                        >
                                            {COUNTRY_CODES.map((c) => (
                                                <option key={c.code} value={c.code}>
                                                    {c.flag} {c.code}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="relative flex-1">
                                            <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                                required
                                                className={`w-full pl-9 pr-3 py-2.5 text-sm bg-[#0a1929] border rounded-lg focus:ring-2 transition outline-none ${phoneError && phone ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-white/10 focus:border-[#2effc3] focus:ring-[#2effc3]/20'
                                                    }`}
                                                placeholder="5550001234"
                                            />
                                        </div>
                                    </div>
                                    {phoneError && phone && (
                                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {phoneError}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium mb-1.5 text-gray-300">Password *</label>
                                    <div className="relative">
                                        <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={8}
                                            className="w-full pl-9 pr-11 py-2.5 text-sm bg-[#0a1929] border border-white/10 rounded-lg focus:border-[#2effc3] focus:ring-2 focus:ring-[#2effc3]/20 transition outline-none"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {password && (
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-gray-400">Password strength:</span>
                                                <span className={`text-xs font-semibold ${passwordStrength.label === 'Weak' ? 'text-red-400' :
                                                    passwordStrength.label === 'Medium' ? 'text-yellow-400' :
                                                        'text-green-400'
                                                    }`}>
                                                    {passwordStrength.label}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${passwordStrength.color} transition-all duration-500 ease-out`}
                                                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Use 8+ characters, mix of uppercase, lowercase, numbers & symbols
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !!emailError || !!phoneError}
                                    className="w-full flex items-center justify-center gap-2 bg-[#2effc3] text-[#000d26] font-bold py-3 px-6 rounded-xl hover:bg-[#26ebb0] transition shadow-lg shadow-[#2effc3]/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {loading ? 'Creating account...' : 'Create account'}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-3 bg-[#03122f] text-gray-400">Or continue with</span>
                                </div>
                            </div>

                            <button
                                onClick={loginWithGoogle}
                                className="w-full flex items-center justify-center gap-2 bg-white text-[#000d26] font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition shadow-lg text-sm"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4 bg-white rounded-full p-0.5" />
                                Google
                            </button>

                            <div className="mt-6 text-center">
                                <p className="text-xs text-gray-400">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-[#2effc3] hover:underline font-semibold">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-4 flex-shrink-0">
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
