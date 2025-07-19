import { Platform } from 'react-native';

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  badge?: number;
}

export class NotificationService {
  private static isInitialized = false;

  static async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      if (Platform.OS === 'web') {
        if ('serviceWorker' in navigator && 'Notification' in window) {
          const permission = await Notification.requestPermission();
          this.isInitialized = permission === 'granted';
          return this.isInitialized;
        }
        return false;
      }

      // For mobile platforms, you would initialize expo-notifications here
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      return false;
    }
  }

  static async scheduleNotification(
    notification: NotificationData,
    delay: number = 0
  ): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      if (Platform.OS === 'web') {
        if ('Notification' in window && Notification.permission === 'granted') {
          if (delay > 0) {
            setTimeout(() => {
              new Notification(notification.title, {
                body: notification.body,
                badge: notification.badge ? String(notification.badge) : undefined,
                data: notification.data,
              });
            }, delay);
          } else {
            new Notification(notification.title, {
              body: notification.body,
              badge: notification.badge ? String(notification.badge) : undefined,
              data: notification.data,
            });
          }
          return true;
        }
        return false;
      }

      // For mobile platforms, you would use expo-notifications
      return true;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return false;
    }
  }

  static async showLocalNotification(notification: NotificationData): Promise<boolean> {
    return this.scheduleNotification(notification, 0);
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Web notifications are automatically handled by the browser
        return;
      }

      // For mobile platforms, you would use expo-notifications to cancel
    } catch (error) {
      console.error('Failed to cancel notifications:', error);
    }
  }

  static async getBadgeCount(): Promise<number> {
    try {
      if (Platform.OS === 'web') {
        return 0; // Web doesn't support badge count
      }

      // For mobile platforms, you would use expo-notifications
      return 0;
    } catch (error) {
      console.error('Failed to get badge count:', error);
      return 0;
    }
  }

  static async setBadgeCount(count: number): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        return; // Web doesn't support badge count
      }

      // For mobile platforms, you would use expo-notifications
    } catch (error) {
      console.error('Failed to set badge count:', error);
    }
  }
}