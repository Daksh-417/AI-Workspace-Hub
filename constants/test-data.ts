import { User, AIService, Workspace, Message, UsageStats } from '@/types';

// Test users for different scenarios
export const testUsers: User[] = [
  {
    id: 'test-user-1',
    name: 'Test Student',
    email: 'student@test.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    isStudent: true,
    studentVerified: true,
  },
  {
    id: 'test-user-2',
    name: 'Test Professional',
    email: 'pro@test.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=100&auto=format&fit=crop',
    isStudent: false,
    studentVerified: false,
  },
];

// Test AI services with various states
export const testAIServices: AIService[] = [
  {
    id: 'test-ai-1',
    name: 'Test ChatGPT',
    provider: 'openai',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/120px-ChatGPT_logo.svg.png',
    isConnected: true,
    description: 'Test OpenAI service for automated testing',
    capabilities: ['Text generation', 'Code assistance', 'Testing'],
    usageLimit: 100,
    usageRemaining: 75,
  },
  {
    id: 'test-ai-2',
    name: 'Test Claude',
    provider: 'anthropic',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Claude_%28AI%29_logo.svg/120px-Claude_%28AI%29_logo.svg.png',
    isConnected: false,
    description: 'Test Anthropic service for automated testing',
    capabilities: ['Long context', 'Document analysis', 'Testing'],
  },
];

// Test workspaces for different scenarios
export const testWorkspaces: Workspace[] = [
  {
    id: 'test-ws-1',
    name: 'Test Workspace 1',
    description: 'A test workspace for automated testing',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T12:00:00Z',
    isTeam: false,
    aiServices: ['test-ai-1'],
    icon: '🧪',
  },
  {
    id: 'test-ws-2',
    name: 'Test Team Workspace',
    description: 'A team workspace for collaboration testing',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T12:00:00Z',
    isTeam: true,
    aiServices: ['test-ai-1', 'test-ai-2'],
    icon: '👥',
  },
];

// Test messages for chat functionality
export const testMessages: Message[] = [
  {
    id: 'test-msg-1',
    content: 'Hello, this is a test message',
    timestamp: '2025-01-01T12:00:00Z',
    sender: {
      id: 'test-user-1',
      name: 'Test Student',
      type: 'user',
    },
    aiService: 'test-ai-1',
    workspaceId: 'test-ws-1',
  },
  {
    id: 'test-msg-2',
    content: 'This is a test response from AI',
    timestamp: '2025-01-01T12:01:00Z',
    sender: {
      id: 'test-ai-1',
      name: 'Test ChatGPT',
      type: 'ai',
    },
    aiService: 'test-ai-1',
    workspaceId: 'test-ws-1',
  },
];

// Test usage statistics
export const testUsageStats: UsageStats[] = [
  {
    aiService: 'test-ai-1',
    messagesCount: 10,
    tokensUsed: 1000,
    cost: 0.10,
    period: 'daily',
  },
  {
    aiService: 'test-ai-1',
    messagesCount: 50,
    tokensUsed: 5000,
    cost: 0.50,
    period: 'weekly',
  },
  {
    aiService: 'test-ai-1',
    messagesCount: 200,
    tokensUsed: 20000,
    cost: 2.00,
    period: 'monthly',
  },
];

// Test scenarios for edge cases
export const testScenarios = {
  emptyWorkspace: {
    id: 'empty-ws',
    name: 'Empty Workspace',
    description: 'Workspace with no messages or AI services',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    isTeam: false,
    aiServices: [],
    icon: '📭',
  },
  
  longMessage: {
    id: 'long-msg',
    content: 'This is a very long message that should test the text wrapping and display capabilities of the chat interface. '.repeat(10),
    timestamp: '2025-01-01T12:00:00Z',
    sender: {
      id: 'test-user-1',
      name: 'Test User',
      type: 'user' as const,
    },
    aiService: 'test-ai-1',
    workspaceId: 'test-ws-1',
  },
  
  specialCharacters: {
    id: 'special-msg',
    content: 'Testing special characters: 🚀 💻 🤖 ñáéíóú çñü @#$%^&*()[]{}|\\:";\'<>?,./',
    timestamp: '2025-01-01T12:00:00Z',
    sender: {
      id: 'test-user-1',
      name: 'Test User',
      type: 'user' as const,
    },
    aiService: 'test-ai-1',
    workspaceId: 'test-ws-1',
  },
  
  maxUsageService: {
    id: 'max-usage-ai',
    name: 'Max Usage AI',
    provider: 'other' as const,
    icon: 'https://via.placeholder.com/120',
    isConnected: true,
    description: 'AI service at maximum usage for testing limits',
    capabilities: ['Testing'],
    usageLimit: 100,
    usageRemaining: 0,
  },
};