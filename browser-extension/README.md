# AccessCheck Browser Extension

A powerful browser extension for Chrome and Firefox that instantly scans any webpage for WCAG accessibility issues.

## Features

- ✅ **Instant Scanning** - One-click accessibility analysis of any webpage
- 📊 **Detailed Reports** - See violations categorized by severity (critical, serious, moderate, minor)
- 🎯 **Element Highlighting** - Visually identify problematic elements on the page
- 💾 **Scan History** - Keep track of your recent scans
- 🔗 **Integration** - Seamlessly connect to your AccessCheck dashboard
- 🚀 **Fast & Lightweight** - Powered by axe-core accessibility engine

## Installation

### Chrome/Edge

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `browser-extension` folder
5. The AccessCheck icon should appear in your extensions toolbar

### Firefox

1. Download or clone this repository
2. Copy `manifest.json` to `manifest-firefox.json`
3. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the `browser-extension` folder

## Usage

### Quick Scan

1. Navigate to any webpage you want to test
2. Click the AccessCheck extension icon in your toolbar
3. Click "Scan This Page"
4. View instant results with issue counts and severity levels

### View Full Report

After scanning, click "View Full Report" to see:
- Detailed issue descriptions
- Code snippets showing affected elements
- Fix suggestions with copy-paste code examples
- WCAG guideline references

### Dashboard Integration

- Click "View Full Dashboard" to access your complete scan history
- Sync scans across devices (requires AccessCheck account)
- Export reports as PDF

## Setup for Development

### Prerequisites

- Node.js 18+ (for building/testing)
- Chrome or Firefox browser

### Download axe-core

The extension requires axe-core library. Download it:

```bash
# Using npm
npm install axe-core

# Copy the minified file to the extension directory
cp node_modules/axe-core/axe.min.js browser-extension/
```

Or download directly from:
https://github.com/dequelabs/axe-core/releases

Place `axe.min.js` in the `browser-extension` folder.

### Create Icons

Create icon files in `browser-extension/icons/`:
- `icon16.png` (16x16)
- `icon32.png` (32x32)
- `icon48.png` (48x48)
- `icon128.png` (128x128)

Use the ♿ accessibility symbol or your custom logo.

### Testing

1. Load the extension (see Installation above)
2. Navigate to a test page (e.g., https://example.com)
3. Click the extension icon
4. Click "Scan This Page"
5. Verify results display correctly

## File Structure

```
browser-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic
├── background.js         # Background service worker
├── content.js            # Content script (runs on pages)
├── axe.min.js           # Axe-core library (add this)
├── icons/               # Extension icons (add these)
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # This file
```

## Permissions

The extension requires the following permissions:

- **activeTab** - Access the current tab to scan for accessibility issues
- **storage** - Save scan history and preferences
- **scripting** - Inject the axe-core scanner into pages
- **host_permissions** - Scan any webpage

## Configuration

### Update API Endpoints

In `popup.js`, update these URLs to match your deployment:

```javascript
const apiUrl = 'https://your-domain.com/api/scan';
const dashboardUrl = 'https://your-domain.com/dashboard';
```

### Customize Branding

- Update the logo in `popup.html`
- Replace icon files in `icons/` folder
- Modify colors in `popup.html` styles

## Publishing

### Chrome Web Store

1. Create a ZIP file of the extension folder (exclude README)
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
3. Upload the ZIP file
4. Fill in store listing details
5. Submit for review

### Firefox Add-ons

1. Create a ZIP file of the extension folder
2. Go to [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
3. Upload the ZIP file
4. Fill in listing details
5. Submit for review

## Troubleshooting

### Extension doesn't load

- Check that all required files are present
- Verify `axe.min.js` is in the extension folder
- Check browser console for errors

### Scan fails

- Ensure the page has finished loading
- Check if the page blocks extension scripts (some sites do)
- Try refreshing the page and scanning again

### No results displayed

- Open browser DevTools console
- Check for JavaScript errors
- Verify axe-core is loaded correctly

## Support

For issues or questions:
- GitHub Issues: https://github.com/your-repo/issues
- Email: support@your-domain.com
- Documentation: https://your-domain.com/docs

## License

MIT License - See LICENSE file for details

## Credits

- Powered by [axe-core](https://github.com/dequelabs/axe-core) by Deque Systems
- Built for [AccessCheck](https://your-domain.com)
