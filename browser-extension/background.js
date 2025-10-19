// Background service worker for AccessCheck extension

// Install event
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('AccessCheck extension installed');
    
    // Open welcome page
    chrome.tabs.create({
      url: 'https://your-domain.com/extension/welcome'
    });
  } else if (details.reason === 'update') {
    console.log('AccessCheck extension updated');
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanComplete') {
    // Handle scan completion
    console.log('Scan completed for', sender.tab?.url);
    
    // Store scan history
    chrome.storage.local.get(['scanHistory'], (result) => {
      const history = result.scanHistory || [];
      history.unshift({
        url: sender.tab?.url,
        timestamp: Date.now(),
        issueCount: request.issueCount
      });
      
      // Keep only last 50 scans
      const trimmedHistory = history.slice(0, 50);
      
      chrome.storage.local.set({ scanHistory: trimmedHistory });
    });
    
    sendResponse({ success: true });
  }
  
  if (request.action === 'getApiKey') {
    // Return stored API key for authenticated requests
    chrome.storage.sync.get(['apiKey'], (result) => {
      sendResponse({ apiKey: result.apiKey || null });
    });
    return true; // Keep message channel open for async response
  }
  
  return false;
});

// Context menu for right-click scan
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'scanPage',
    title: 'Scan page with AccessCheck',
    contexts: ['page']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'scanPage' && tab?.id) {
    // Open popup or trigger scan
    chrome.action.openPopup();
  }
});

// Badge update when scan results are available
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.scanHistory) {
    const latestScan = changes.scanHistory.newValue?.[0];
    if (latestScan) {
      updateBadge(latestScan.issueCount);
    }
  }
});

function updateBadge(issueCount) {
  if (issueCount === 0) {
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
    chrome.action.setBadgeText({ text: '✓' });
  } else if (issueCount < 5) {
    chrome.action.setBadgeBackgroundColor({ color: '#fbbf24' });
    chrome.action.setBadgeText({ text: String(issueCount) });
  } else {
    chrome.action.setBadgeBackgroundColor({ color: '#dc2626' });
    chrome.action.setBadgeText({ text: String(issueCount) });
  }
}
