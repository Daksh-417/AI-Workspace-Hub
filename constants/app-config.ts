export const APP_CONFIG = {
  name: 'AI Workspace Hub',
  version: '1.0.0',
  description: 'Unified AI workspace for productivity and collaboration',
  
  // API Configuration
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.aiworkspacehub.com',
    timeout: 30000,
  },
  
  // Feature Flags
  features: {
    fileUpload: true,
    voiceMessages: false,
    teamWorkspaces: true,
    analytics: true,
    notifications: true,
  },
  
  // Limits
  limits: {
    maxWorkspaces: 50,
    maxMessagesPerWorkspace: 1000,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxMessageLength: 4000,
  },
  
  // Storage Keys
  storage: {
    user: 'user',
    workspaces: 'workspaces',
    messages: 'messages',
    aiServices: 'aiServices',
    usageStats: 'usageStats',
    settings: 'settings',
  },
  
  // AI Service Providers
  aiProviders: {
    openai: {
      name: 'OpenAI',
      baseUrl: 'https://api.openai.com/v1',
      models: ['gpt-4', 'gpt-3.5-turbo'],
    },
    anthropic: {
      name: 'Anthropic',
      baseUrl: 'https://api.anthropic.com/v1',
      models: ['claude-3-opus', 'claude-3-sonnet'],
    },
    google: {
      name: 'Google',
      baseUrl: 'https://generativelanguage.googleapis.com/v1',
      models: ['gemini-pro', 'gemini-pro-vision'],
    },
  },
} as const;