import { NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        const { itemIds } = await request.json();

        if (!itemIds || !Array.isArray(itemIds)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        // Query Firestore to check which items still exist
        const existingIds: string[] = [];

        // Batch check in groups of 10 to avoid "IN" query limits
        const batchSize = 10;
        for (let i = 0; i < itemIds.length; i += batchSize) {
            const batch = itemIds.slice(i, i + batchSize);
            const q = query(
                collection(db, 'savedItems'),
                where('__name__', 'in', batch)
            );

            const snapshot = await getDocs(q);
            snapshot.forEach(doc => {
                existingIds.push(doc.id);
            });
        }

        return NextResponse.json({ existingIds });
    } catch (error) {
        console.error('Error checking items:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
