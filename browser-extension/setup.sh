#!/bin/bash

# Setup script for AccessCheck Browser Extension
# Run this to download dependencies and prepare for testing

echo "🚀 Setting up AccessCheck Browser Extension..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the accessibility-checker directory."
    exit 1
fi

# Install axe-core if not present
echo "📦 Installing axe-core..."
npm install axe-core

# Copy axe-core to extension directory
echo "📋 Copying axe-core to extension..."
if [ -f "node_modules/axe-core/axe.min.js" ]; then
    cp node_modules/axe-core/axe.min.js browser-extension/
    echo "✅ axe-core copied successfully"
else
    echo "❌ Error: axe-core not found in node_modules"
    exit 1
fi

# Create icons directory
echo "📁 Creating icons directory..."
mkdir -p browser-extension/icons

# Check if icons exist
if [ ! -f "browser-extension/icons/icon16.png" ]; then
    echo ""
    echo "⚠️  Icon files not found!"
    echo "Please add the following icon files to browser-extension/icons/:"
    echo "  - icon16.png (16×16)"
    echo "  - icon32.png (32×32)"
    echo "  - icon48.png (48×48)"
    echo "  - icon128.png (128×128)"
    echo ""
    echo "You can:"
    echo "  1. Create icons at: https://realfavicongenerator.net/"
    echo "  2. Use the ♿ accessibility symbol"
    echo "  3. Use your custom AccessCheck logo"
    echo ""
fi

# Check if user wants to create simple placeholder icons
echo "Would you like to create placeholder icon files? (y/n)"
read -r create_icons

if [ "$create_icons" = "y" ]; then
    echo "Creating placeholder icons..."
    
    # This requires ImageMagick - check if it's installed
    if command -v convert &> /dev/null; then
        # Create simple colored squares as placeholders
        convert -size 16x16 xc:#667eea browser-extension/icons/icon16.png
        convert -size 32x32 xc:#667eea browser-extension/icons/icon32.png
        convert -size 48x48 xc:#667eea browser-extension/icons/icon48.png
        convert -size 128x128 xc:#667eea browser-extension/icons/icon128.png
        echo "✅ Placeholder icons created (replace with real icons before publishing)"
    else
        echo "⚠️  ImageMagick not found. Please create icons manually."
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Add icon files to browser-extension/icons/ (if not done)"
echo "  2. Update URLs in popup.js and background.js with your domain"
echo "  3. Load the extension in your browser:"
echo ""
echo "     Chrome:"
echo "       - Open chrome://extensions/"
echo "       - Enable 'Developer mode'"
echo "       - Click 'Load unpacked'"
echo "       - Select the browser-extension folder"
echo ""
echo "     Firefox:"
echo "       - Open about:debugging#/runtime/this-firefox"
echo "       - Click 'Load Temporary Add-on'"
echo "       - Select browser-extension/manifest.json"
echo ""
echo "  4. Test the extension on any webpage"
echo ""
echo "📚 Read IMPLEMENTATION_GUIDE.md for complete documentation"
echo ""
