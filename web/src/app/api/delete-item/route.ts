import { NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        const { itemId } = await request.json();

        if (!itemId) {
            return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
        }

        // Delete from Firestore
        await deleteDoc(doc(db, 'savedItems', itemId));

        console.log('✅ Deleted item from Firestore:', itemId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting item:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
