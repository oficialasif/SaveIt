import { NextRequest, NextResponse } from 'next/server';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { LEMONSQUEEZY_CONFIG } from '@/lib/lemonsqueezy';

export async function POST(req: NextRequest) {
    try {
        const { email, userId, name } = await req.json();

        if (!email || !userId) {
            return NextResponse.json(
                { error: 'Email and userId are required' },
                { status: 400 }
            );
        }

        // Create checkout session
        const checkout = await createCheckout(
            LEMONSQUEEZY_CONFIG.storeId,
            LEMONSQUEEZY_CONFIG.variantId,
            {
                checkoutData: {
                    email,
                    name,
                    custom: {
                        userId,
                    },
                },
                productOptions: {
                    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
                },
            }
        );

        if (!checkout.data) {
            throw new Error('Failed to create checkout');
        }

        return NextResponse.json({
            checkoutUrl: checkout.data.data.attributes.url
        });
    } catch (error: any) {
        console.error('Checkout creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout' },
            { status: 500 }
        );
    }
}
