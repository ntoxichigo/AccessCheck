# AccessCheck Feature Implementation Guide

This document describes the implementation of two major features:
1. **Code Snippets and Fix Suggestions** in scan results
2. **Browser Extension** for Chrome and Firefox

## Feature 1: Code Snippets and Fix Suggestions

### Overview
Enhanced the accessibility scan results to include actionable code snippets and quick fixes for common WCAG violations.

### Files Created/Modified

#### New File: `lib/accessibility-fixes.ts`
- **Purpose**: Generates code snippets and fix suggestions based on violation types
- **Key Functions**:
  - `getFixSuggestions(violationId, help)` - Returns detailed fix information with code examples
  - `getQuickFix(violationId)` - Returns a one-line quick fix suggestion

#### Modified: `components/ResultsDisplay.tsx`
- **Changes**:
  - Added `CodeSnippet` component for syntax-highlighted code display
  - Integrated fix suggestions into violation cards
  - Added copy-to-clipboard functionality
  - Enhanced UI for pro users with detailed remediation steps

### Features Added

1. **Quick Fix Banner**: One-line actionable fix displayed for each issue
2. **Code Snippets**: Multiple code examples showing before/after fixes
3. **Language Support**: HTML, CSS, JSX, and JavaScript examples
4. **Copy Button**: One-click copying of code snippets
5. **Categorized Solutions**: Fixes organized by violation type:
   - Color contrast issues
   - Image alt text
   - Form labels
   - Heading hierarchy
   - ARIA labels
   - Keyboard navigation
   - Link purpose
   - Landmark regions

### Usage

The feature automatically activates for Pro and Enterprise users. Free users see a teaser with upgrade prompt.

**Example Output**:
```
⚡ Quick Fix: Use darker text colors or lighter backgrounds to meet 4.5:1 contrast ratio

Code Snippets:
┌─ Increase contrast with darker text (css)
│ /* Before: Low contrast */
│ .text {
│   color: #999; /* Light gray on white */
│ }
│ 
│ /* After: High contrast (meets WCAG AA) */
│ .text {
│   color: #333; /* Dark gray - 12.6:1 ratio */
│ }
└─ [Copy]
```

### Testing

1. Run a scan on a page with accessibility issues
2. Verify code snippets appear for Pro users
3. Test copy functionality
4. Verify different violation types show appropriate fixes

---

## Feature 2: Browser Extension

### Overview
Full-featured browser extension for Chrome and Firefox that scans webpages directly in the browser.

### Directory Structure

```
browser-extension/
├── manifest.json              # Chrome/Edge manifest (v3)
├── manifest-firefox.json      # Firefox manifest (v2)
├── popup.html                # Extension popup UI
├── popup.js                  # Popup logic and scan orchestration
├── background.js             # Background service worker
├── content.js                # Content script (page interaction)
├── build.js                  # Build script for packaging
├── README.md                 # Extension documentation
└── icons/                    # Extension icons (16, 32, 48, 128)
    └── (add icon files here)
```

### Key Components

#### 1. `manifest.json` (Chrome)
- Manifest v3 for Chrome/Edge
- Permissions: activeTab, storage, scripting
- Service worker background script

#### 2. `manifest-firefox.json` (Firefox)
- Manifest v2 for Firefox compatibility
- Background scripts instead of service worker

#### 3. `popup.html` & `popup.js`
- **Features**:
  - One-click scanning of current tab
  - Real-time results display
  - Issue categorization (critical/warnings)
  - Integration with main dashboard
  - Scan history storage
  
#### 4. `background.js`
- Manages extension lifecycle
- Stores scan history
- Updates extension badge with issue count
- Context menu integration

#### 5. `content.js`
- Runs in webpage context
- Highlights problematic elements
- Provides page information
- Visual feedback for scans

#### 6. `build.js`
- Automated build script
- Creates separate Chrome and Firefox packages
- Generates ZIP files for store submission

### Setup Instructions

#### 1. Download axe-core

```bash
cd accessibility-checker
npm install axe-core
cp node_modules/axe-core/axe.min.js browser-extension/
```

#### 2. Create Icons

Create PNG icons in `browser-extension/icons/`:
- `icon16.png` (16×16)
- `icon32.png` (32×32)
- `icon48.png` (48×48)
- `icon128.png` (128×128)

You can use online tools like:
- https://realfavicongenerator.net/
- https://www.iconfinder.com/

Or create simple icons with the ♿ symbol.

#### 3. Update Configuration

Edit `popup.js` and replace placeholder URLs:

```javascript
// Line ~173
const apiUrl = 'https://your-actual-domain.com/api/scan';

// Line ~176
chrome.tabs.create({
  url: `https://your-actual-domain.com/scan?url=${encodeURIComponent(currentTab.url)}&from=extension`
});

// Line ~183
chrome.tabs.create({
  url: 'https://your-actual-domain.com/dashboard'
});
```

Also update in `background.js`:
```javascript
// Line ~7
chrome.tabs.create({
  url: 'https://your-actual-domain.com/extension/welcome'
});
```

And in `popup.html`:
```html
<!-- Line ~252 -->
Powered by <a href="https://your-actual-domain.com" target="_blank">AccessCheck</a>
```

### Testing Locally

#### Chrome/Edge

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `browser-extension` folder
5. Extension icon appears in toolbar

#### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json` from `browser-extension` folder
4. Extension loaded (temporary until browser restart)

### Testing Flow

1. Navigate to any webpage (e.g., wikipedia.org)
2. Click the AccessCheck extension icon
3. Click "Scan This Page"
4. Wait for scan completion (~2-5 seconds)
5. Review results:
   - Total issues count
   - Critical/warning breakdown
   - Top 5 violations listed
6. Click "View Full Report" to open in main app
7. Test "Scan Again" button
8. Test "View Full Dashboard" button

### Building for Production

Run the build script:

```bash
cd browser-extension
node build.js
```

This creates:
- `dist/extension/chrome/` - Chrome version
- `dist/extension/firefox/` - Firefox version
- `dist/extension/accesscheck-chrome.zip` - Ready for Chrome Web Store
- `dist/extension/accesscheck-firefox.zip` - Ready for Firefox Add-ons

### Publishing

#### Chrome Web Store

1. Create developer account: https://chrome.google.com/webstore/devconsole/
2. Pay one-time $5 fee
3. Upload `accesscheck-chrome.zip`
4. Fill in:
   - Name, description, category
   - Screenshots (1280×800 or 640×400)
   - Promotional images
   - Privacy policy URL
5. Submit for review (usually 1-3 days)

#### Firefox Add-ons

1. Create account: https://addons.mozilla.org/developers/
2. Upload `accesscheck-firefox.zip`
3. Fill in metadata
4. Submit for review (usually 1-7 days)

### Extension Features

✅ **Instant Scanning** - One-click accessibility analysis
✅ **Severity Categorization** - Critical, serious, moderate, minor
✅ **Issue Highlighting** - Visual highlighting of problem elements
✅ **Scan History** - Stores last 50 scans locally
✅ **Badge Notifications** - Extension badge shows issue count
✅ **Context Menu** - Right-click to scan page
✅ **Dashboard Integration** - Seamless connection to web app
✅ **Offline Capable** - Scans work without internet (except full report)

### Permissions Explanation

Users will see these permissions when installing:

- **Read and change all your data on websites**: Required to scan page content and inject axe-core
- **Display notifications**: For scan completion alerts
- **Store data locally**: Save scan history and preferences

### Privacy Considerations

- Extension runs scans locally (no data sent to servers)
- Scan results stored only in browser local storage
- "View Full Report" sends URL to your API (user-initiated)
- No tracking or analytics by default

### Troubleshooting

**Scan button doesn't work**
- Check browser console for errors
- Verify `axe.min.js` is present
- Ensure page has finished loading

**No results shown**
- Some sites block extension scripts (CSP policies)
- Try refreshing page
- Check if site is accessible (not chrome:// URLs)

**Extension won't load**
- Verify all icon files exist
- Check manifest.json syntax
- Look for errors in chrome://extensions/

### Future Enhancements

Potential additions:
- [ ] Settings page for configuration
- [ ] Custom scan rules
- [ ] Export results to CSV/PDF
- [ ] Scheduled automatic scans
- [ ] Multi-page batch scanning
- [ ] Integration with CI/CD tools
- [ ] Keyboard shortcuts
- [ ] Dark mode support

---

## Summary

Both features are now fully implemented:

1. **Code Snippets**: Integrated into `ResultsDisplay.tsx` with comprehensive fix suggestions
2. **Browser Extension**: Complete Chrome/Firefox extension in `browser-extension/` folder

### Next Steps

1. **Test Code Snippets**:
   - Run `npm run dev` in `accessibility-checker/`
   - Perform a scan on a page with issues
   - Verify code snippets appear for Pro users

2. **Test Extension**:
   - Download axe-core: `npm install axe-core && cp node_modules/axe-core/axe.min.js browser-extension/`
   - Create icon files in `browser-extension/icons/`
   - Load unpacked in Chrome/Firefox
   - Test scanning functionality

3. **Deploy**:
   - Update API URLs in extension files
   - Build production version: `node browser-extension/build.js`
   - Submit to browser stores

### Support

For questions or issues:
- Check the `browser-extension/README.md` for detailed documentation
- Review code comments in `lib/accessibility-fixes.ts`
- Test with different violation types to see various code snippets

---

**Created**: October 2025
**Version**: 1.0.0
**Status**: ✅ Complete and ready for testing
