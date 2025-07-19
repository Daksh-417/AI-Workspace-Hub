# AI Workspace Hub - Deployment Guide

This guide covers how to build and deploy the AI Workspace Hub app to production.

## Prerequisites

### Required Tools
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g @expo/eas-cli`)
- EAS CLI for mobile builds

### Accounts Needed
- Expo account (free)
- Apple Developer account (iOS deployment)
- Google Play Console account (Android deployment)
- Web hosting service (Netlify, Vercel, etc.)

## Environment Setup

1. **Create environment files:**
```bash
# .env.production
EXPO_PUBLIC_API_URL=https://api.aiworkspacehub.com
EXPO_PUBLIC_ENVIRONMENT=production
```

2. **Configure app.json:**
   - Update bundle identifiers
   - Set correct app store IDs
   - Configure permissions

3. **Configure eas.json:**
   - Set up build profiles
   - Configure submission settings

## Build Process

### 1. Pre-build Checks
```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Run tests (if available)
npm test
```

### 2. Web Build
```bash
# Build for web
npx expo export:web

# The build will be in web-build/ directory
```

### 3. Mobile Builds
```bash
# Login to Expo
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Build for both platforms
eas build --platform all --profile production
```

## Deployment

### Web Deployment

#### Option 1: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=web-build
```

#### Option 2: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod web-build
```

#### Option 3: Manual Upload
Upload the contents of `web-build/` to your web hosting service.

### Mobile App Store Deployment

#### iOS App Store
```bash
# Submit to App Store
eas submit --platform ios --profile production
```

**Requirements:**
- Apple Developer account ($99/year)
- App Store Connect app configured
- App icons and screenshots prepared

#### Google Play Store
```bash
# Submit to Google Play
eas submit --platform android --profile production
```

**Requirements:**
- Google Play Console account ($25 one-time)
- Service account key for API access
- App icons and screenshots prepared

## Post-Deployment

### 1. Monitoring
- Set up error tracking (Sentry, Bugsnag)
- Monitor app performance
- Track user analytics

### 2. Updates
```bash
# For web updates
npm run build:web && netlify deploy --prod --dir=web-build

# For mobile OTA updates
eas update --branch production --message "Bug fixes and improvements"
```

### 3. App Store Optimization
- Update app descriptions
- Add screenshots
- Respond to user reviews
- Monitor app store rankings

## Troubleshooting

### Common Build Issues

1. **TypeScript Errors**
   - Run `npx tsc --noEmit` to check for type errors
   - Fix all TypeScript issues before building

2. **Missing Assets**
   - Ensure all required assets are in the assets/ directory
   - Check app.json for correct asset paths

3. **Bundle Size Too Large**
   - Use `npx expo install --fix` to optimize dependencies
   - Remove unused imports and dependencies

4. **Platform-Specific Issues**
   - Test on both iOS and Android simulators
   - Check platform-specific permissions and configurations

### Build Optimization

1. **Reduce Bundle Size**
   - Use dynamic imports for large libraries
   - Optimize images and assets
   - Remove unused code

2. **Performance**
   - Enable Hermes for Android
   - Use React Native's built-in performance tools
   - Optimize re-renders with React.memo

3. **Security**
   - Never commit API keys or secrets
   - Use environment variables for configuration
   - Enable code obfuscation for production builds

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor app store reviews
- Update privacy policy and terms of service
- Backup user data and analytics

### Version Management
- Use semantic versioning (1.0.0, 1.0.1, 1.1.0)
- Tag releases in git
- Maintain changelog
- Test updates thoroughly before release

## Support

For deployment issues:
1. Check Expo documentation
2. Review build logs in Expo dashboard
3. Check platform-specific guidelines
4. Contact support if needed

---

**Note:** This is a production-ready deployment guide. Always test thoroughly in staging environments before deploying to production.