import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import Colors from '@/constants/colors';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  text?: string;
  color?: string;
}

export default function LoadingSpinner({ 
  size = 'large', 
  text, 
  color = Colors.light.primary 
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: Colors.light.subtext,
    marginTop: 12,
    textAlign: 'center',
  },
});