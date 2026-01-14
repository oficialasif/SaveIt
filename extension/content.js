// SaveIt Content Script - Message Bridge
// This script runs in the page context and relays messages between the extension and the page

console.log("✅ SaveIt content script loaded on:", window.location.href);

// Listen for messages from the extension (popup or background)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📨 Content script received message from extension:", message);
    
    if (message.type === 'SYNC_DATA' && Array.isArray(message.items)) {
        console.log(`🔄 Relaying ${message.items.length} items to page context...`);
        
        // Forward the message to the page's JavaScript context
        window.postMessage({
            type: 'SYNC_DATA',
            items: message.items
        }, '*');
        
        console.log("✅ Message forwarded to page context");
        sendResponse({ success: true });
    } else {
        console.warn("⚠️ Unknown message type or invalid data:", message);
        sendResponse({ success: false, error: "Invalid message format" });
    }
    
    return true; // Keep the message channel open for async response
});

// Listen for messages from the page (sync completion with Firestore IDs)
window.addEventListener('message', (event) => {
    // Only accept messages from same origin
    if (event.source !== window) return;
    
    if (event.data.type === 'SYNC_COMPLETE' && event.data.syncedItems) {
        console.log('📥 Received SYNC_COMPLETE from page');
        
        // Send all sync data back to the extension
        chrome.runtime.sendMessage({
            type: 'SYNC_COMPLETE',
            syncedItems: event.data.syncedItems,
            userId: event.data.userId,
            totalSavedCount: event.data.totalSavedCount,
            isPro: event.data.isPro
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('❌ Error sending sync complete:', chrome.runtime.lastError.message);
            } else {
                console.log('✅ Sync complete message sent to extension');
            }
        });
    }
});

console.log("👂 Content script listening for messages from extension and page...");
