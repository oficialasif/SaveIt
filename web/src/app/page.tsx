"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Layers, Monitor, Calendar, MessageCircle, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

function HeroTerminal() {
  const [typedText, setTypedText] = React.useState("");
  const [showSaveButton, setShowSaveButton] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const animationRef = React.useRef<NodeJS.Timeout | null>(null);

  const fullText = "The best ideas often come at unexpected moments...";

  React.useEffect(() => {
    const runAnimation = () => {
      let currentIndex = 0;

      // Typing phase
      const typeInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setTypedText(fullText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);

          // Show save button after typing
          setTimeout(() => {
            setShowSaveButton(true);

            // Click save button
            setTimeout(() => {
              setIsSaving(true);

              // Reset after save animation
              setTimeout(() => {
                setTypedText("");
                setShowSaveButton(false);
                setIsSaving(false);

                // Restart animation
                animationRef.current = setTimeout(runAnimation, 1000);
              }, 2000);
            }, 1500);
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
    <div className="md:w-1/2">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative"
      >
        {/* Terminal UI */}
        <div className="rounded-xl bg-[#03122f] border border-white/10 p-4 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          {/* Terminal Header */}
          <div className="h-8 flex items-center justify-between mb-4 border-b border-white/5 pb-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="text-[10px] text-gray-500 font-mono">SaveIt Demo</div>
          </div>

          {/* Terminal Content */}
          <div className="space-y-4">
            <div className="min-h-[140px] p-4 bg-gradient-to-br from-[#0c1e35] to-[#050f1d] rounded border border-white/5 relative">
              <div className="text-sm text-gray-300 font-mono leading-relaxed">
                {typedText}
                <span className="inline-block w-2 h-4 bg-[#2effc3] ml-1 animate-pulse" />
              </div>

              {/* Save Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: showSaveButton ? 1 : 0,
                  scale: showSaveButton ? 1 : 0.8,
                }}
                className={`absolute bottom-3 right-3 px-4 py-2 rounded-lg font-bold text-xs transition-all ${isSaving
                  ? 'bg-green-500 text-white'
                  : 'bg-[#2effc3] text-[#000d26] hover:bg-[#26ebb0]'
                  }`}
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-3 h-3" /> Saved!
                  </span>
                ) : (
                  'Save to SaveIt'
                )}
              </motion.button>
            </div>

            {/* Saved Items Preview */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                animate={{ opacity: isSaving ? [0.3, 1, 0.3] : 0.3 }}
                transition={{ duration: 0.8 }}
                className="h-20 bg-[#0c1e35] rounded border border-white/5 p-2"
              >
                <div className="h-2 w-3/4 bg-white/5 rounded mb-1.5" />
                <div className="h-1.5 w-1/2 bg-white/5 rounded" />
              </motion.div>
              <div className="h-20 bg-[#0c1e35] rounded border border-white/5 p-2 opacity-30">
                <div className="h-2 w-3/4 bg-white/5 rounded mb-1.5" />
                <div className="h-1.5 w-1/2 bg-white/5 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#2effc3]/5 rounded-full blur-[80px]" />
      </motion.div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleFreePlanClick = () => {
    setModalMessage('You are already in free mode!');
    setIsModalOpen(true);
  };

  const handleProPlanClick = async () => {
    if (!user) {
      setModalMessage('Please login to upgrade to Pro');
      setIsModalOpen(true);
      return;
    }

    setIsUpgrading(true);
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
      setModalMessage('Failed to start checkout. Please try again.');
      setIsModalOpen(true);
      setIsUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000d26] text-white overflow-hidden font-sans selection:bg-[#2effc3] selection:text-[#000d26]">
      {/* Decorative Background Curves */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Bottom left curve (Gradient) */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-[#ff8e8e] via-[#bd67ff] to-[#2effc3] blur-[100px] opacity-20" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex justify-between items-center p-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#2effc3]" />
            <span>SaveIt</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <Link href="/how-it-works" className="hover:text-white transition-colors">How it Works</Link>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#extension" className="hover:text-white transition-colors">Extension</a>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <Link href="/dashboard" className="px-6 py-2.5 bg-[#2effc3] text-[#000d26] rounded-sm text-sm font-bold hover:bg-[#26ebb0] transition shadow-[0_0_20px_rgba(46,255,195,0.3)]">
              Dashboard
            </Link>
          ) : (
            <Link href="/register" className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-semibold hover:opacity-90 transition shadow-lg hover:shadow-xl">
              Get Started
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 text-left">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-[1.1] text-white">
              Where ideas <br />
              are saved <span className="text-[#2effc3]">instantly.</span>
            </motion.h1>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-start gap-4 mb-12">
              {/* Primary Button */}
              <button className="w-full sm:w-auto px-8 py-4 bg-[#2effc3] text-[#000d26] rounded-sm text-lg font-bold hover:bg-[#26ebb0] transition flex items-center justify-center gap-3">
                <Monitor className="w-5 h-5" />
                Download for Chrome
              </button>

              {/* Secondary Button */}
              <Link href="/how-it-works" className="w-full sm:w-auto px-8 py-4 bg-[#0a1929] border border-gray-700 text-white rounded-sm text-lg font-medium hover:bg-[#11223a] transition flex items-center justify-center gap-2">
                How it works
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-3 text-sm text-gray-400">
              <span className="w-1.5 h-1.5 bg-[#2effc3] rounded-full inline-block" />
              <p>SaveIt is the most intuitive bookmarking experience, built to keep you—and your research—in flow.</p>
            </motion.div>

          </motion.div>
        </div>

        {/* Hero Visual */}
        <HeroTerminal />
      </main>

      {/* Feature Strip */}
      <div id="features" className="py-20 border-t border-white/5 bg-[#000d26]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Flow State", desc: "Never break your concentration. Save with a single keystroke." },
              { title: "AI Powered", desc: "Automatic tagging and summarization of your saved content." },
              { title: "Team Sync", desc: "Share research collections with your team instantly." }
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#2effc3]" /> {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade Section */}
      <section id="pricing" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-medium mb-4">
              Choose your <span className="text-[#2effc3]">plan</span>
            </h2>
            <p className="text-gray-400 text-lg">Start free, scale as you grow.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div
              onClick={handleFreePlanClick}
              className="p-8 rounded-2xl bg-[#03122f] border border-white/10 hover:border-[#2effc3]/30 transition-all cursor-pointer"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {['10 saved items', 'Local storage only', 'Basic search', 'Community support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[#2effc3] flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="text-center text-sm text-gray-400">Click for details</div>
            </div>

            {/* Pro Plan */}
            <div
              onClick={isUpgrading ? undefined : handleProPlanClick}
              className={`p-8 rounded-2xl bg-gradient-to-br from-[#2effc3]/10 to-[#03122f] border-2 border-[#2effc3] relative hover:shadow-2xl hover:shadow-[#2effc3]/20 transition-all ${isUpgrading ? 'opacity-70' : 'cursor-pointer'}`}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2effc3] text-[#000d26] px-4 py-1 rounded-full text-xs font-bold">
                MOST POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">$3</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {['Unlimited saved items', 'Cloud sync across devices', 'AI-powered tagging', 'Priority support', 'Team collaboration', 'Advanced analytics'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[#2effc3] flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="text-center flex items-center justify-center gap-2 text-sm font-medium text-[#2effc3]">
                {isUpgrading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Click to {user ? 'upgrade now' : 'get started'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extension Section */}
      <section id="extension" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-medium mb-4">
              Get the <span className="text-[#2effc3]">Chrome Extension</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Save content from any website with a simple right-click. Available for Chrome and Edge browsers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#2effc3]/10 to-[#03122f] border-2 border-[#2effc3] rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-[#2effc3] rounded-2xl flex items-center justify-center">
              <svg className="w-12 h-12 text-[#000d26]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Install SaveIt Extension</h3>
            <p className="text-gray-400 mb-8">Free • Works on Chrome & Edge • Instant setup</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="px-8 py-4 bg-[#2effc3] text-[#000d26] rounded-xl font-bold hover:bg-[#26ebb0] transition shadow-lg shadow-[#2effc3]/20 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Add to Chrome
              </a>
              <Link
                href="/how-it-works"
                className="px-8 py-4 bg-[#0a1929] border border-gray-700 text-white rounded-xl font-medium hover:bg-[#11223a] transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <h2 className="text-3xl md:text-5xl font-medium mb-16 text-center">
            Loved by <span className="text-[#2effc3]">developers</span> worldwide.
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote: "SaveIt completely changed how I organize my research. The context menu integration is genius.",
                author: "Sarah Chen",
                role: "Senior Engineer @ TechFlow",
                avatar: "https://i.pravatar.cc/150?u=sarah"
              },
              {
                quote: "Finally, a bookmark manager that feels like a developer tool. Fast, keyboard-centric, and beautiful.",
                author: "Marcus Johnson",
                role: "Freelance Developer",
                avatar: "https://i.pravatar.cc/150?u=marcus"
              },
              {
                quote: "I use the sync feature daily to move snippets between my work laptop and personal rig. Flawless.",
                author: "Alex Rivera",
                role: "CTO @ StartupX",
                avatar: "https://i.pravatar.cc/150?u=alex"
              }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-xl bg-[#03122f] border border-white/5 relative group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2effc3] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full border-2 border-[#000d26]" />
                  <div>
                    <div className="font-bold text-white">{t.author}</div>
                    <div className="text-xs text-[#2effc3]">{t.role}</div>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#00091a] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <Layers className="w-6 h-6 text-[#2effc3]" />
                <span className="text-2xl font-bold">SaveIt</span>
              </Link>
              <p className="text-gray-400 max-w-sm mb-8">
                The knowledge base that moves at the speed of your thought.
                Capture, organize, and recall instantly.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-white">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><Link href="/how-it-works" className="hover:text-white transition">How it Works</Link></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#extension" className="hover:text-white transition">Extension</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-white">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2026 SaveIt. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#03122f] border border-white/20 rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#2effc3]/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-[#2effc3]" />
              </div>
              <p className="text-lg mb-6">{modalMessage}</p>
              {modalMessage.includes('login') && (
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 bg-[#2effc3] text-[#000d26] rounded-xl font-bold hover:bg-[#26ebb0] transition"
                >
                  Go to Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
