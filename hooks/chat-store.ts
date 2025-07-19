import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Message } from '@/types';
import { useAuth } from './auth-store';
import { useWorkspaces } from './workspace-store';

// Mock messages data
const generateMockMessages = (workspaceId: string): Message[] => [
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

export const [ChatContext, useChat] = createContextHook(() => {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [currentAIService, setCurrentAIService] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaces();

  useEffect(() => {
    const loadMessages = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setError(null);
        const storedMessages = await AsyncStorage.getItem('messages');
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        } else if (currentWorkspace) {
          // For demo purposes, use mock data for the current workspace
          const mockData = {
            [currentWorkspace.id]: generateMockMessages(currentWorkspace.id),
          };
          setMessages(mockData);
          await AsyncStorage.setItem('messages', JSON.stringify(mockData));
        }
        
        // Set default AI service if available
        if (currentWorkspace?.aiServices && currentWorkspace.aiServices.length > 0) {
          setCurrentAIService(currentWorkspace.aiServices[0]);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        setError('Failed to load messages. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [user, currentWorkspace]);

  const sendMessage = async (content: string, workspaceId: string, aiServiceId: string) => {
    if (!user || !workspaceId || !content.trim()) return null;
    
    setIsSending(true);
    setError(null);
    
    try {
      const now = new Date().toISOString();
      
      // Create user message
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        content: content.trim(),
        timestamp: now,
        sender: {
          id: user.id,
          name: user.name,
          type: 'user',
          avatar: user.avatar,
        },
        aiService: aiServiceId,
        workspaceId,
      };
      
      // Update messages state
      const workspaceMessages = messages[workspaceId] || [];
      const updatedWorkspaceMessages = [...workspaceMessages, userMessage];
      
      const updatedMessages = {
        ...messages,
        [workspaceId]: updatedWorkspaceMessages,
      };
      
      setMessages(updatedMessages);
      await AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
      
      // In a real app, we would call the AI service API here
      // For demo purposes, simulate an AI response after a delay
      setTimeout(async () => {
        try {
          const aiService = aiServiceId === 'ai-1' ? {
            id: 'ai-1',
            name: 'ChatGPT',
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/120px-ChatGPT_logo.svg.png',
          } : aiServiceId === 'ai-3' ? {
            id: 'ai-3',
            name: 'Gemini',
            avatar: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini_1.max-100x100.png',
          } : {
            id: aiServiceId,
            name: 'AI Assistant',
          };
          
          const aiResponse: Message = {
            id: `msg-${Date.now()}`,
            content: `This is a simulated response from ${aiService.name}. In a real app, this would be generated by the actual AI service based on your message: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
            timestamp: new Date().toISOString(),
            sender: {
              id: aiService.id,
              name: aiService.name,
              type: 'ai',
              avatar: aiService.avatar,
            },
            aiService: aiServiceId,
            workspaceId,
          };
          
          const currentMessages = await AsyncStorage.getItem('messages');
          const parsedMessages = currentMessages ? JSON.parse(currentMessages) : {};
          const currentWorkspaceMessages = parsedMessages[workspaceId] || [];
          const updatedWithResponse = [...currentWorkspaceMessages, aiResponse];
          
          const finalMessages = {
            ...parsedMessages,
            [workspaceId]: updatedWithResponse,
          };
          
          setMessages(finalMessages);
          await AsyncStorage.setItem('messages', JSON.stringify(finalMessages));
        } catch (error) {
          console.error('Failed to generate AI response:', error);
          setError('Failed to get AI response. Please try again.');
        }
      }, 1500);
      
      return userMessage;
    } catch (error) {
      console.error('Send message failed:', error);
      setError('Failed to send message. Please try again.');
      return null;
    } finally {
      setIsSending(false);
    }
  };

  const clearChat = async (workspaceId: string) => {
    try {
      setError(null);
      const updatedMessages = { ...messages };
      delete updatedMessages[workspaceId];
      
      setMessages(updatedMessages);
      await AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
      return true;
    } catch (error) {
      console.error('Clear chat failed:', error);
      setError('Failed to clear chat. Please try again.');
      return false;
    }
  };

  const switchAIService = (aiServiceId: string) => {
    setCurrentAIService(aiServiceId);
    setError(null);
    return true;
  };

  const clearError = () => {
    setError(null);
  };

  return {
    messages,
    currentAIService,
    isLoading,
    isSending,
    error,
    sendMessage,
    clearChat,
    switchAIService,
    clearError,
    getWorkspaceMessages: (workspaceId: string) => messages[workspaceId] || [],
  };
});