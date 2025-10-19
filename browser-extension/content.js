// Content script for AccessCheck extension
// Runs in the context of web pages

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'highlightElement') {
    highlightAccessibilityIssue(request.selector);
    sendResponse({ success: true });
  }
  
  if (request.action === 'getPageInfo') {
    sendResponse({
      title: document.title,
      url: window.location.href,
      metaDescription: document.querySelector('meta[name="description"]')?.content || ''
    });
  }
  
  return false;
});

// Highlight elements with accessibility issues
function highlightAccessibilityIssue(selector) {
  try {
    const element = document.querySelector(selector);
    if (!element) return;

    // Remove existing highlights
    document.querySelectorAll('.accesscheck-highlight').forEach(el => {
      el.classList.remove('accesscheck-highlight');
    });

    // Add highlight class
    element.classList.add('accesscheck-highlight');
    
    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Inject highlight styles if not present
    if (!document.getElementById('accesscheck-styles')) {
      const style = document.createElement('style');
      style.id = 'accesscheck-styles';
      style.textContent = `
        .accesscheck-highlight {
          outline: 3px solid #dc2626 !important;
          outline-offset: 2px !important;
          background-color: rgba(220, 38, 38, 0.1) !important;
          animation: accesscheck-pulse 2s ease-in-out infinite;
        }
        
        @keyframes accesscheck-pulse {
          0%, 100% { outline-color: #dc2626; }
          50% { outline-color: #f59e0b; }
        }
      `;
      document.head.appendChild(style);
    }

    // Remove highlight after 5 seconds
    setTimeout(() => {
      element.classList.remove('accesscheck-highlight');
    }, 5000);
  } catch (error) {
    console.error('Error highlighting element:', error);
  }
}

// Optional: Auto-inject accessibility overlay
let overlayInjected = false;

function injectAccessibilityOverlay() {
  if (overlayInjected) return;
  
  const overlay = document.createElement('div');
  overlay.id = 'accesscheck-overlay';
  overlay.innerHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; z-index: 999999; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 20px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); font-family: system-ui, -apple-system, sans-serif; max-width: 300px;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        <span style="font-size: 24px;">♿</span>
        <strong>AccessCheck</strong>
      </div>
      <p style="font-size: 13px; margin: 0;">This page has been scanned for accessibility issues.</p>
      <button id="accesscheck-close" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: white; cursor: pointer; font-size: 20px;">×</button>
    </div>
  `;
  
  document.body.appendChild(overlay);
  overlayInjected = true;

  // Close overlay
  document.getElementById('accesscheck-close')?.addEventListener('click', () => {
    overlay.remove();
    overlayInjected = false;
  });

  // Auto-close after 10 seconds
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.remove();
      overlayInjected = false;
    }
  }, 10000);
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { highlightAccessibilityIssue };
}
