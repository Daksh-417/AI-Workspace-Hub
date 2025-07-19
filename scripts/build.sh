#!/bin/bash

# AI Workspace Hub - Build Script
# This script prepares and builds the app for production

echo "🚀 Starting AI Workspace Hub build process..."

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Type check
echo "🔍 Running TypeScript type check..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Please fix them before building."
    exit 1
fi

# Build for web
echo "🌐 Building for web..."
npx expo export:web

# Build for mobile (requires EAS CLI)
if command -v eas >/dev/null 2>&1; then
    echo "📱 Building for mobile platforms..."
    
    # Build for iOS
    echo "🍎 Building for iOS..."
    eas build --platform ios --profile production --non-interactive
    
    # Build for Android
    echo "🤖 Building for Android..."
    eas build --platform android --profile production --non-interactive
else
    echo "⚠️  EAS CLI not found. Skipping mobile builds."
    echo "   Install with: npm install -g @expo/eas-cli"
    echo "   Then run: eas build --platform all"
fi

echo "✅ Build process completed!"
echo "📁 Web build available in: web-build/"
echo "📱 Mobile builds will be available in Expo dashboard"