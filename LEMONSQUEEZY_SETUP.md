# LemonSqueezy Setup Instructions for SaveIt

## Step 1: Create LemonSqueezy Account
1. Sign up at https://lemonsqueezy.com
2. Complete your store setup

## Step 2: Create Product
1. Go to Products → New Product
2. Name: **SaveIt Pro**
3. Price: **$3/month** (recurring)
4. Description: "Unlock unlimited"unlimited saves, cloud sync, and premium features"

## Step 3: Get Your API Keys
Copy these values to your `.env.local` file:

### Store ID
- Go to Settings → Store
- Copy your Store ID

### API Key
- Go to Settings → API
- Create new API key
- Copy the key (starts with `lmk_`)

### Product & Variant IDs
- Go to your "SaveIt Pro" product
- Copy Product ID from URL
- Copy Variant ID (default variant)

### Webhook Secret
- Go to Settings → Webhooks
- Create new webhook
- URL: `https://yourdomain.com/api/webhook`
- Events: Select `order_created`, `subscription_created`, `subscription_cancelled`
- Copy the Signing Secret

## Step 4: Add to .env.local
```
NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_API_KEY=lmk_xxxxxxxxxxxxxxxx
LEMONSQUEEZY_PRODUCT_ID=67890
LEMONSQUEEZY_VARIANT_ID=11111
LEMONSQUEEZY_WEBHOOK_SECRET=xxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Connect Payoneer
1. Go to Settings → Payouts
2. Click "Connect Payoneer"
3. Follow the steps to link your account
4. Set payout schedule (weekly/monthly)

## Testing
Use test mode for development:
- Card: 4242 4242 4242 4242
- Any CVV, future expiry

## Go Live
1. Switch from Test to Live mode in LemonSqueezy
2. Update webhook URL to production domain
3. Update NEXT_PUBLIC_APP_URL to production URL
