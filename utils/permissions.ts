import { Platform, Alert, Linking } from 'react-native';

export interface PermissionResult {
  granted: boolean;
  canAskAgain: boolean;
  message?: string;
}

export class PermissionService {
  static async requestNotificationPermission(): Promise<PermissionResult> {
    if (Platform.OS === 'web') {
      try {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          return {
            granted: permission === 'granted',
            canAskAgain: permission !== 'denied',
          };
        }
        return { granted: false, canAskAgain: false };
      } catch (error) {
        return { granted: false, canAskAgain: false };
      }
    }

    // For mobile platforms, you would use expo-notifications
    // This is a placeholder for the actual implementation
    return { granted: true, canAskAgain: true };
  }

  static async requestCameraPermission(): Promise<PermissionResult> {
    if (Platform.OS === 'web') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        return { granted: true, canAskAgain: true };
      } catch (error) {
        return { 
          granted: false, 
          canAskAgain: true,
          message: 'Camera access denied. Please enable camera permissions in your browser settings.'
        };
      }
    }

    // For mobile platforms, you would use expo-camera permissions
    return { granted: true, canAskAgain: true };
  }

  static async requestMicrophonePermission(): Promise<PermissionResult> {
    if (Platform.OS === 'web') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return { granted: true, canAskAgain: true };
      } catch (error) {
        return { 
          granted: false, 
          canAskAgain: true,
          message: 'Microphone access denied. Please enable microphone permissions in your browser settings.'
        };
      }
    }

    // For mobile platforms, you would use expo-av permissions
    return { granted: true, canAskAgain: true };
  }

  static showPermissionAlert(
    title: string,
    message: string,
    onSettings?: () => void
  ): void {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        ...(onSettings ? [{ 
          text: 'Settings', 
          onPress: onSettings 
        }] : []),
      ]
    );
  }

  static openAppSettings(): void {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      // Web - show instructions
      Alert.alert(
        'Enable Permissions',
        'Please enable the required permissions in your browser settings and refresh the page.'
      );
    }
  }
}