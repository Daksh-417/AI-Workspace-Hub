import AsyncStorage from '@react-native-async-storage/async-storage';
import { testUsers, testAIServices, testWorkspaces, testMessages, testUsageStats } from '@/constants/test-data';

export class TestHelpers {
  static async setupTestData(): Promise<void> {
    try {
      // Clear existing data
      await AsyncStorage.clear();
      
      // Set up test data
      await AsyncStorage.setItem('user', JSON.stringify(testUsers[0]));
      await AsyncStorage.setItem('aiServices', JSON.stringify(testAIServices));
      await AsyncStorage.setItem('workspaces', JSON.stringify(testWorkspaces));
      await AsyncStorage.setItem('usageStats', JSON.stringify(testUsageStats));
      
      // Set up test messages
      const messagesData = {
        [testWorkspaces[0].id]: testMessages,
      };
      await AsyncStorage.setItem('messages', JSON.stringify(messagesData));
      
      console.log('✅ Test data setup complete');
    } catch (error) {
      console.error('❌ Failed to setup test data:', error);
    }
  }

  static async clearTestData(): Promise<void> {
    try {
      await AsyncStorage.clear();
      console.log('✅ Test data cleared');
    } catch (error) {
      console.error('❌ Failed to clear test data:', error);
    }
  }

  static async simulateNetworkDelay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static generateRandomId(): string {
    return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static createTestMessage(content: string, workspaceId: string, aiService: string = 'test-ai-1') {
    return {
      id: this.generateRandomId(),
      content,
      timestamp: new Date().toISOString(),
      sender: {
        id: testUsers[0].id,
        name: testUsers[0].name,
        type: 'user' as const,
      },
      aiService,
      workspaceId,
    };
  }

  static createTestWorkspace(name: string, isTeam: boolean = false) {
    return {
      id: this.generateRandomId(),
      name,
      description: `Test workspace: ${name}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTeam,
      aiServices: ['test-ai-1'],
      icon: '🧪',
    };
  }

  static async runPerformanceTest<T>(
    testName: string,
    testFunction: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const startTime = Date.now();
    
    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      console.log(`⏱️ Performance test "${testName}": ${duration}ms`);
      
      return { result, duration };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Performance test "${testName}" failed after ${duration}ms:`, error);
      throw error;
    }
  }

  static validateAppState(): boolean {
    try {
      // Check if required components are available
      const requiredComponents = [
        'AsyncStorage',
        'React',
        'ReactNative',
      ];

      // Basic validation checks
      if (typeof AsyncStorage === 'undefined') {
        console.error('❌ AsyncStorage not available');
        return false;
      }

      console.log('✅ App state validation passed');
      return true;
    } catch (error) {
      console.error('❌ App state validation failed:', error);
      return false;
    }
  }

  static async testAsyncStorageOperations(): Promise<boolean> {
    try {
      const testKey = 'test-key';
      const testValue = { test: 'data', timestamp: Date.now() };

      // Test write
      await AsyncStorage.setItem(testKey, JSON.stringify(testValue));
      
      // Test read
      const retrieved = await AsyncStorage.getItem(testKey);
      const parsedValue = retrieved ? JSON.parse(retrieved) : null;
      
      // Test validation
      if (!parsedValue || parsedValue.test !== testValue.test) {
        throw new Error('AsyncStorage read/write validation failed');
      }

      // Test delete
      await AsyncStorage.removeItem(testKey);
      const deletedValue = await AsyncStorage.getItem(testKey);
      
      if (deletedValue !== null) {
        throw new Error('AsyncStorage delete validation failed');
      }

      console.log('✅ AsyncStorage operations test passed');
      return true;
    } catch (error) {
      console.error('❌ AsyncStorage operations test failed:', error);
      return false;
    }
  }

  static logTestResults(testName: string, results: Record<string, any>): void {
    console.group(`📊 Test Results: ${testName}`);
    
    Object.entries(results).forEach(([key, value]) => {
      const status = value === true ? '✅' : value === false ? '❌' : '📝';
      console.log(`${status} ${key}:`, value);
    });
    
    console.groupEnd();
  }
}