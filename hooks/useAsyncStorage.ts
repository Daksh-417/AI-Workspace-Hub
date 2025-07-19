import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorHandler } from '@/utils/error-handler';

export function useAsyncStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => Promise<void>, boolean, string | null] {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          const parsedValue = JSON.parse(item);
          setStoredValue(parsedValue);
        }
      } catch (err) {
        const error = err as Error;
        ErrorHandler.logError(error, `useAsyncStorage.loadStoredValue.${key}`);
        setError('Failed to load stored data');
      } finally {
        setLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  const setValue = useCallback(async (value: T) => {
    try {
      setError(null);
      setStoredValue(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      const error = err as Error;
      ErrorHandler.logError(error, `useAsyncStorage.setValue.${key}`);
      setError('Failed to save data');
      // Revert the state change on error
      const item = await AsyncStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      } else {
        setStoredValue(defaultValue);
      }
    }
  }, [key, defaultValue]);

  return [storedValue, setValue, loading, error];
}