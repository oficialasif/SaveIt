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
    saveContent(info.selectionText, tab.url, tab.title);
  }
});

// Save content to local storage
function saveContent(text, url, title) {
  const newItem = {
    id: Date.now().toString(),
    text: text,
    url: url,
    title: title || "Untitled Page",
    timestamp: new Date().toISOString()
  };

  chrome.storage.local.get(["savedItems"], (result) => {
    const items = result.savedItems || [];
    // Enforce Free Plan Limit (MVP: Max 10 items)
    if (items.length >= 10) {
      // Optional: Notify user they reached the limit
      chrome.action.setBadgeText({ text: "MAX" });
      chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
      return; 
    }

    items.unshift(newItem); 
    
    chrome.storage.local.set({ savedItems: items }, () => {
      console.log("Item saved:", newItem);
      chrome.action.setBadgeText({ text: "OK" });
      setTimeout(() => chrome.action.setBadgeText({ text: "" }), 2000);
    });
  });
}
