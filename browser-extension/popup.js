// Popup script for AccessCheck browser extension

let currentTab = null;
let scanResults = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;
  
  // Display current URL
  const urlDisplay = document.getElementById('currentUrl');
  if (tab?.url) {
    urlDisplay.textContent = `Current page: ${tab.url}`;
  }

  // Attach event listeners
  document.getElementById('scanBtn').addEventListener('click', startScan);
  document.getElementById('scanAgainBtn').addEventListener('click', resetAndScan);
  document.getElementById('viewFullReportBtn').addEventListener('click', viewFullReport);
  document.getElementById('viewDashboardBtn').addEventListener('click', openDashboard);
});

// Start accessibility scan
async function startScan() {
  if (!currentTab?.id) {
    showError('Unable to scan this page');
    return;
  }

  // Show loading state
  document.getElementById('scanSection').style.display = 'none';
  document.getElementById('results').classList.remove('active');
  document.getElementById('loading').classList.add('active');
  document.getElementById('error').classList.remove('active');

  try {
    // Inject axe-core if not already present
    await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      files: ['axe.min.js']
    });

    // Run the scan
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      func: runAccessibilityScan
    });

    if (result?.result) {
      scanResults = result.result;
      displayResults(scanResults);
      
      // Store results
      await chrome.storage.local.set({
        [`scan_${currentTab.id}`]: {
          url: currentTab.url,
          timestamp: Date.now(),
          results: scanResults
        }
      });
    } else {
      throw new Error('Scan failed to return results');
    }
  } catch (error) {
    console.error('Scan error:', error);
    showError(`Scan failed: ${error.message}`);
    document.getElementById('scanSection').style.display = 'block';
  } finally {
    document.getElementById('loading').classList.remove('active');
  }
}

// Function that runs in the page context
function runAccessibilityScan() {
  return new Promise((resolve) => {
    if (typeof window.axe === 'undefined') {
      resolve({ error: 'Axe-core not loaded' });
      return;
    }

    window.axe.run(document, {
      resultTypes: ['violations', 'incomplete'],
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
      }
    }).then(results => {
      resolve({
        violations: results.violations,
        incomplete: results.incomplete,
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
    }).catch(error => {
      resolve({ error: error.message });
    });
  });
}

// Display scan results
function displayResults(results) {
  if (results.error) {
    showError(results.error);
    return;
  }

  const violations = results.violations || [];
  
  // Update summary stats
  document.getElementById('totalIssues').textContent = violations.length;
  
  const critical = violations.filter(v => v.impact === 'critical' || v.impact === 'serious').length;
  const warnings = violations.filter(v => v.impact === 'moderate' || v.impact === 'minor').length;
  
  document.getElementById('criticalCount').textContent = critical;
  document.getElementById('warningCount').textContent = warnings;

  // Display violations list
  const violationsList = document.getElementById('violationsList');
  violationsList.innerHTML = '';

  if (violations.length === 0) {
    violationsList.innerHTML = '<div style="text-align: center; padding: 20px; color: #10b981; font-weight: 600;">✅ No accessibility issues found!</div>';
  } else {
    violations.slice(0, 5).forEach(violation => {
      const item = document.createElement('div');
      item.className = `violation-item ${violation.impact}`;
      item.innerHTML = `
        <div class="violation-title">${violation.help}</div>
        <div class="violation-count">${violation.nodes.length} instance${violation.nodes.length > 1 ? 's' : ''} • ${violation.impact} impact</div>
      `;
      violationsList.appendChild(item);
    });

    if (violations.length > 5) {
      const more = document.createElement('div');
      more.style.cssText = 'text-align: center; padding: 10px; color: #666; font-size: 12px;';
      more.textContent = `+ ${violations.length - 5} more issues`;
      violationsList.appendChild(more);
    }
  }

  // Show results
  document.getElementById('results').classList.add('active');
}

// Show error message
function showError(message) {
  const errorEl = document.getElementById('error');
  errorEl.textContent = message;
  errorEl.classList.add('active');
  
  // Hide after 5 seconds
  setTimeout(() => {
    errorEl.classList.remove('active');
  }, 5000);
}

// Reset and scan again
function resetAndScan() {
  document.getElementById('results').classList.remove('active');
  document.getElementById('scanSection').style.display = 'block';
  scanResults = null;
}

// View full report on website
function viewFullReport() {
  if (!scanResults || !currentTab?.url) return;
  
  // Create a scan on the main website
  const apiUrl = 'https://your-domain.com/api/scan';
  
  // Open results page
  chrome.tabs.create({
    url: `https://your-domain.com/scan?url=${encodeURIComponent(currentTab.url)}&from=extension`
  });
}

// Open dashboard
function openDashboard() {
  chrome.tabs.create({
    url: 'https://your-domain.com/dashboard'
  });
}
