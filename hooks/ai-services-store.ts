import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { AIService } from '@/types';

// Mock AI services data
const mockAIServices: AIService[] = [
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

export const [AIServicesContext, useAIServices] = createContextHook(() => {
  const [aiServices, setAIServices] = useState<AIService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAIServices = async () => {
      try {
        const storedServices = await AsyncStorage.getItem('aiServices');
        if (storedServices) {
          setAIServices(JSON.parse(storedServices));
        } else {
          // For demo purposes, use mock data
          setAIServices(mockAIServices);
          await AsyncStorage.setItem('aiServices', JSON.stringify(mockAIServices));
        }
      } catch (error) {
        console.error('Failed to load AI services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAIServices();
  }, []);

  const connectService = async (id: string) => {
    try {
      const updatedServices = aiServices.map(service => 
        service.id === id ? { ...service, isConnected: true } : service
      );
      
      setAIServices(updatedServices);
      await AsyncStorage.setItem('aiServices', JSON.stringify(updatedServices));
      return true;
    } catch (error) {
      console.error('Connect service failed:', error);
      return false;
    }
  };

  const disconnectService = async (id: string) => {
    try {
      const updatedServices = aiServices.map(service => 
        service.id === id ? { ...service, isConnected: false } : service
      );
      
      setAIServices(updatedServices);
      await AsyncStorage.setItem('aiServices', JSON.stringify(updatedServices));
      return true;
    } catch (error) {
      console.error('Disconnect service failed:', error);
      return false;
    }
  };

  const updateServiceUsage = async (id: string, usageRemaining: number) => {
    try {
      const updatedServices = aiServices.map(service => 
        service.id === id ? { ...service, usageRemaining } : service
      );
      
      setAIServices(updatedServices);
      await AsyncStorage.setItem('aiServices', JSON.stringify(updatedServices));
      return true;
    } catch (error) {
      console.error('Update service usage failed:', error);
      return false;
    }
  };

  return {
    aiServices,
    isLoading,
    connectService,
    disconnectService,
    updateServiceUsage,
  };
});