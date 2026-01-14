"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { LogIn, X } from 'lucide-react';

export default function SyncPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState('Waiting for extension data... (Please keep this tab open)');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [pendingSyncData, setPendingSyncData] = useState<any[] | null>(null);

    useEffect(() => {
        console.log('🚀 Sync page mounted at:', new Date().toISOString());
        console.log('👤 Current user:', user?.email || 'Not logged in');
        console.log('🔑 User ID:', user?.uid || 'N/A');
        console.log('👂 Listening for window.postMessage events...');

        // Check if there's pending sync data from sessionStorage (after login redirect)
        const storedSyncData = sessionStorage.getItem('pendingSyncData');
        if (storedSyncData && user) {
            console.log('🔄 Found pending sync data from previous session, resuming sync...');
            const items = JSON.parse(storedSyncData);
            sessionStorage.removeItem('pendingSyncData');
            handleSync(items);
            return; // Don't set up timeout if we're syncing
        }

        // Auto-redirect to dashboard if logged in but no sync data after 3 seconds
        let redirectTimeout: NodeJS.Timeout | null = null;
        if (user) {
            redirectTimeout = setTimeout(() => {
                console.log('⏱️ No sync data received, redirecting to dashboard...');
                router.push('/dashboard');
            }, 3000);
        }

        const handleMessage = async (event: MessageEvent) => {
            console.log('📨 Message received!');
            console.log('  Origin:', event.origin);
            console.log('  Data type:', typeof event.data);
            console.log('  Data:', event.data);

            // Check if it's our SYNC_DATA message
            if (event.data && typeof event.data === 'object') {
                console.log('  ✓ Data is an object');
                console.log('  Message type:', event.data.type);
                console.log('  Items:', event.data.items ? `${event.data.items.length} items` : 'no items');

                if (event.data.type === 'SYNC_DATA' && Array.isArray(event.data.items)) {
                    console.log('✅ Valid SYNC_DATA message with', event.data.items.length, 'items');

                    // Cancel redirect timeout since we got sync data
                    if (redirectTimeout) {
                        clearTimeout(redirectTimeout);
                        redirectTimeout = null;
                    }

                    if (!user) {
                        console.error('❌ User not logged in - showing login modal');
                        setPendingSyncData(event.data.items);
                        setShowLoginModal(true);
                        setStatus('⚠️ Please login to sync your data');
                        return;
                    }

                    await handleSync(event.data.items);
                } else {
                    console.log('⚠️ Message not recognized as SYNC_DATA');
                    console.log('  Expected: type="SYNC_DATA" with items array');
                    console.log('  Got type:', event.data.type);
                    console.log('  Got items:', event.data.items);
                }
            } else {
                console.log('⚠️ Message data is not an object, ignoring');
            }
        };

        window.addEventListener('message', handleMessage);
        console.log('✅ Message listener registered');

        return () => {
            console.log('🧹 Cleaning up message listener');
            if (redirectTimeout) {
                clearTimeout(redirectTimeout);
            }
            window.removeEventListener('message', handleMessage);
        };
    }, [user]);

    const handleSync = async (items: any[]) => {
        if (!user) {
            console.error('❌ Cannot sync without user');
            return;
        }

        console.log('🔄 Starting sync process...');
        setStatus(`Syncing ${items.length} items to cloud...`);

        // Get user document to check totalSavedCount
        const { doc, getDoc, updateDoc } = await import('firebase/firestore');
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        const currentTotalCount = userData?.totalSavedCount || 0;
        const isPro = userData?.isPro || false;

        console.log(`📊 Current totalSavedCount: ${currentTotalCount}, isPro: ${isPro}`);

        // Check if user has reached the limit
        if (!isPro && currentTotalCount >= 10) {
            console.error('❌ User has reached free limit of 10 items');
            setStatus('❌ You have reached the free limit of 10 items');
            setPendingSyncData(items);
            setShowLoginModal(false); // Close login modal if open

            // Show upgrade prompt after a brief delay
            setTimeout(() => {
                alert('You have reached the limit of 10 saved items on the free plan. Please upgrade to Pro to save more!');
                router.push('/dashboard');
            }, 1000);
            return;
        }

        let count = 0;
        const syncedItemsMap: { [key: string]: string } = {}; // extensionId -> firestoreId

        try {
            for (const item of items) {
                console.log(`  Syncing item ${count + 1}/${items.length}:`, item.text.substring(0, 50) + '...');

                const docRef = await addDoc(collection(db, "savedItems"), {
                    text: item.text,
                    url: item.url,
                    title: item.title,
                    timestamp: item.timestamp,
                    userId: user.uid,
                    syncedAt: new Date().toISOString()
                });

                // Store mapping of extension ID to Firestore ID
                if (item.id) {
                    syncedItemsMap[item.id] = docRef.id;
                }

                count++;
                setStatus(`Syncing... ${count}/${items.length}`);
            }

            // Increment totalSavedCount by the number of synced items
            const newTotalCount = currentTotalCount + count;
            await updateDoc(userDocRef, {
                totalSavedCount: newTotalCount
            });
            console.log(`📈 Updated totalSavedCount: ${currentTotalCount} → ${newTotalCount}`);

            // Send Firestore IDs and userId back to extension
            window.postMessage({
                type: 'SYNC_COMPLETE',
                syncedItems: syncedItemsMap,
                userId: user.uid,
                totalSavedCount: newTotalCount,
                isPro: isPro
            }, '*');
            console.log('📤 Sent sync data back to extension');

            setStatus(`✅ Successfully synced ${count} items! Redirecting to dashboard...`);
            console.log('✅ Sync complete! Synced', count, 'items to Firestore');

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                console.log('🔄 Redirecting to dashboard...');
                router.push('/dashboard');
            }, 2000);
        } catch (error) {
            console.error("❌ Sync error:", error);
            setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleLoginClick = () => {
        if (pendingSyncData) {
            // Store sync data in sessionStorage before redirecting
            sessionStorage.setItem('pendingSyncData', JSON.stringify(pendingSyncData));
            console.log('💾 Stored pending sync data in sessionStorage');
        }
        console.log('🔄 Redirecting to login page...');
        router.push('/login?returnTo=/sync');
    };

    if (loading) return <div className="p-8 text-white">Loading auth status...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#000d26]">
            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#03122f] border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-[#2effc3]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogIn className="w-8 h-8 text-[#2effc3]" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
                            <p className="text-gray-400">
                                You need to login to sync your {pendingSyncData?.length || 0} saved items to the cloud.
                            </p>
                        </div>

                        <button
                            onClick={handleLoginClick}
                            className="w-full bg-[#2effc3] text-[#000d26] font-bold py-3.5 px-6 rounded-xl hover:bg-[#26ebb0] transition shadow-lg shadow-[#2effc3]/20 flex items-center justify-center gap-2"
                        >
                            <LogIn className="w-5 h-5" />
                            Login to Sync
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Your data will be saved and synced after you login
                        </p>
                    </div>
                </div>
            )}

            {/* Main Sync Status */}
            <div className="bg-[#03122f] border border-white/20 p-8 rounded-lg shadow-md text-center max-w-md">
                <h1 className="text-xl font-bold mb-4 text-white">SaveIt Sync</h1>
                <p className="text-gray-300 animate-pulse mb-4">{status}</p>

                {!user && !showLoginModal && (
                    <div className="mt-6">
                        <p className="text-sm text-yellow-400 mb-4">⚠️ Please login first</p>
                        <button
                            onClick={() => router.push('/login?returnTo=/sync')}
                            className="bg-[#2effc3] text-[#000d26] font-bold py-2.5 px-6 rounded-lg hover:bg-[#26ebb0] transition shadow-lg shadow-[#2effc3]/20 flex items-center justify-center gap-2 mx-auto"
                        >
                            <LogIn className="w-4 h-4" />
                            Login Now
                        </button>
                    </div>
                )}

                <p className="text-xs text-gray-400 mt-6">Listening for extension...</p>
            </div>
        </div>
    );
}
