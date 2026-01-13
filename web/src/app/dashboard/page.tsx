"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Search, Grid, List as ListIcon, Layers, Sparkles, Copy, Trash2, ExternalLink, Calendar, Crown } from 'lucide-react';
import Link from 'next/link';
import UpgradeCard from '@/components/UpgradeCard';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1 }
};

export default function DashboardPage() {
    const { user, loading, logout, isPro } = useAuth();
    const router = useRouter();
    const [items, setItems] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) {
            console.log('Fetching items for user:', user.uid);
            fetchItems();
        }
    }, [user]);

    const fetchItems = async () => {
        if (!user) return;

        try {
            setFetching(true);
            const q = query(
                collection(db, "savedItems"),
                where("userId", "==", user.uid)
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort by timestamp (newest first)
            data.sort((a: any, b: any) => {
                const timeA = new Date(a.timestamp || a.syncedAt || 0).getTime();
                const timeB = new Date(b.timestamp || b.syncedAt || 0).getTime();
                return timeB - timeA;
            });

            console.log('Fetched items:', data.length);
            setItems(data);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setFetching(false);
        }
    };

    const filteredItems = items.filter(item => {
        return item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.url.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (loading || (fetching && user)) return (
        <div className="min-h-screen flex items-center justify-center bg-[#000d26]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-[#2effc3]/30 border-t-[#2effc3] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#2effc3]" />
                </div>
            </div>
        </div>
    );

    if (!user) return null;

    return (
        <div className="h-screen bg-[#000d26] text-white flex overflow-hidden">
            {/* Sidebar - Fixed */}
            <aside className="w-20 md:w-64 h-screen bg-[#03122f] border-r border-white/10 flex flex-col flex-shrink-0">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 p-4 mb-8 hover:opacity-80 transition">
                    <div className="w-10 h-10 bg-[#2effc3] rounded-xl flex items-center justify-center shadow-lg shadow-[#2effc3]/30">
                        <Layers className="text-[#000d26] w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold hidden md:block">SaveIt</span>
                </Link>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    <NavItem icon={<Grid />} label="Dashboard" active />
                    <NavItem icon={<Sparkles />} label="Favorites" />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button onClick={logout} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-900/20 text-red-400 transition group">
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden md:block font-medium">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content - Fixed header + Scrollable items */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Fixed Header Section */}
                <div className="flex-shrink-0 p-6 md:p-8 bg-[#000d26]">
                    {/* Welcome & Search */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                                Welcome back, <span className="text-[#2effc3]">{user.displayName?.split(' ')[0]}</span>
                                {isPro && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#2effc3] to-[#26ebb0] text-[#000d26] rounded-full text-sm font-bold">
                                        <Crown className="w-4 h-4" />
                                        Pro
                                    </span>
                                )}
                            </h1>
                            <p className="text-gray-400">Here's what you've saved recently.</p>
                        </div>

                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#2effc3] transition" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#03122f] border border-white/10 focus:border-[#2effc3] focus:ring-2 focus:ring-[#2effc3]/20 transition text-sm"
                            />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <StatCard label="Total Saved" value={items.length} />
                        <StatCard label="This Week" value="12" />
                        <div className="bg-gradient-to-br from-[#2effc3]/20 to-[#03122f] border-2 border-[#2effc3] rounded-2xl p-6 cursor-pointer hover:scale-[1.02] transition">
                            <div className="text-sm text-gray-400 mb-2">Upgrade</div>
                            <div className="font-bold text-lg text-[#2effc3]">Go Pro</div>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 p-1 bg-[#03122f] rounded-xl border border-white/10">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-[#2effc3] text-[#000d26]' : 'text-gray-400'}`}>
                                <Grid className="w-4 h-4" />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-[#2effc3] text-[#000d26]' : 'text-gray-400'}`}>
                                <ListIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <span className="text-sm text-gray-400">{filteredItems.length} items</span>
                    </div>
                </div>

                {/* Scrollable Items Area */}
                <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}
                    >
                        <AnimatePresence>
                            {!isPro && items.length >= 10 && (
                                <motion.div
                                    variants={itemVariants}
                                    className="col-span-full"
                                >
                                    <UpgradeCard />
                                </motion.div>
                            )}

                            {filteredItems.length === 0 ? (
                                <div className="col-span-full text-center py-20">
                                    <Layers className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                                    <p className="text-gray-400">No saved items yet</p>
                                    <p className="text-sm text-gray-500 mt-2">Install the Chrome extension to start saving</p>
                                </div>
                            ) : (
                                filteredItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        variants={itemVariants}
                                        className="group relative bg-[#03122f] border border-white/10 rounded-xl p-6 hover:border-[#2effc3] hover:shadow-lg hover:shadow-[#2effc3]/10 transition"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={`https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=32`}
                                                    alt=""
                                                    className="w-4 h-4"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                                />
                                                <span className="text-xs text-gray-400 truncate">{new URL(item.url).hostname}</span>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition flex gap-2">
                                                <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-[#2effc3]">
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-red-400">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <a href={item.url} target="_blank" rel="noreferrer">
                                            <h3 className="text-lg font-bold mb-2 group-hover:text-[#2effc3] transition line-clamp-2">{item.text}</h3>
                                        </a>

                                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(item.timestamp).toLocaleDateString()}
                                            </div>
                                            <a href={item.url} target="_blank" className="flex items-center gap-1 hover:text-[#2effc3]">
                                                <ExternalLink className="w-3 h-3" />
                                                Open
                                            </a>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition ${active ? 'bg-[#2effc3] text-[#000d26] font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            {React.cloneElement(icon, { className: 'w-5 h-5' })}
            <span className="hidden md:block">{label}</span>
        </button>
    );
}

function StatCard({ label, value }: { label: string, value: string | number }) {
    return (
        <div className="bg-[#03122f] p-6 rounded-2xl border border-white/10">
            <div className="text-gray-400 text-sm mb-2">{label}</div>
            <div className="text-3xl font-bold">{value}</div>
        </div>
    );
}
