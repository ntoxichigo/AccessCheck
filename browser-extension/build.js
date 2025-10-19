#!/usr/bin/env node

/**
 * Build script for AccessCheck browser extension
 * Packages the extension for Chrome and Firefox
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const EXTENSION_DIR = __dirname;
const DIST_DIR = path.join(__dirname, '../dist/extension');
const REQUIRED_FILES = [
  'manifest.json',
  'popup.html',
  'popup.js',
  'background.js',
  'content.js',
  'axe.min.js'
];

console.log('🔨 Building AccessCheck Browser Extension...\n');

// Check required files
console.log('✓ Checking required files...');
const missingFiles = REQUIRED_FILES.filter(file => !fs.existsSync(path.join(EXTENSION_DIR, file)));

if (missingFiles.length > 0) {
  console.error('❌ Missing required files:');
  missingFiles.forEach(file => console.error(`   - ${file}`));
  
  if (missingFiles.includes('axe.min.js')) {
    console.log('\n💡 To download axe-core:');
    console.log('   npm install axe-core');
    console.log('   cp node_modules/axe-core/axe.min.js browser-extension/');
  }
  
  process.exit(1);
}

// Check icons
const iconSizes = [16, 32, 48, 128];
const missingIcons = iconSizes.filter(size => !fs.existsSync(path.join(EXTENSION_DIR, 'icons', `icon${size}.png`)));

if (missingIcons.length > 0) {
  console.warn('⚠️  Missing icon files:');
  missingIcons.forEach(size => console.warn(`   - icons/icon${size}.png`));
  console.log('   Extension will work but won\'t have proper icons\n');
}

// Create dist directory
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Copy files for Chrome version
console.log('📦 Building Chrome version...');
const chromeDir = path.join(DIST_DIR, 'chrome');
if (fs.existsSync(chromeDir)) {
  fs.rmSync(chromeDir, { recursive: true });
}
fs.mkdirSync(chromeDir, { recursive: true });

REQUIRED_FILES.forEach(file => {
  fs.copyFileSync(
    path.join(EXTENSION_DIR, file),
    path.join(chromeDir, file)
  );
});

// Copy icons if they exist
if (fs.existsSync(path.join(EXTENSION_DIR, 'icons'))) {
  fs.mkdirSync(path.join(chromeDir, 'icons'), { recursive: true });
  iconSizes.forEach(size => {
    const iconFile = `icon${size}.png`;
    const iconPath = path.join(EXTENSION_DIR, 'icons', iconFile);
    if (fs.existsSync(iconPath)) {
      fs.copyFileSync(iconPath, path.join(chromeDir, 'icons', iconFile));
    }
  });
}

// Create ZIP for Chrome
try {
  console.log('🗜️  Creating Chrome ZIP...');
  const chromeZip = path.join(DIST_DIR, 'accesscheck-chrome.zip');
  if (fs.existsSync(chromeZip)) {
    fs.unlinkSync(chromeZip);
  }
  
  // Use built-in zip or 7-zip if available
  const zipCmd = process.platform === 'win32'
    ? `powershell Compress-Archive -Path "${chromeDir}\\*" -DestinationPath "${chromeZip}"`
    : `cd "${chromeDir}" && zip -r "${chromeZip}" .`;
  
  execSync(zipCmd, { stdio: 'inherit' });
  console.log(`✅ Chrome extension: ${chromeZip}\n`);
} catch (error) {
  console.error('❌ Failed to create Chrome ZIP:', error.message);
}

// Build Firefox version
console.log('📦 Building Firefox version...');
const firefoxDir = path.join(DIST_DIR, 'firefox');
if (fs.existsSync(firefoxDir)) {
  fs.rmSync(firefoxDir, { recursive: true });
}
fs.mkdirSync(firefoxDir, { recursive: true });

// Copy files (excluding Chrome-specific manifest)
REQUIRED_FILES.filter(f => f !== 'manifest.json').forEach(file => {
  fs.copyFileSync(
    path.join(EXTENSION_DIR, file),
    path.join(firefoxDir, file)
  );
});

// Use Firefox manifest
fs.copyFileSync(
  path.join(EXTENSION_DIR, 'manifest-firefox.json'),
  path.join(firefoxDir, 'manifest.json')
);

// Copy icons
if (fs.existsSync(path.join(EXTENSION_DIR, 'icons'))) {
  fs.mkdirSync(path.join(firefoxDir, 'icons'), { recursive: true });
  iconSizes.forEach(size => {
    const iconFile = `icon${size}.png`;
    const iconPath = path.join(EXTENSION_DIR, 'icons', iconFile);
    if (fs.existsSync(iconPath)) {
      fs.copyFileSync(iconPath, path.join(firefoxDir, 'icons', iconFile));
    }
  });
}

// Create ZIP for Firefox
try {
  console.log('🗜️  Creating Firefox ZIP...');
  const firefoxZip = path.join(DIST_DIR, 'accesscheck-firefox.zip');
  if (fs.existsSync(firefoxZip)) {
    fs.unlinkSync(firefoxZip);
  }
  
  const zipCmd = process.platform === 'win32'
    ? `powershell Compress-Archive -Path "${firefoxDir}\\*" -DestinationPath "${firefoxZip}"`
    : `cd "${firefoxDir}" && zip -r "${firefoxZip}" .`;
  
  execSync(zipCmd, { stdio: 'inherit' });
  console.log(`✅ Firefox extension: ${firefoxZip}\n`);
} catch (error) {
  console.error('❌ Failed to create Firefox ZIP:', error.message);
}

console.log('✨ Build complete!\n');
console.log('📝 Next steps:');
console.log('   1. Test the extension by loading from dist/extension/chrome or dist/extension/firefox');
console.log('   2. Submit to Chrome Web Store: https://chrome.google.com/webstore/devconsole/');
console.log('   3. Submit to Firefox Add-ons: https://addons.mozilla.org/developers/\n');
