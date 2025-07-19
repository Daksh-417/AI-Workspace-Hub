import { User, AIService, Workspace, Message, UsageStats } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    isStudent: true,
    studentVerified: true,
  },
  {
    id: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=100&auto=format&fit=crop',
    isStudent: false,
    studentVerified: false,
  },
];

export const mockAIServices: AIService[] = [
  {
    id: 'ai-1',
    name: 'ChatGPT',
    provider: 'openai',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/120px-ChatGPT_logo.svg.png',
    isConnected: true,
    description: 'OpenAI\'s powerful language model for text generation and conversation.',
    capabilities: ['Text generation', 'Code assistance', 'Creative writing', 'Research help'],
    usageLimit: 1000,
    usageRemaining: 750,
  },
  {
    id: 'ai-2',
    name: 'Claude',
    provider: 'anthropic',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Claude_%28AI%29_logo.svg/120px-Claude_%28AI%29_logo.svg.png',
    isConnected: false,
    description: 'Anthropic\'s AI assistant focused on helpfulness, harmlessness, and honesty.',
    capabilities: ['Long context', 'Document analysis', 'Nuanced reasoning', 'Safety features'],
  },
  {
    id: 'ai-3',
    name: 'Gemini',
    provider: 'google',
    icon: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini_1.max-100x100.png',
    isConnected: true,
    description: 'Google\'s multimodal AI system that can understand and generate text, images, and code.',
    capabilities: ['Multimodal understanding', 'Code generation', 'Problem solving', 'Creative content'],
    usageLimit: 500,
    usageRemaining: 320,
  },
  {
    id: 'ai-4',
    name: 'DeepSeek',
    provider: 'deepseek',
    icon: 'https://avatars.githubusercontent.com/u/145890654?s=200&v=4',
    isConnected: false,
    description: 'Advanced AI model specialized in deep reasoning and complex problem solving.',
    capabilities: ['Deep reasoning', 'Technical expertise', 'Mathematical problem solving', 'Research assistance'],
  },
];

export const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Research Project',
    description: 'AI-assisted research on renewable energy',
    createdAt: '2025-07-10T14:30:00Z',
    updatedAt: '2025-07-18T09:15:00Z',
    isTeam: true,
    aiServices: ['ai-1', 'ai-2'],
    icon: '🔬',
    recentActivity: [
      {
        id: 'act-1',
        type: 'message',
        content: 'Added new research paper on solar efficiency',
        timestamp: '2025-07-18T09:15:00Z',
      }
    ]
  },
  {
    id: 'ws-2',
    name: 'Essay Writing',
    description: 'Working on college application essays',
    createdAt: '2025-07-12T10:00:00Z',
    updatedAt: '2025-07-17T16:45:00Z',
    isTeam: false,
    aiServices: ['ai-1'],
    icon: '📝',
  },
  {
    id: 'ws-3',
    name: 'Product Design',
    description: 'Collaborative design for new mobile app',
    createdAt: '2025-07-05T08:20:00Z',
    updatedAt: '2025-07-15T11:30:00Z',
    isTeam: true,
    aiServices: ['ai-2', 'ai-3'],
    icon: '🎨',
  },
];

export const mockUsageStats: UsageStats[] = [
  {
    aiService: 'ai-1',
    messagesCount: 145,
    tokensUsed: 28500,
    cost: 0.57,
    period: 'monthly',
  },
  {
    aiService: 'ai-3',
    messagesCount: 87,
    tokensUsed: 15200,
    cost: 0.32,
    period: 'monthly',
  },
  {
    aiService: 'ai-1',
    messagesCount: 42,
    tokensUsed: 8300,
    cost: 0.17,
    period: 'weekly',
  },
  {
    aiService: 'ai-3',
    messagesCount: 23,
    tokensUsed: 4100,
    cost: 0.09,
    period: 'weekly',
  },
  {
    aiService: 'ai-1',
    messagesCount: 8,
    tokensUsed: 1500,
    cost: 0.03,
    period: 'daily',
  },
  {
    aiService: 'ai-3',
    messagesCount: 5,
    tokensUsed: 900,
    cost: 0.02,
    period: 'daily',
  },
];

export const generateMockMessages = (workspaceId: string): Message[] => [
  {
    id: 'msg-1',
    content: 'Can you help me research the latest advancements in solar panel efficiency?',
    timestamp: '2025-07-18T09:10:00Z',
    sender: {
      id: 'user-1',
      name: 'Alex Johnson',
      type: 'user',
    },
    aiService: 'ai-1',
    workspaceId,
  },
  {
    id: 'msg-2',
    content: `Of course! Recent advancements in solar panel efficiency have focused on several key areas:

1. Perovskite solar cells have achieved efficiency rates above 25%, approaching traditional silicon cells while being cheaper to produce.

2. Tandem solar cells combining multiple materials can now exceed 30% efficiency in lab settings.

3. Bifacial solar panels that capture light from both sides are seeing increased adoption, with 10-20% energy gains in optimal conditions.

Would you like me to elaborate on any of these technologies?`,
    timestamp: '2025-07-18T09:12:00Z',
    sender: {
      id: 'ai-1',
      name: 'ChatGPT',
      type: 'ai',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/120px-ChatGPT_logo.svg.png',
    },
    aiService: 'ai-1',
    workspaceId,
  },
  {
    id: 'msg-3',
    content: 'Tell me more about perovskite solar cells and their commercial viability.',
    timestamp: '2025-07-18T09:15:00Z',
    sender: {
      id: 'user-1',
      name: 'Alex Johnson',
      type: 'user',
    },
    aiService: 'ai-1',
    workspaceId,
  },
];