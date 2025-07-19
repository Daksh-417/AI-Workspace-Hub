import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { UsageStats } from '@/types';

// Mock analytics data
const mockUsageStats: UsageStats[] = [
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

export const [AnalyticsContext, useAnalytics] = createContextHook(() => {
  const [usageStats, setUsageStats] = useState<UsageStats[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const storedStats = await AsyncStorage.getItem('usageStats');
        if (storedStats) {
          setUsageStats(JSON.parse(storedStats));
        } else {
          // For demo purposes, use mock data
          setUsageStats(mockUsageStats);
          await AsyncStorage.setItem('usageStats', JSON.stringify(mockUsageStats));
        }
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const updateUsageStats = async (newStats: UsageStats) => {
    try {
      // In a real app, we would update the stats based on actual usage
      // For demo purposes, we'll just add the new stats to the existing ones
      const updatedStats = [...usageStats, newStats];
      setUsageStats(updatedStats);
      await AsyncStorage.setItem('usageStats', JSON.stringify(updatedStats));
      return true;
    } catch (error) {
      console.error('Update usage stats failed:', error);
      return false;
    }
  };

  const getStatsByPeriod = (period: 'daily' | 'weekly' | 'monthly') => {
    return usageStats.filter(stat => stat.period === period);
  };

  const getTotalCost = (period: 'daily' | 'weekly' | 'monthly') => {
    return getStatsByPeriod(period).reduce((total, stat) => total + stat.cost, 0);
  };

  const getTotalMessages = (period: 'daily' | 'weekly' | 'monthly') => {
    return getStatsByPeriod(period).reduce((total, stat) => total + stat.messagesCount, 0);
  };

  const getTotalTokens = (period: 'daily' | 'weekly' | 'monthly') => {
    return getStatsByPeriod(period).reduce((total, stat) => total + stat.tokensUsed, 0);
  };

  return {
    usageStats,
    selectedPeriod,
    isLoading,
    setSelectedPeriod,
    updateUsageStats,
    getStatsByPeriod,
    getTotalCost,
    getTotalMessages,
    getTotalTokens,
    currentStats: getStatsByPeriod(selectedPeriod),
  };
});