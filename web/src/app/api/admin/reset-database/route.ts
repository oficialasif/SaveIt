import { NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, getDocs, writeBatch } from 'firebase/firestore';

export async function GET() {
    try {
        const batch = writeBatch(db);
        let operationCount = 0;

        // 1. Delete all saved items
        const itemsSnapshot = await getDocs(collection(db, 'savedItems'));
        itemsSnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
            operationCount++;
        });

        // 2. Reset all users' stats
        const usersSnapshot = await getDocs(collection(db, 'users'));
        usersSnapshot.docs.forEach((doc) => {
            batch.update(doc.ref, { totalSavedCount: 0 });
            operationCount++;
        });

        if (operationCount > 0) {
            await batch.commit();
        }

        return NextResponse.json({
            success: true,
            message: `Database cleared. Deleted ${itemsSnapshot.size} items and reset ${usersSnapshot.size} users.`
        });

    } catch (error) {
        console.error('Error clearing database:', error);
        return NextResponse.json({ error: 'Failed to clear database' }, { status: 500 });
    }
}
