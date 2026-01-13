# SaveIt Chrome Extension - Installation & Testing Guide

## 🚀 Quick Installation

### Step 1: Open Chrome Extensions Page
1. Open Google Chrome
2. Type in address bar: `chrome://extensions`
3. Press Enter

### Step 2: Enable Developer Mode
1. Look for "Developer mode" toggle in top-right corner
2. Click to enable it
3. New buttons will appear: "Load unpacked", "Pack extension", etc.

### Step 3: Load the Extension
1. Click **"Load unpacked"** button
2. Navigate to your SaveIt folder
3. Select the **`extension`** folder (the one containing `manifest.json`)
4. Click **"Select Folder"**

### Step 4: Verify Installation
You should see:
- ✅ SaveIt extension card with mint green icon
- ✅ Extension appears in Chrome toolbar
- ✅ No errors in the card

---

## 🧪 Testing the Extension

### Test 1: Save Text from Any Website

1. **Go to any website** (e.g., Wikipedia, news site)
2. **Select some text** with your mouse
3. **Right-click** on the selected text
4. Click **"Save to SaveIt"** in the context menu
5. **Look for confirmation:**
   - Extension badge shows "OK" for 2 seconds
   - Badge disappears after confirmation

### Test 2: View Saved Items

1. **Click the SaveIt icon** in Chrome toolbar
2. **Popup should open** with:
   - Mint green header with logo
   - "SaveIt" title
   - "Sync" button
   - Your saved item(s) listed
3. **Verify item display:**
   - Text you saved shows
   - Website domain shown below
   - Date saved displayed

### Test 3: Open Saved URL

1. **Click on any saved item** in the popup
2. **New tab opens** with the original website
3. Confirms click navigation works

### Test 4: Free Plan Limit

1. **Save 10 different text selections** (from any sites)
2. **Check usage bar** in popup:
   - Should show "10/10 saved items"
   - Progress bar at 100%
3. **Try to save an 11th item:**
   - Extension badge shows "MAX"
   - Item is NOT saved (limit enforced)
   - See "Upgrade to Pro" message

### Test 5: Sync to Web App

1. **Click "Sync" button** in extension popup
2. **New tab opens:** `https://saveit-nu.vercel.app/sync`
3. **Your items transfer** to the web dashboard
4. **Login if needed** (Google or Email)
5. **Items appear** in your online account

---

## 🎨 Visual Checklist

**Extension should look like:**
- ✅ Dark navy background (#000d26)
- ✅ Mint green accents (#2effc3)
- ✅ Layers icon in header
- ✅ Glass-effect cards
- ✅ Smooth animations on hover
- ✅ Custom mint green scrollbar

---

## 🐛 Troubleshooting

### Extension Not Appearing?
- Check you selected the `extension` folder (not the root `saveit` folder)
- Refresh the extensions page: `chrome://extensions`
- Look for errors in the extension card

### "Save to SaveIt" Not in Context Menu?
- Make sure you're selecting text first
- Try reloading the extension
- Check extension permissions are enabled

### Badge Shows "MAX"?
- You've reached the 10-item free limit
- Click "Sync" to move items to web app
- Or upgrade to Pro for unlimited saves

### Sync Not Working?
- Check your internet connection
- Verify Vercel site is accessible: https://saveit-nu.vercel.app
- Open browser console (F12) for error messages

---

## 📊 Expected Behavior

| Action | Expected Result |
|--------|----------------|
| Select text + Right-click | "Save to SaveIt" appears |
| Click "Save to SaveIt" | Badge shows "OK", item saved |
| Open popup | Shows saved items |
| Click saved item | Opens original URL |
| Save 10 items | Shows 10/10, bar full |
| Save 11th item | Badge "MAX", not saved |
| Click "Sync" | Opens web app, transfers items |

---

## 🎯 Demo Workflow

**Complete Demo (2 minutes):**

1. Open Twitter/X or any blog
2. Select an interesting quote
3. Right-click → "Save to SaveIt"
4. See "OK" badge
5. Open Reddit or StackOverflow
6. Select a useful answer
7. Right-click → "Save to SaveIt"
8. Click extension icon
9. See both items listed
10. Click "Sync"
11. Login to web app
12. View items in beautiful dashboard!

---

## 🚀 Next Steps

**After Testing:**
- ✅ Extension works perfectly
- ✅ Syncs with Vercel deployment
- ✅ Ready for Chrome Web Store submission!

**Optional Enhancements:**
- Generate proper icon files (16x16, 48x48, 128x128)
- Add keyboard shortcut (Ctrl+Shift+S)
- Highlight saved text on pages
- Add export functionality

---

## 📸 Visual Guide

**Step 1: Enable Developer Mode**
```
┌─────────────────────────────────────┐
│ Extensions                          │
│                     Developer mode  │
│                            [ON] ←── │
└─────────────────────────────────────┘
```

**Step 2: Load Unpacked**
```
┌─────────────────────────────────────┐
│ [Load unpacked] [Pack extension]   │
│        ↑                            │
│     Click here                      │
└─────────────────────────────────────┘
```

**Step 3: Right-Click Menu**
```
┌─────────────────────────┐
│ Copy                    │
│ Cut                     │
│ Paste                   │
│ ─────────────────────── │
│ ★ Save to SaveIt    ←── │
│ Search with Google      │
└─────────────────────────┘
```

Your extension is ready to use! 🎉
