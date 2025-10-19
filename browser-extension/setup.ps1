# Setup script for AccessCheck Browser Extension (Windows)
# Run this in PowerShell to download dependencies and prepare for testing

Write-Host "🚀 Setting up AccessCheck Browser Extension..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this from the accessibility-checker directory." -ForegroundColor Red
    exit 1
}

# Install axe-core if not present
Write-Host "📦 Installing axe-core..." -ForegroundColor Yellow
npm install axe-core

# Copy axe-core to extension directory
Write-Host "📋 Copying axe-core to extension..." -ForegroundColor Yellow
if (Test-Path "node_modules/axe-core/axe.min.js") {
    Copy-Item "node_modules/axe-core/axe.min.js" "browser-extension/"
    Write-Host "✅ axe-core copied successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Error: axe-core not found in node_modules" -ForegroundColor Red
    exit 1
}

# Create icons directory
Write-Host "📁 Creating icons directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "browser-extension/icons" | Out-Null

# Check if icons exist
if (-not (Test-Path "browser-extension/icons/icon16.png")) {
    Write-Host ""
    Write-Host "⚠️  Icon files not found!" -ForegroundColor Yellow
    Write-Host "Please add the following icon files to browser-extension/icons/:"
    Write-Host "  - icon16.png (16×16)"
    Write-Host "  - icon32.png (32×32)"
    Write-Host "  - icon48.png (48×48)"
    Write-Host "  - icon128.png (128×128)"
    Write-Host ""
    Write-Host "You can:"
    Write-Host "  1. Create icons at: https://realfavicongenerator.net/"
    Write-Host "  2. Use the ♿ accessibility symbol"
    Write-Host "  3. Use your custom AccessCheck logo"
    Write-Host ""
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Add icon files to browser-extension/icons/ (if not done)"
Write-Host "  2. Update URLs in popup.js and background.js with your domain"
Write-Host "  3. Load the extension in your browser:"
Write-Host ""
Write-Host "     Chrome:" -ForegroundColor Yellow
Write-Host "       - Open chrome://extensions/"
Write-Host "       - Enable 'Developer mode'"
Write-Host "       - Click 'Load unpacked'"
Write-Host "       - Select the browser-extension folder"
Write-Host ""
Write-Host "     Edge:" -ForegroundColor Yellow
Write-Host "       - Open edge://extensions/"
Write-Host "       - Enable 'Developer mode'"
Write-Host "       - Click 'Load unpacked'"
Write-Host "       - Select the browser-extension folder"
Write-Host ""
Write-Host "     Firefox:" -ForegroundColor Yellow
Write-Host "       - Open about:debugging#/runtime/this-firefox"
Write-Host "       - Click 'Load Temporary Add-on'"
Write-Host "       - Select browser-extension/manifest.json"
Write-Host ""
Write-Host "  4. Test the extension on any webpage"
Write-Host ""
Write-Host "📚 Read IMPLEMENTATION_GUIDE.md for complete documentation" -ForegroundColor Cyan
Write-Host ""
