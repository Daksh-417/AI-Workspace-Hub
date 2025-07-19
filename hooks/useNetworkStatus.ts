import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: 'unknown',
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleOnline = () => {
        setNetworkStatus({
          isConnected: true,
          isInternetReachable: true,
          type: 'wifi',
        });
      };

      const handleOffline = () => {
        setNetworkStatus({
          isConnected: false,
          isInternetReachable: false,
          type: null,
        });
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Set initial state
      setNetworkStatus({
        isConnected: navigator.onLine,
        isInternetReachable: navigator.onLine,
        type: navigator.onLine ? 'wifi' : null,
      });

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    // For mobile platforms, you would use @react-native-netinfo/netinfo
    // This is a placeholder implementation
    return () => {};
  }, []);

  return networkStatus;
}