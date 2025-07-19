#!/bin/bash

# AI Workspace Hub - Deployment Script
# This script deploys the built app to various platforms

echo "🚀 Starting AI Workspace Hub deployment process..."

# Check if build exists
if [ ! -d "web-build" ]; then
    echo "❌ Web build not found. Run build script first."
    exit 1
fi

# Deploy to web (example for Netlify)
if command -v netlify >/dev/null 2>&1; then
    echo "🌐 Deploying to Netlify..."
    netlify deploy --prod --dir=web-build
else
    echo "⚠️  Netlify CLI not found. Web deployment skipped."
    echo "   You can manually upload the web-build/ folder to your hosting service"
fi

# Submit to app stores (requires EAS CLI)
if command -v eas >/dev/null 2>&1; then
    echo "📱 Submitting to app stores..."
    
    # Submit to App Store
    echo "🍎 Submitting to App Store..."
    eas submit --platform ios --profile production
    
    # Submit to Google Play
    echo "🤖 Submitting to Google Play..."
    eas submit --platform android --profile production
else
    echo "⚠️  EAS CLI not found. App store submissions skipped."
    echo "   Install with: npm install -g @expo/eas-cli"
    echo "   Then run: eas submit --platform all"
fi

echo "✅ Deployment process completed!"
echo "🌐 Web app should be live shortly"
echo "📱 Mobile apps are being reviewed by app stores"