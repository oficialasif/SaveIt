# SaveIt - Complete Bookmark Manager

Save anything from anywhere. Your personal knowledge base powered by AI.

🌐 **Live Site**: https://saveit-nu.vercel.app/

## 🚀 Quick Start

### Web Application
```bash
cd web
npm install
npm run dev
```

### Chrome Extension
1. Open Chrome → Extensions → Enable Developer Mode
2. Click "Load unpacked"
3. Select the `extension` folder

## 📦 Project Structure

```
saveit/
├── web/                    # Next.js web application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth & other contexts
│   │   └── lib/          # Utilities & config
│   └── package.json
├── extension/             # Chrome extension
│   ├── manifest.json
│   ├── popup.html
│   ├── background.js
│   └── content.js
└── README.md
```

## 🛠️ Tech Stack

**Web App:**
- Next.js 15 (App Router)
- React 19
- Firebase (Auth & Firestore)
- Tailwind CSS
- Framer Motion
- LemonSqueezy (Payments)

**Extension:**
- Vanilla JavaScript
- Chrome Extension APIs
- Firebase integration

## 💎 Features

- ✅ Save text, links, images from any website
- ✅ Google & Email/Password authentication
- ✅ Cloud sync across devices
- ✅ Beautiful dashboard with search
- ✅ Free (10 items) & Pro ($3/month) plans
- ✅ Chrome extension integration
- ✅ Responsive premium UI

## 🔧 Setup

### 1. Firebase Configuration
Create `web/.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. LemonSqueezy (Optional - for Pro subscriptions)
Add to `web/.env.local`:
```env
NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID=your_store_id
LEMONSQUEEZY_API_KEY=your_api_key
LEMONSQUEEZY_PRODUCT_ID=your_product_id
LEMONSQUEEZY_VARIANT_ID=your_variant_id
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See `LEMONSQUEEZY_SETUP.md` for detailed payment setup.

### 3. Firestore Security Rules
Deploy rules from `firestore.rules`:
```bash
firebase deploy --only firestore:rules
```

## 🚢 Deployment

### Web App (Vercel)
```bash
cd web
npm run build
# Deploy to Vercel
```

### Chrome Extension
```bash
# Zip the extension folder
# Upload to Chrome Web Store
```

## 📚 Documentation

- [LemonSqueezy Setup](./LEMONSQUEEZY_SETUP.md) - Payment integration guide
- [Requirements](./reuirement.md) - Project requirements
- [Firebase Key](./firebase%20key.md) - Firebase configuration

## 🎨 Design

- Mint Green (#2effc3) theme
- Dark mode UI
- Glassmorphism effects
- Smooth animations
- Desktop-optimized

## 📝 License

MIT

## 👨‍💻 Author

**Asif Mahmud**
- GitHub: [@oficialasif](https://github.com/oficialasif)

---

Built with ❤️ using Next.js & Firebase
