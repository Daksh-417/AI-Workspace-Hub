export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isStudent: boolean;
  studentVerified: boolean;
};

export type AIService = {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'deepseek' | 'other';
  icon: string;
  isConnected: boolean;
  description: string;
  capabilities: string[];
  usageLimit?: number;
  usageRemaining?: number;
};

export type Workspace = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isTeam: boolean;
  members?: User[];
  aiServices: string[]; // IDs of connected AI services
  recentActivity?: Activity[];
  icon?: string;
};

export type Activity = {
  id: string;
  type: 'message' | 'file' | 'update' | 'join';
  content: string;
  timestamp: string;
  user?: User;
  aiService?: string;
};

export type Message = {
  id: string;
  content: string;
  timestamp: string;
  sender: {
    id: string;
    name: string;
    type: 'user' | 'ai';
    avatar?: string;
  };
  aiService?: string;
  workspaceId: string;
  attachments?: Attachment[];
};

export type Attachment = {
  id: string;
  name: string;
  type: 'image' | 'document' | 'other';
  url: string;
  size?: number;
};

export type UsageStats = {
  aiService: string;
  messagesCount: number;
  tokensUsed: number;
  cost: number;
  period: 'daily' | 'weekly' | 'monthly';
};