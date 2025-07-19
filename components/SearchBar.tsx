import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onSubmit?: (text: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
}

export default function SearchBar({
  placeholder = 'Search...',
  value = '',
  onChangeText,
  onClear,
  onSubmit,
  autoFocus = false,
  disabled = false,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChangeText = (text: string) => {
    setInternalValue(text);
    onChangeText(text);
  };

  const handleClear = () => {
    setInternalValue('');
    onChangeText('');
    onClear?.();
  };

  const handleSubmit = () => {
    onSubmit?.(internalValue);
  };

  return (
    <View style={[
      styles.container,
      isFocused && styles.focused,
      disabled && styles.disabled,
    ]}>
      <Search size={20} color={Colors.light.subtext} style={styles.searchIcon} />
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.subtext}
        value={internalValue}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={handleSubmit}
        autoFocus={autoFocus}
        editable={!disabled}
        returnKeyType="search"
      />
      
      {internalValue.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <X size={16} color={Colors.light.subtext} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  focused: {
    borderColor: Colors.light.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});