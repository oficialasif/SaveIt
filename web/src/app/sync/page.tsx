"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function SyncPage() {
    const { user, loading } = useAuth();
    const [status, setStatus] = useState('Waiting for extension data... (Please keep this tab open)');

    useEffect(() => {
        console.log('Sync page mounted, waiting for extension data...');
        console.log('Current user:', user?.email || 'Not logged in');

        const handleMessage = async (event: MessageEvent) => {
            console.log('Message received from origin:', event.origin);
            console.log('Message data:', event.data);
            console.log('Message type:', typeof event.data, event.data?.type);

            // Check if it's our SYNC_DATA message
            if (event.data && typeof event.data === 'object') {
                console.log('Has type property:', event.data.type);
                console.log('Has items property:', event.data.items);

                if (event.data.type === 'SYNC_DATA' && Array.isArray(event.data.items)) {
                    console.log('✅ Valid SYNC_DATA message with', event.data.items.length, 'items');

                    if (!user) {
                        console.log('❌ User not logged in');
                        setStatus('Please login to SaveIt first, then try syncing again.');
                        return;
                    }

                    setStatus(`Syncing ${event.data.items.length} items to cloud...`);
                    const items = event.data.items;
                    let count = 0;

                    try {
                        for (const item of items) {
                            await addDoc(collection(db, "savedItems"), {
                                text: item.text,
                                url: item.url,
                                title: item.title,
                                timestamp: item.timestamp,
                                userId: user.uid,
                                syncedAt: new Date().toISOString()
                            });
                            count++;
                            setStatus(`Syncing... ${count}/${items.length}`);
                        }

                        setStatus(`✅ Successfully synced ${count} items! Redirecting to dashboard...`);
                        console.log('✅ Sync complete!');

                        // Redirect to dashboard after 2 seconds
                        setTimeout(() => {
                            window.location.href = '/dashboard';
                        }, 2000);
                    } catch (error) {
                        console.error("❌ Sync error:", error);
                        setStatus('Error syncing items. Please try again.');
                    }
                } else {
                    console.log('⚠️ Message not recognized as SYNC_DATA');
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [user]);

    if (loading) return <div className="p-8">Loading auth status...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#000d26]">
            <div className="bg-[#03122f] border border-white/20 p-8 rounded-lg shadow-md text-center max-w-md">
                <h1 className="text-xl font-bold mb-4 text-white">SaveIt Sync</h1>
                <p className="text-gray-300 animate-pulse mb-4">{status}</p>
                {!user && <p className="text-sm text-yellow-400 mt-4">⚠️ Please login first</p>}
                <p className="text-xs text-gray-400 mt-6">Listening for extension...</p>
            </div>
        </div>
    );
}
