document.addEventListener('DOMContentLoaded', () => {
  loadSavedItems();
});

function loadSavedItems() {
  const listElement = document.getElementById('saved-list');
  
  chrome.storage.local.get(["savedItems"], (result) => {
    const items = result.savedItems || [];
    listElement.innerHTML = ''; // Clear current list

    // Update Plan Usage
    const usageElement = document.getElementById('plan-usage');
    if (usageElement) {
        usageElement.textContent = `Free Plan: ${items.length}/10`;
        if (items.length >= 10) {
            usageElement.style.color = 'red';
            usageElement.textContent += ' (Limit Reached)';
        }
    }

    if (items.length === 0) {
      listElement.innerHTML = '<div class="empty-state">No saved items yet. Select text on a page and right-click to save.</div>';
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

        const syncUrl = 'http://localhost:3000/sync';
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
