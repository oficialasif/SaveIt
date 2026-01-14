document.addEventListener('DOMContentLoaded', () => {
  loadSavedItems();
  
  // Dashboard button handler
  document.getElementById('dashboard-btn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
  });
  
  // Show connection banner if not connected
  chrome.storage.local.get(['userId'], (result) => {
    const banner = document.getElementById('connection-banner');
    const statusDot = document.getElementById('status-indicator');
    
    if (result.userId) {
      if (statusDot) {
          statusDot.classList.add('connected');
          statusDot.title = "Connected to SaveIt Cloud";
      }
    } else {
      if (banner) {
        banner.style.display = 'block';
        banner.addEventListener('click', () => {
          chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
        });
      }
    }
  });
});

async function loadSavedItems() {
  chrome.storage.local.get(['savedItems', 'userId'], async (result) => {
    let items = result.savedItems || [];
    
    // If no userId, try to get it from the dashboard (if user is logged in there)
    if (!result.userId) {
      console.log('⚠️ No userId found. Attempting to connect to dashboard...');
      
      try {
        // Open dashboard to establish connection
        const connectMsg = document.createElement('div');
        connectMsg.style.cssText = 'position: fixed; top: 10px; left: 10px; right: 10px; background: #ff9800; color: white; padding: 12px; border-radius: 8px; z-index: 9999; font-size: 12px; text-align: center;';
        connectMsg.innerHTML = '⚠️ Not connected. Click "Dashboard" button to connect your account.';
        document.body.appendChild(connectMsg);
        
        setTimeout(() => connectMsg.remove(), 5000);
      } catch (error) {
        console.error('Connection check failed:', error);
      }
    }
    
    // Sync with Firestore to remove deleted items
    if (items.length > 0) {
      const itemsWithFirestoreId = items.filter(item => item.firestoreId);
      
      if (itemsWithFirestoreId.length > 0) {
        try {
          const firestoreIds = itemsWithFirestoreId.map(item => item.firestoreId);
          
          const response = await fetch('http://localhost:3000/api/check-items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemIds: firestoreIds })
          });
          
          if (response.ok) {
            const { existingIds } = await response.json();
            const beforeCount = items.length;
            
            // Filter out items that were deleted from dashboard
            items = items.filter(item => {
              // Keep items without Firestore ID (not synced yet)
              if (!item.firestoreId) return true;
              // Keep items that still exist in Firestore
              return existingIds.includes(item.firestoreId);
            });
            
            const deletedCount = beforeCount - items.length;
            if (deletedCount > 0) {
              console.log(`🔄 Synced: removed ${deletedCount} deleted items`);
              // Update storage
              chrome.storage.local.set({ savedItems: items });
            }
          }
        } catch (error) {
          console.log('ℹ️ Could not sync with dashboard:', error.message);
        }
      }
    }

    displayItems(items);
    updatePlanUsage(items.length);
  });
}

function displayItems(items) {
  const listElement = document.getElementById('saved-list');

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

    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'item';
      
      const date = new Date(item.timestamp).toLocaleDateString();

      li.innerHTML = `
        <div class="item-content" style="flex: 1;">
          <div class="item-text" title="${escapeHtml(item.text)}">${escapeHtml(item.text)}</div>
          <div class="item-meta">
            <span class="item-url" title="${escapeHtml(item.url)}">${escapeHtml(getDomain(item.url))}</span>
            <span class="item-date">${date}</span>
          </div>
        </div>
        <button class="item-delete" title="Delete item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
          </svg>
        </button>
      `;
      
      // Click to open original URL (only on content area)
      li.querySelector('.item-content').addEventListener('click', () => {
        chrome.tabs.create({ url: item.url });
      });

      // Delete button handler
      li.querySelector('.item-delete').addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevent opening URL
        
        if (!confirm('Delete this item?')) return;
        
        await deleteItem(item, index, li);
      });

      listElement.appendChild(li);
    });
}

async function deleteItem(item, index, liElement) {
  console.log('🗑️ Deleting item:', item.text.substring(0, 30) + '...');
  
  // 1. Instant UI update: Remove from list immediately
  if (liElement) {
    liElement.style.opacity = '0';
    setTimeout(() => liElement.remove(), 200); // Wait for transition
    
    // Check if list empty after removal
    const list = document.getElementById('saved-list');
    if (list && list.children.length <= 1) { // <= 1 because we haven't removed it yet fully
       // We can reload empty state later or just let the reloadSavedItems handle it if needed, 
       // but for smoothness we proceed with logic
    }
  }

  try {
    // 2. Delete from Firestore if synced (Background process)
    const firestorePromise = (async () => {
        if (item.firestoreId) {
            try {
                const response = await fetch('http://localhost:3000/api/delete-item', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ itemId: item.firestoreId })
                });
                if (response.ok) console.log('✅ Deleted from Firestore');
                else console.warn('⚠️ Could not delete from Firestore');
            } catch (err) {
                console.warn('⚠️ Firestore deletion failed:', err.message);
            }
        }
    })();

    // 3. Delete from extension storage
    chrome.storage.local.get(['savedItems'], (result) => {
      const items = result.savedItems || [];
      // Remove by ID to be safer than index if list changed
      const updatedItems = items.filter(saved => saved.id !== item.id);
      
      chrome.storage.local.set({ savedItems: updatedItems }, async () => {
        console.log('✅ Deleted from extension storage. Remaining:', updatedItems.length);
        
        // Wait for Firestore deletion to complete (optional, but good for data consistency)
        await firestorePromise;
        
        // Update plan usage display without full reload
        updatePlanUsage(updatedItems.length);
        
        // If empty, show empty state
        if (updatedItems.length === 0) {
            loadSavedItems(); // Reload to show empty state
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error deleting item:', error);
    alert('Failed to delete item');
    loadSavedItems(); // Revert UI on error
  }
}


function updatePlanUsage(itemCount) {
  const usageElement = document.getElementById('plan-usage');
  if (!usageElement) return;
  
  // Try to get user ID from extension sync data
  chrome.storage.local.get(['userId', 'totalSavedCount', 'isPro'], async (cached) => {
    let totalCount = 0;
    let isPro = cached.isPro || false;
    let hasUserId = !!cached.userId;
    
    // If we have a userId, fetch the real totalSavedCount from Firestore
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
          
          // Cache the values
          chrome.storage.local.set({ 
            totalSavedCount: totalCount,
            isPro: isPro 
          });
        }
      } catch (error) {
        console.log('ℹ️ Could not fetch user stats, using cached count');
        totalCount = cached.totalSavedCount || 0;
      }
    } else {
      // Use cached totalSavedCount if available
      totalCount = cached.totalSavedCount || 0;
    }
    
    // Display statistics
    const percentage = (totalCount / 10) * 100;
    const barColor = totalCount >= 10 ? '#ff6b6b' : '#2effc3';
    const isLimited = totalCount >= 10 && !isPro;
    
    if (isPro) {
      usageElement.innerHTML = `
        <div style="margin-bottom: 8px; font-weight: 600;">Pro Plan: Unlimited</div>
        <div style="font-size: 11px; color: rgba(255,255,255,0.6);">Current Items: ${itemCount}</div>
      `;
    } else {
      usageElement.innerHTML = `
        <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-bottom: 4px;">Current Items: ${itemCount}</div>
        <div style="margin-bottom: 8px; font-weight: 600;">Lifetime Saves: ${totalCount}/10</div>
        <div class="usage-bar">
          <div class="usage-fill" style="width: ${Math.min(percentage, 100)}%; background: ${barColor};"></div>
        </div>
      `;
    }
    
    if (isLimited) {
      usageElement.innerHTML += '<div style="color: #ff6b6b; margin-top: 8px; font-size: 11px; font-weight: 600;">⚠️ Upgrade to Pro required!</div>';
    } else if (!hasUserId && itemCount > 0) {
      usageElement.innerHTML += '<div style="color: #ffa500; margin-top: 8px; font-size: 11px;">💡 Click "Sync" to track lifetime saves</div>';
    }
  });
}

// Sync Button Logic - Open sync page
document.getElementById('sync-btn').addEventListener('click', () => {
    console.log("🔄 Sync button clicked");
    
    chrome.storage.local.get(['savedItems'], (result) => {
        const items = result.savedItems || [];
        console.log(`📦 Found ${items.length} items in storage`);
        
        // Always sync, even if 0 items, to ensure user stats (and userId) are updated!
        // This allows switching accounts.

        // Send message to background script to handle sync
        chrome.runtime.sendMessage({
            action: 'PERFORM_SYNC',
            items: items
        }, (response) => {
            if (response && response.success) {
                console.log('✅ Sync initiated successfully');
            } else {
                console.error('❌ Sync failed:', response?.error);
            }
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
