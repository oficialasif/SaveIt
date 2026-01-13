document.addEventListener('DOMContentLoaded', () => {
  loadSavedItems();
});

function loadSavedItems() {
  const listElement = document.getElementById('saved-list');
  
  chrome.storage.local.get(["savedItems"], (result) => {
    const items = result.savedItems || [];
    listElement.innerHTML = ''; // Clear current list


    // Update Plan Usage with better styling
    const usageElement = document.getElementById('plan-usage');
    if (usageElement) {
        const percentage = (items.length / 10) * 100;
        const barColor = items.length >= 10 ? '#ff6b6b' : '#2effc3';
        
        usageElement.innerHTML = `
            <div style="margin-bottom: 8px;">Free Plan: ${items.length}/10 saved items</div>
            <div class="usage-bar">
                <div class="usage-fill" style="width: ${percentage}%; background: ${barColor};"></div>
            </div>
        `;
        
        if (items.length >= 10) {
            usageElement.innerHTML += '<div style="color: #ff6b6b; margin-top: 8px; font-size: 11px;">✨ Upgrade to Pro for unlimited saves!</div>';
        }
    }

    if (items.length === 0) {
      listElement.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
              <path d="M2 17L12 22L22 17"/>
              <path d="M2 12L12 17L22 12"/>
            </svg>
          </div>
          <div class="empty-text">No saved items yet</div>
          <div class="empty-hint">Select text on any page and right-click "Save to SaveIt"</div>
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'item';
      
      const date = new Date(item.timestamp).toLocaleDateString();

      li.innerHTML = `
        <div class="item-text" title="${escapeHtml(item.text)}">${escapeHtml(item.text)}</div>
        <div class="item-meta">
          <span class="item-url" title="${escapeHtml(item.url)}">${escapeHtml(getDomain(item.url))}</span>
          <span class="item-date">${date}</span>
        </div>
      `;
      
      // Click to open original URL
      li.addEventListener('click', () => {
        chrome.tabs.create({ url: item.url });
      });

      listElement.appendChild(li);
    });
  });
}

// Sync Button Logic
document.getElementById('sync-btn').addEventListener('click', () => {
    chrome.storage.local.get(['savedItems'], (result) => {
        const items = result.savedItems || [];
        if (items.length === 0) {
            alert("No items to sync.");
            return;
        }

        const syncUrl = 'https://saveit-nu.vercel.app/sync';
        
        // Create tab and wait for it to fully load
        chrome.tabs.create({ url: syncUrl }, (tab) => {
            // Listen for tab updates
            const listener = (tabId, changeInfo) => {
                if (tabId === tab.id && changeInfo.status === 'complete') {
                    // Remove listener once page is loaded
                    chrome.tabs.onUpdated.removeListener(listener);
                    
                    // Wait a bit more to ensure page scripts are ready
                    setTimeout(() => {
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            func: (itemsData) => {
                                // Send message to page
                                window.postMessage({ 
                                    type: 'SYNC_DATA', 
                                    items: itemsData 
                                }, '*');
                                console.log('Extension sent SYNC_DATA message with', itemsData.length, 'items');
                            },
                            args: [items]
                        }).then(() => {
                            console.log('Script executed successfully');
                        }).catch((err) => {
                            console.error('Script execution error:', err);
                        });
                    }, 1000); // Wait 1 second after page loads
                }
            };
            
            chrome.tabs.onUpdated.addListener(listener);
        });
    });
});

// Utility to escape HTML to prevent XSS (basic)
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname;
  } catch (e) {
    return url;
  }
}
