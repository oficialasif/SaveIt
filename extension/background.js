// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-to-saveit",
    title: "Save to SaveIt",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-to-saveit" && info.selectionText) {
    saveItem(info.selectionText, tab.url, tab.title);
  }
});

// Save content to local storage
async function saveItem(text, url, title) {
  console.log("Attempting to save item...");
  
  const newItem = {
    id: Date.now().toString(),
    text: text,
    url: url,
    title: title || "Untitled Page",
    timestamp: new Date().toISOString()
  };

  // Get userId from storage and check Firestore limit
  chrome.storage.local.get(['userId', 'totalSavedCount', 'isPro'], async (cached) => {
    let canSave = true;
    let totalCount = cached.totalSavedCount || 0;
    let isPro = cached.isPro || false;
    
    // If we have a userId, check the real limit from Firestore
    if (cached.userId) {
      try {
        const response = await fetch('http://localhost:3000/api/user-stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: cached.userId })
        });
        
        if (response.ok) {
          const data = await response.json();
          totalCount = data.totalSavedCount || 0;
          isPro = data.isPro || false;
          
          // Update cached values
          chrome.storage.local.set({ 
            totalSavedCount: totalCount,
            isPro: isPro 
          });
          
          // Check if user has reached lifetime limit
          if (!isPro && totalCount >= 10) {
            console.log('❌ User has reached lifetime limit of 10 saves');
            chrome.action.setBadgeText({ text: "MAX" });
            chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
            
            // Show notification
            chrome.notifications.create({
              type: 'basic',
              iconUrl: 'icons/icon128.png',
              title: 'SaveIt - Upgrade Required',
              message: `You've used all 10 free saves. Upgrade to Pro for unlimited saves!`,
              buttons: [{ title: 'Upgrade Now' }]
            });
            
            // Open dashboard with upgrade section
            chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
            
            canSave = false;
            return;
          }
        }
      } catch (error) {
        console.log('ℹ️ Could not verify limit, checking cached values');
        // Fall back to cached count check
        if (!isPro && totalCount >= 10) {
          console.log('❌ Cached limit check: User has reached limit');
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'SaveIt - Upgrade Required',
            message: 'You have reached the free limit. Upgrade to Pro!'
          });
          chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
          canSave = false;
          return;
        }
      }
    } else {
      // No userId - user needs to sync first
      console.log('⚠️ No userId found. Please sync your extension first.');
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'SaveIt - Sync Required',
        message: 'Please click "Sync" in the extension popup to track your lifetime saves!'
      });
      // Still allow save for now, but encourage sync
    }
    
    if (!canSave) {
      console.log('❌ Save blocked - limit reached');
      return;
    }
    
    // Proceed with save
    chrome.storage.local.get(["savedItems"], (result) => {
      const items = result.savedItems || [];
      items.unshift(newItem); 
      
      chrome.storage.local.set({ savedItems: items }, () => {
        console.log("✅ Item saved:", newItem.text.substring(0, 30) + '...');
        chrome.action.setBadgeText({ text: "OK" });
        setTimeout(() => chrome.action.setBadgeText({ text: "" }), 2000);
      });
    });
  });
}

// Handle messages from popup (e.g., sync requests)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Background received message:', message);
  
  if (message.action === 'PERFORM_SYNC') {
    console.log(`🔄 Starting sync process with ${message.items.length} items`);
    
    const syncUrl = 'http://localhost:3000/sync';
    console.log(`🌐 Opening sync page: ${syncUrl}`);
    
    // Create tab and wait for it to fully load
    chrome.tabs.create({ url: syncUrl }, (tab) => {
      console.log(`📄 Tab created with ID: ${tab.id}`);
      
      // Listen for tab updates
      const listener = (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          console.log("✅ Sync page loaded, sending message...");
          
          // Remove listener once page is loaded
          chrome.tabs.onUpdated.removeListener(listener);
          
          // Wait a bit more to ensure content script is injected and ready
          setTimeout(() => {
            console.log(`📤 Sending message to tab ${tab.id} with ${message.items.length} items`);
            
            chrome.tabs.sendMessage(
              tab.id,
              {
                type: 'SYNC_DATA',
                items: message.items
              },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error('❌ Error sending message:', chrome.runtime.lastError.message);
                  sendResponse({ success: false, error: chrome.runtime.lastError.message });
                } else {
                  console.log('✅ Message sent successfully, response:', response);
                  sendResponse({ success: true });
                }
              }
            );
          }, 1500); // Wait 1.5 seconds after page loads
        }
      };
      
      chrome.tabs.onUpdated.addListener(listener);
    });
    
    return true; // Keep message channel open for async response
  }
  
  // Handle item deletion from dashboard
  if (message.action === 'DELETE_ITEM') {
    console.log(`🗑️ Deleting item from extension storage: ${message.itemId}`);
    
    chrome.storage.local.get(['savedItems'], (result) => {
      const items = result.savedItems || [];
      // Remove item by ID
      const updatedItems = items.filter(item => item.id !== message.itemId);
      
      chrome.storage.local.set({ savedItems: updatedItems }, () => {
        console.log(`✅ Item deleted from extension storage. Remaining: ${updatedItems.length}`);
        sendResponse({ success: true, remainingCount: updatedItems.length });
      });
    });
    
    return true; // Keep message channel open for async response
  }
  
  // Handle sync completion with Firestore IDs
  if (message.type === 'SYNC_COMPLETE' && message.syncedItems) {
    console.log('📥 Received sync complete with Firestore IDs and user data');
    
    chrome.storage.local.get(['savedItems'], (result) => {
      const items = result.savedItems || [];
      
      // Update items with their Firestore IDs
      const updatedItems = items.map(item => {
        if (message.syncedItems[item.id]) {
          return {
            ...item,
            firestoreId: message.syncedItems[item.id]
          };
        }
        return item;
      });
      
      // Store items, userId, and user stats
      chrome.storage.local.set({ 
        savedItems: updatedItems,
        userId: message.userId,
        totalSavedCount: message.totalSavedCount,
        isPro: message.isPro
      }, () => {
        console.log('✅ Updated items with Firestore IDs and stored user stats');
        console.log(`   User ID: ${message.userId}`);
        console.log(`   Total Saved Count: ${message.totalSavedCount}`);
        console.log(`   Is Pro: ${message.isPro}`);
        sendResponse({ success: true });
      });
    });
    
    return true;
  }
});
