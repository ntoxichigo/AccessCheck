# AccessCheck - Quick Start Guide

## ✅ What's Been Implemented

### 1. Code Snippets & Fix Suggestions
**Location**: `components/ResultsDisplay.tsx` + `lib/accessibility-fixes.ts`

**Features**:
- ⚡ Quick fix suggestions for each violation
- 📝 Multiple code examples (HTML, CSS, JSX, JavaScript)
- 📋 Copy-to-clipboard functionality
- 🎨 Syntax-highlighted code blocks
- 🔒 Pro/Enterprise only (Free users see teaser)

**How to Use**:
1. Run an accessibility scan on any page
2. Pro users automatically see code snippets
3. Click copy button to copy code examples
4. Apply fixes to your codebase

### 2. Browser Extension
**Location**: `browser-extension/` folder

**Features**:
- 🌐 Works on Chrome, Edge, and Firefox
- ⚡ One-click scanning from toolbar
- 📊 Instant results with issue counts
- 🎯 Categorization by severity
- 💾 Scan history (last 50 scans)
- 🔗 Dashboard integration
- 🏷️ Badge notifications

**Setup in 3 Steps**:

```powershell
# Windows PowerShell
cd accessibility-checker
.\browser-extension\setup.ps1
```

```bash
# Mac/Linux
cd accessibility-checker
chmod +x browser-extension/setup.sh
./browser-extension/setup.sh
```

Then load in browser:
- **Chrome**: `chrome://extensions/` → Load unpacked
- **Firefox**: `about:debugging` → Load Temporary Add-on

---

## 📁 New Files Created

### Core Features
- `lib/accessibility-fixes.ts` - Code snippet generator
- `components/ResultsDisplay.tsx` - Updated with code snippets (MODIFIED)

### Browser Extension
- `browser-extension/manifest.json` - Chrome/Edge config
- `browser-extension/manifest-firefox.json` - Firefox config
- `browser-extension/popup.html` - Extension popup UI
- `browser-extension/popup.js` - Popup logic
- `browser-extension/background.js` - Background worker
- `browser-extension/content.js` - Page interaction
- `browser-extension/build.js` - Build script
- `browser-extension/setup.sh` - Linux/Mac setup
- `browser-extension/setup.ps1` - Windows setup
- `browser-extension/README.md` - Extension docs

### Documentation
- `IMPLEMENTATION_GUIDE.md` - Complete implementation guide
- `browser-extension/QUICK_START.md` - This file

---

## 🚀 Testing

### Test Code Snippets

1. Start dev server:
```bash
cd accessibility-checker
npm run dev
```

2. Open http://localhost:3000 and run a scan
3. Sign in as Pro user (or upgrade account)
4. View scan results - code snippets should appear
5. Test copy button on code blocks

### Test Browser Extension

1. **Setup** (first time only):
```powershell
cd accessibility-checker
.\browser-extension\setup.ps1
```

2. **Add Icons** (required):
   - Place icon files in `browser-extension/icons/`
   - Or create at: https://realfavicongenerator.net/

3. **Load Extension**:
   - Chrome: `chrome://extensions/` → Developer mode → Load unpacked
   - Select `browser-extension` folder

4. **Test**:
   - Navigate to any webpage
   - Click extension icon
   - Click "Scan This Page"
   - Verify results appear

---

## 🔧 Configuration

### Update Extension URLs

Before publishing, update these URLs in extension files:

**popup.js** (line ~176):
```javascript
const dashboardUrl = 'https://YOUR-DOMAIN.com/dashboard';
const scanUrl = 'https://YOUR-DOMAIN.com/scan';
```

**background.js** (line ~7):
```javascript
url: 'https://YOUR-DOMAIN.com/extension/welcome'
```

**popup.html** (line ~252):
```html
<a href="https://YOUR-DOMAIN.com" target="_blank">AccessCheck</a>
```

---

## 📦 Building for Production

### Build Extension Packages

```bash
cd browser-extension
node build.js
```

Output:
- `dist/extension/accesscheck-chrome.zip` - Chrome Web Store ready
- `dist/extension/accesscheck-firefox.zip` - Firefox Add-ons ready

### Publishing

**Chrome Web Store**:
1. Go to: https://chrome.google.com/webstore/devconsole/
2. Upload `accesscheck-chrome.zip`
3. Add screenshots and description
4. Submit for review

**Firefox Add-ons**:
1. Go to: https://addons.mozilla.org/developers/
2. Upload `accesscheck-firefox.zip`
3. Fill in metadata
4. Submit for review

---

## 🐛 Troubleshooting

### Code Snippets Not Showing
- ✅ Ensure user is Pro/Enterprise tier
- ✅ Check browser console for errors
- ✅ Verify `lib/accessibility-fixes.ts` imported correctly

### Extension Won't Load
- ✅ Check `axe.min.js` exists in `browser-extension/`
- ✅ Verify icon files exist in `browser-extension/icons/`
- ✅ Check manifest.json syntax
- ✅ Look for errors in `chrome://extensions/`

### Scan Fails in Extension
- ✅ Reload the page and try again
- ✅ Some sites block extensions (CSP policy)
- ✅ Check browser console for errors
- ✅ Verify axe-core loaded correctly

---

## 📚 Documentation

- **Complete Guide**: `IMPLEMENTATION_GUIDE.md`
- **Extension README**: `browser-extension/README.md`
- **Code Fixes API**: See `lib/accessibility-fixes.ts` comments

---

## 🎯 Quick Commands

```bash
# Install dependencies
npm install axe-core

# Copy axe-core to extension
cp node_modules/axe-core/axe.min.js browser-extension/

# Run dev server
npm run dev

# Build extension
cd browser-extension && node build.js

# Setup extension (Windows)
.\browser-extension\setup.ps1

# Setup extension (Mac/Linux)
./browser-extension/setup.sh
```

---

## ✨ Features Summary

| Feature | Status | Users |
|---------|--------|-------|
| Quick Fix Suggestions | ✅ Live | Pro+ |
| Code Snippets | ✅ Live | Pro+ |
| Copy to Clipboard | ✅ Live | Pro+ |
| Chrome Extension | ✅ Ready | All |
| Firefox Extension | ✅ Ready | All |
| Extension Badge | ✅ Ready | All |
| Scan History | ✅ Ready | All |
| Context Menu | ✅ Ready | All |

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready

For questions or issues, see `IMPLEMENTATION_GUIDE.md`
