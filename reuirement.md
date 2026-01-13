SaveIt helps you save important content from any website in one click. Simply select text on a webpage, right-click, and choose “Save to SaveIt.” The content is instantly stored with the source link and time. Open the SaveIt extension to view your saved items anytime. If you create a free account, your saved content syncs to the SaveIt web dashboard, where you can organize, search, and manage everything in one place. SaveIt works in the background using your browser and cloud storage, making research, study, and content collection fast, simple, and organized.


# Project Name: SaveIt
## Type: Chrome Extension + SaaS Web Application
## Goal: Save web content instantly via Chrome Extension and manage it via a SaaS dashboard.
## Constraint: No paid services, use free-tier tools only.

---

## GLOBAL RULES (VERY IMPORTANT)
1. Do NOT generate everything at once.
2. Build the project STEP BY STEP.
3. Assume the project folder already exists.
4. Only create files when instructed.
5. Do NOT explain theory unless asked.
6. Write clean, production-ready code.
7. Use only FREE tools and libraries.
8. Do NOT install unnecessary dependencies.

---

## TECH STACK
### Chrome Extension
- Manifest V3
- Vanilla JavaScript
- Chrome APIs (storage, contextMenus)
- Local Storage first

### SaaS Dashboard
- Next js
- Firebase Authentication (Email + Google)
- Firestore Database
- Tailwind CSS


---

## FOLDER STRUCTURE (CREATE EXACTLY THIS)

saveit/
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   └── icons/
│
├── web/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md

---

# PHASE 1: CHROME EXTENSION (MVP)

## STEP 1: manifest.json
Create `extension/manifest.json`
- Manifest Version 3
- Permissions:
  - storage
  - contextMenus
  - activeTab
- Add extension name: "SaveIt – Web Content Saver"
- Version: 1.0.0

---

## STEP 2: Background Script
Create `extension/background.js`
### Features:
- Create right-click context menu
- Menu text: "Save to SaveIt"
- Trigger only on text selection
- Save:
  - selected text
  - page URL
  - timestamp
- Store data in chrome.storage.local

---

## STEP 3: Popup UI
Create:
- `popup.html`
- `popup.js`

### UI Requirements:
- Title: SaveIt
- List saved items (latest first)
- Truncate long text
- Show source URL

---

## STEP 4: Content Script
Create `content.js`
- Prepare for future expansion
- No heavy logic in MVP

---

## STEP 5: Basic Styling
- Simple, clean popup design
- No external UI library

---

# PHASE 2: SAAS DASHBOARD (WEB APP)

## STEP 6: React App Setup
Inside `/web`:
- Initialize React app
- Use Tailwind CSS
- Clean folder structure

---

## STEP 7: Firebase Setup
Integrate Firebase:
- Authentication:
  - Email/Password
  - Google Login
- Firestore Database

Create `firebase.js` with config placeholders.

---

## STEP 8: Auth Pages
Create:
- Login page
- Register page

Features:
- Email login
- Google login
- Redirect after login

---

## STEP 9: Dashboard UI
Create Dashboard page:
- Display saved content list
- Fields:
  - Text
  - Source URL
  - Date
- Folder and tag UI (visual only in MVP)

---

## STEP 10: Extension → Cloud Sync (Phase 2)
- Add optional "Sync" button in extension popup
- Sync local data to Firestore when user is logged in
- Use Firebase REST or background messaging

---

# PHASE 3: MONETIZATION READY

## STEP 11: Plan Logic
### Free Plan:
- Max 10 saved items
- Local storage only / firestore

### Pro Plan:
- Unlimited saves
- Cloud sync
- Export (future)

---

## STEP 12: Upgrade Prompt UI
- Show upgrade banner when limit reached
- Redirect to SaaS pricing page

---

# PHASE 4: DEPLOYMENT

## STEP 14: Chrome Extension Packaging
- Validate Manifest V3
- Prepare extension zip
- Add placeholder icons

---

# PHASE 5: QUALITY RULES
- Clean code
- Meaningful variable names
- No console errors
- Mobile-friendly dashboard
- Fast performance

---

# FINAL OUTPUT EXPECTATION
- Fully working Chrome Extension MVP
- Functional SaaS dashboard
- Ready for Chrome Web Store & public users



Start from PHASE 1, STEP 1