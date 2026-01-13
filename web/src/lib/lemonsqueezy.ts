import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

// Initialize LemonSqueezy with API key
if (process.env.LEMONSQUEEZY_API_KEY) {
    lemonSqueezySetup({
        apiKey: process.env.LEMONSQUEEZY_API_KEY,
        onError: (error) => console.error('LemonSqueezy Error:', error),
    });
}

export const LEMONSQUEEZY_CONFIG = {
    storeId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID || '',
    productId: process.env.LEMONSQUEEZY_PRODUCT_ID || '',
    variantId: process.env.LEMONSQUEEZY_VARIANT_ID || '',
    webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '',
};
