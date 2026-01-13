import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { LEMONSQUEEZY_CONFIG } from '@/lib/lemonsqueezy';

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get('x-signature');

        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
        }

        // Verify webhook signature
        const hmac = crypto.createHmac('sha256', LEMONSQUEEZY_CONFIG.webhookSecret);
        const digest = hmac.update(body).digest('hex');

        if (signature !== digest) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(body);
        const { meta, data } = event;

        // Handle subscription created or order created
        if (
            meta.event_name === 'subscription_created' ||
            meta.event_name === 'order_created'
        ) {
            const userId = data.attributes.first_order_item?.product_id
                ? event.meta.custom_data?.userId
                : null;

            if (userId) {
                // Update user to Pro in Firestore
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    isPro: true,
                    lemonSqueezyCustomerId: data.attributes.customer_id,
                    subscriptionId: data.id,
                    subscriptionStatus: 'active',
                    subscriptionEndsAt: data.attributes.renews_at || null,
                });

                console.log(`User ${userId} upgraded to Pro`);
            }
        }

        // Handle subscription cancelled
        if (meta.event_name === 'subscription_cancelled') {
            const customerId = data.attributes.customer_id;

            // Find user by customer ID and update status
            // Note: You'll need to query Firestore to find the user
            console.log(`Subscription cancelled for customer ${customerId}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
