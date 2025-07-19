import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export default function ErrorMessage({ 
  message, 
  onDismiss, 
  type = 'error' 
}: ErrorMessageProps) {
  const getBackgroundColor = () => {
    switch (type) {
      case 'warning':
        return 'rgba(255, 193, 7, 0.1)';
      case 'info':
        return 'rgba(3, 218, 198, 0.1)';
      default:
        return 'rgba(244, 67, 54, 0.1)';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'warning':
        return Colors.light.warning;
      case 'info':
        return Colors.light.secondary;
      default:
        return Colors.light.error;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'warning':
        return Colors.light.warning;
      case 'info':
        return Colors.light.secondary;
      default:
        return Colors.light.error;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <AlertCircle size={20} color={getIconColor()} />
      <Text style={[styles.message, { color: getTextColor() }]}>{message}</Text>
      {onDismiss && (
        <Pressable onPress={onDismiss} style={styles.dismissButton}>
          <X size={16} color={getTextColor()} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    lineHeight: 18,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
});