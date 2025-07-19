import { Platform } from 'react-native';

export class EncryptionService {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;

  static async generateKey(): Promise<CryptoKey | null> {
    if (Platform.OS === 'web' && 'crypto' in window && 'subtle' in window.crypto) {
      try {
        return await window.crypto.subtle.generateKey(
          {
            name: this.ALGORITHM,
            length: this.KEY_LENGTH,
          },
          true,
          ['encrypt', 'decrypt']
        );
      } catch (error) {
        console.error('Failed to generate encryption key:', error);
        return null;
      }
    }

    // For mobile platforms, you would use expo-crypto or react-native-keychain
    return null;
  }

  static async encrypt(data: string, key: CryptoKey): Promise<string | null> {
    if (Platform.OS === 'web' && 'crypto' in window && 'subtle' in window.crypto) {
      try {
        const encoder = new TextEncoder();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        
        const encrypted = await window.crypto.subtle.encrypt(
          {
            name: this.ALGORITHM,
            iv: iv,
          },
          key,
          encoder.encode(data)
        );

        const encryptedArray = new Uint8Array(encrypted);
        const combined = new Uint8Array(iv.length + encryptedArray.length);
        combined.set(iv);
        combined.set(encryptedArray, iv.length);

        return btoa(String.fromCharCode(...combined));
      } catch (error) {
        console.error('Failed to encrypt data:', error);
        return null;
      }
    }

    // For mobile platforms, return the data as-is (implement proper encryption)
    return data;
  }

  static async decrypt(encryptedData: string, key: CryptoKey): Promise<string | null> {
    if (Platform.OS === 'web' && 'crypto' in window && 'subtle' in window.crypto) {
      try {
        const combined = new Uint8Array(
          atob(encryptedData)
            .split('')
            .map(char => char.charCodeAt(0))
        );

        const iv = combined.slice(0, 12);
        const encrypted = combined.slice(12);

        const decrypted = await window.crypto.subtle.decrypt(
          {
            name: this.ALGORITHM,
            iv: iv,
          },
          key,
          encrypted
        );

        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
      } catch (error) {
        console.error('Failed to decrypt data:', error);
        return null;
      }
    }

    // For mobile platforms, return the data as-is (implement proper decryption)
    return encryptedData;
  }

  static hashString(input: string): string {
    // Simple hash function for demo purposes
    let hash = 0;
    if (input.length === 0) return hash.toString();
    
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString();
  }
}