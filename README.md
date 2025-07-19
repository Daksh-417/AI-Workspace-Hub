# AI Workspace Hub

A comprehensive mobile application that unifies access to multiple world-leading AI services (ChatGPT, Claude, Gemini, DeepSeek) within intuitive, project-based workspaces.

## Features

### 🚀 Core Features
- **Unified Project Workspaces**: Organize AI interactions by project with persistent chat histories
- **Multi-AI Integration**: Connect and switch between leading AI services seamlessly
- **Cross-AI Collaboration**: Chat with different AI models within the same workspace
- **Usage Analytics**: Track AI usage, costs, and productivity metrics
- **Student Access**: Special pricing and enhanced access for verified students

### 🛠 Technical Features
- **Cross-Platform**: Built with React Native and Expo for iOS, Android, and Web
- **Offline Support**: Local caching with cloud sync capabilities
- **Real-time Updates**: Live collaboration and instant notifications
- **Security First**: End-to-end encryption and secure API integrations
- **Modern UI/UX**: Material Design principles with light/dark mode support

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/ai-workspace-hub.git
cd ai-workspace-hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
- **iOS**: Press `i` or scan QR code with Camera app
- **Android**: Press `a` or scan QR code with Expo Go app  
- **Web**: Press `w` or visit `http://localhost:19006`

## Project Structure

```
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based screens
│   ├── _layout.tsx        # Root layout
│   └── modal.tsx          # Modal screens
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks and stores
├── constants/             # App configuration and themes
├── utils/                 # Utility functions
├── types/                 # TypeScript type definitions
└── assets/               # Images and static assets
```

## Key Components

### State Management
- **React Query**: Server state and caching
- **@nkzw/create-context-hook**: Local state management
- **AsyncStorage**: Persistent storage

### Navigation
- **Expo Router**: File-based routing system
- **Tab Navigation**: Bottom tab bar for main screens
- **Stack Navigation**: Modal and detail screens

### AI Integration
- Modular adapters for different AI providers
- OAuth integration for secure connections
- Usage tracking and quota management

## Available Scripts

- `npm start` - Start Expo development server
- `npm run start-web` - Start web development server
- `npm run build` - Build for production
- `npm run test` - Run tests

## Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=https://api.aiworkspacehub.com
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key
EXPO_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_key
EXPO_PUBLIC_GOOGLE_API_KEY=your_google_key
```

## Deployment

### Web Deployment
```bash
npm run build:web
# Deploy the web-build folder to your hosting service
```

### Mobile App Store
```bash
# Build for iOS
expo build:ios

# Build for Android  
expo build:android
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@aiworkspacehub.com or join our Discord community.

## Roadmap

- [ ] Voice message support
- [ ] Advanced file sharing
- [ ] Team collaboration features
- [ ] Custom AI model integration
- [ ] Workflow automation
- [ ] API access for developers

---

Built with ❤️ using React Native and Expo