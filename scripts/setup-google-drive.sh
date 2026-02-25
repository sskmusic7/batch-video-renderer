#!/bin/bash
# Setup Google Drive integration for image uploads

set -e

echo "📁 Setting up Google Drive integration..."
echo ""

# Check if gdrive is installed
if ! command -v gdrive &> /dev/null; then
    echo "📥 Installing gdrive CLI..."
    echo ""
    echo "Option 1: Install via Homebrew (macOS):"
    echo "  brew install gdrive"
    echo ""
    echo "Option 2: Download from:"
    echo "  https://github.com/glotlabs/gdrive/releases"
    echo ""
    echo "After installation, run this script again."
    exit 1
fi

echo "✅ gdrive CLI found"
echo ""

# Authenticate
echo "🔐 Authenticating with Google Drive..."
gdrive about

echo ""
echo "✅ Google Drive setup complete!"
echo ""
echo "📤 To upload images from a folder:"
echo "   gdrive upload --recursive ~/Downloads/SSK/"
echo ""
echo "💡 The web UI at your service URL also supports drag-and-drop!"
