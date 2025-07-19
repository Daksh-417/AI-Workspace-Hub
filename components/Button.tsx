import React from 'react';
import { StyleSheet, Text, Pressable, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import Colors from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    const baseStyles: ViewStyle[] = [styles.button];
    
    // Add size styles
    if (size === 'small') {
      baseStyles.push(styles.small);
    } else if (size === 'large') {
      baseStyles.push(styles.large);
    } else {
      baseStyles.push(styles.medium);
    }
    
    // Add variant styles
    if (variant === 'secondary') {
      baseStyles.push(styles.secondary);
    } else if (variant === 'outline') {
      baseStyles.push(styles.outline);
    } else if (variant === 'ghost') {
      baseStyles.push(styles.ghost);
    } else {
      baseStyles.push(styles.primary);
    }
    
    // Add conditional styles
    if (fullWidth) {
      baseStyles.push(styles.fullWidth);
    }
    
    if (isDisabled) {
      baseStyles.push(styles.disabled);
    }
    
    if (style) {
      baseStyles.push(style);
    }
    
    return baseStyles;
  };

  const getTextStyle = () => {
    const baseStyles: TextStyle[] = [styles.text];
    
    // Add size text styles
    if (size === 'small') {
      baseStyles.push(styles.smallText);
    } else if (size === 'large') {
      baseStyles.push(styles.largeText);
    } else {
      baseStyles.push(styles.mediumText);
    }
    
    // Add variant text styles
    if (variant === 'secondary') {
      baseStyles.push(styles.secondaryText);
    } else if (variant === 'outline') {
      baseStyles.push(styles.outlineText);
    } else if (variant === 'ghost') {
      baseStyles.push(styles.ghostText);
    } else {
      baseStyles.push(styles.primaryText);
    }
    
    if (isDisabled) {
      baseStyles.push(styles.disabledText);
    }
    
    if (textStyle) {
      baseStyles.push(textStyle);
    }
    
    return baseStyles;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        ...getButtonStyle(),
        pressed && !isDisabled && styles.pressed,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#FFFFFF' : Colors.light.primary}
          style={styles.loader}
        />
      )}
      {icon && !loading && (
        <React.Fragment>{icon}</React.Fragment>
      )}
      <Text style={getTextStyle()}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  fullWidth: {
    width: '100%',
  },
  
  // Sizes
  small: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    minHeight: 48,
  },
  
  // Variants
  primary: {
    backgroundColor: Colors.light.primary,
  },
  secondary: {
    backgroundColor: Colors.light.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: Colors.light.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  
  // States
  disabled: {
    backgroundColor: Colors.light.inactive,
    borderColor: Colors.light.inactive,
  },
  pressed: {
    opacity: 0.8,
  },
  
  // Text styles
  text: {
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  // Text variants
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: Colors.light.primary,
  },
  ghostText: {
    color: Colors.light.primary,
  },
  disabledText: {
    color: '#FFFFFF',
  },
  
  loader: {
    marginRight: 8,
  },
});