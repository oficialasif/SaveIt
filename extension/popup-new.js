// Sync Button Logic
document.getElementById('sync-btn').addEventListener('click', async () => {
    const result = await chrome.storage.local.get(['savedItems']);
    const items = result.savedItems || [];
    
    if (items.length === 0) {
        alert("No items to sync.");
        return;
    }

    console.log('Starting sync with', items.length, 'items');
    const syncUrl = 'https://saveit-nu.vercel.app/sync';
    
    // Open sync tab
    const tab = await chrome.tabs.create({ url: syncUrl });
    
    // Wait for tab to be fully loaded and ready
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId === tab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            
            console.log('Tab loaded, sending data in 1.5 seconds...');
            
            // Wait a bit for page scripts to initialize
            setTimeout(async () => {
                try {
                    await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: (itemsData) => {
                            console.log('Injected script running, sending', itemsData.length, 'items');
                            window.postMessage({
                                type: 'SYNC_DATA',
                                items: itemsData
                            }, '*');
                        },
                        args: [items]
                    });
                    console.log('✅ Script injected successfully');
                } catch (error) {
                    console.error('❌ Script injection failed:', error);
                }
            }, 1500);
        }
    });
});
