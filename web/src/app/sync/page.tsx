"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function SyncPage() {
    const { user, loading } = useAuth();
    const [status, setStatus] = useState('Waiting for extension data... (Please keep this tab open)');

    useEffect(() => {
        const handleMessage = async (event: MessageEvent) => {
            // Basic security: In production, check event.origin
            if (event.data && event.data.type === 'SYNC_DATA' && event.data.items) {
                if (!user) {
                    setStatus('Please login to SaveIt in another tab, then try syncing again.');
                    return;
                }

                setStatus('Syncing items to cloud...');
                const items = event.data.items;
                let count = 0;

                try {
                    const batchPromises = items.map(async (item: any) => {
                        // Basic deduplication could go here (check if ID exists)
                        // For MVP, just add new docs
                        await addDoc(collection(db, "savedItems"), {
                            ...item,
                            userId: user.uid,
                            syncedAt: new Date().toISOString()
                        });
                        count++;
                    });

                    await Promise.all(batchPromises);
                    setStatus(`Successfully synced ${count} items! You can now close this tab.`);
                } catch (error) {
                    console.error("Sync error:", error);
                    setStatus('Error syncing items. Check console.');
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [user]);

    if (loading) return <div className="p-8">Loading auth status...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                <h1 className="text-xl font-bold mb-4">SaveIt Sync</h1>
                <p className="text-gray-600 animate-pulse">{status}</p>
                <p className="text-xs text-gray-400 mt-6">Listening for extension...</p>
            </div>
        </div>
    );
}
