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
        chrome.tabs.create({ url: syncUrl }, (tab) => {
             // Inject script to pass data
             // We need to wait for the page to effectively load
             chrome.scripting.executeScript({
                 target: { tabId: tab.id },
                 func: (items) => {
                     // Poll for window readiness and post message
                     const check = setInterval(() => {
                         if (document.readyState === 'complete') {
                             clearInterval(check);
                             window.postMessage({ type: 'SYNC_DATA', items: items }, '*');
                         }
                     }, 100);
                     // Timeout fallback
                     setTimeout(() => clearInterval(check), 10000);
                 },
                 args: [items]
             });
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
