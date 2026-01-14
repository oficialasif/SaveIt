import { NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            // Return default values if no userId provided
            return NextResponse.json({
                totalSavedCount: 0,
                isPro: false,
                message: 'Please sync your extension first to track lifetime saves'
            });
        }

        // Get user's totalSavedCount from Firestore
        const userDoc = await getDoc(doc(db, 'users', userId));

        if (!userDoc.exists()) {
            return NextResponse.json({
                totalSavedCount: 0,
                isPro: false
            });
        }

        const userData = userDoc.data();
        return NextResponse.json({
            totalSavedCount: userData.totalSavedCount || 0,
            isPro: userData.isPro || false
        });
    } catch (error) {
        console.error('Error getting user stats:', error);
        return NextResponse.json({
            totalSavedCount: 0,
            isPro: false,
            error: 'Server error'
        }, { status: 500 });
    }
}
