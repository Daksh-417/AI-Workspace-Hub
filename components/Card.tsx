import React from 'react';
import { StyleSheet, View, Pressable, ViewStyle } from 'react-native';
import Colors from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  disabled?: boolean;
}

export default function Card({
  children,
  onPress,
  variant = 'default',
  padding = 'medium',
  style,
  disabled = false,
}: CardProps) {
  const getCardStyle = () => {
    const baseStyles: ViewStyle[] = [styles.card];
    
    // Add variant styles
    if (variant === 'elevated') {
      baseStyles.push(styles.elevated);
    } else if (variant === 'outlined') {
      baseStyles.push(styles.outlined);
    } else {
      baseStyles.push(styles.default);
    }
    
    // Add padding styles
    if (padding === 'small') {
      baseStyles.push(styles.smallPadding);
    } else if (padding === 'large') {
      baseStyles.push(styles.largePadding);
    } else if (padding === 'medium') {
      baseStyles.push(styles.mediumPadding);
    }
    
    if (disabled) {
      baseStyles.push(styles.disabled);
    }
    
    if (style) {
      baseStyles.push(style);
    }
    
    return baseStyles;
  };

  if (onPress && !disabled) {
    return (
      <Pressable
        style={({ pressed }) => [
          ...getCardStyle(),
          pressed && styles.pressed,
        ]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={getCardStyle()}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: Colors.light.card,
  },
  
  // Variants
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Padding
  smallPadding: {
    padding: 8,
  },
  mediumPadding: {
    padding: 16,
  },
  largePadding: {
    padding: 24,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.9,
  },
});