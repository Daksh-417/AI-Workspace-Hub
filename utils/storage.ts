import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '@/constants/app-config';

export class StorageService {
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      throw new Error(`Failed to store ${key}`);
    }
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw new Error(`Failed to remove ${key}`);
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error('Failed to clear storage');
    }
  }

  static async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  // App-specific storage methods
  static async storeUser(user: any): Promise<void> {
    return this.setItem(APP_CONFIG.storage.user, user);
  }

  static async getUser(): Promise<any> {
    return this.getItem(APP_CONFIG.storage.user);
  }

  static async storeWorkspaces(workspaces: any[]): Promise<void> {
    return this.setItem(APP_CONFIG.storage.workspaces, workspaces);
  }

  static async getWorkspaces(): Promise<any[]> {
    const workspaces = await this.getItem<any[]>(APP_CONFIG.storage.workspaces);
    return workspaces || [];
  }

  static async storeMessages(messages: Record<string, any[]>): Promise<void> {
    return this.setItem(APP_CONFIG.storage.messages, messages);
  }

  static async getMessages(): Promise<Record<string, any[]>> {
    const messages = await this.getItem<Record<string, any[]>>(APP_CONFIG.storage.messages);
    return messages || {};
  }
}