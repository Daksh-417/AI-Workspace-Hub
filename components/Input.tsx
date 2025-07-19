import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'small' | 'medium' | 'large';
  required?: boolean;
  showPasswordToggle?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'medium',
  required = false,
  showPasswordToggle = false,
  secureTextEntry,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const isSecure = secureTextEntry && !isPasswordVisible;
  const hasError = !!error;

  const getContainerStyle = () => {
    const baseStyles: ViewStyle[] = [styles.container];
    
    // Add variant styles
    if (variant === 'filled') {
      baseStyles.push(styles.filled);
    } else if (variant === 'outline') {
      baseStyles.push(styles.outline);
    } else {
      baseStyles.push(styles.default);
    }
    
    // Add size styles
    if (size === 'small') {
      baseStyles.push(styles.small);
    } else if (size === 'large') {
      baseStyles.push(styles.large);
    } else {
      baseStyles.push(styles.medium);
    }
    
    if (isFocused) {
      baseStyles.push(styles.focused);
    }
    
    if (hasError) {
      baseStyles.push(styles.error);
    }
    
    return baseStyles;
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={getContainerStyle()}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[styles.input, style]}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={Colors.light.subtext}
          {...props}
        />
        
        {showPasswordToggle && secureTextEntry && (
          <Pressable onPress={togglePasswordVisibility} style={styles.rightIcon}>
            {isPasswordVisible ? (
              <EyeOff size={20} color={Colors.light.subtext} />
            ) : (
              <Eye size={20} color={Colors.light.subtext} />
            )}
          </Pressable>
        )}
        
        {rightIcon && !showPasswordToggle && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {(error || helperText) && (
        <Text style={[styles.helperText, hasError && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  required: {
    color: Colors.light.error,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  
  // Variants
  default: {
    backgroundColor: Colors.light.card,
    borderColor: Colors.light.border,
  },
  filled: {
    backgroundColor: Colors.light.card,
    borderColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: Colors.light.border,
  },
  
  // Sizes
  small: {
    minHeight: 36,
    paddingHorizontal: 12,
  },
  medium: {
    minHeight: 44,
    paddingHorizontal: 16,
  },
  large: {
    minHeight: 52,
    paddingHorizontal: 20,
  },
  
  // States
  focused: {
    borderColor: Colors.light.primary,
  },
  error: {
    borderColor: Colors.light.error,
  },
  
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
    padding: 4,
  },
  helperText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginTop: 4,
  },
  errorText: {
    color: Colors.light.error,
  },
});