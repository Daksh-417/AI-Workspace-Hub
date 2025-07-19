import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, Platform } from 'react-native';
import { Upload, File, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface FileUploadProps {
  onFileSelect: (file: File | { uri: string; name: string; type: string }) => void;
  onRemove?: () => void;
  selectedFile?: File | { uri: string; name: string; type: string } | null;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
  disabled?: boolean;
}

export default function FileUpload({
  onFileSelect,
  onRemove,
  selectedFile,
  acceptedTypes = ['image/*', 'application/pdf', 'text/*'],
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = () => {
    if (disabled) return;

    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = acceptedTypes.join(',');
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          validateAndSelectFile(file);
        }
      };
      input.click();
    } else {
      // For mobile platforms, you would use expo-document-picker
      Alert.alert(
        'File Upload',
        'File upload feature will be available in the next update.',
        [{ text: 'OK' }]
      );
    }
  };

  const validateAndSelectFile = (file: File | { uri: string; name: string; type: string; size?: number }) => {
    const fileSize = 'size' in file ? file.size : 0;
    const fileName = 'name' in file ? file.name : 'Unknown file';

    if (fileSize > 0 && fileSize > maxSize) {
      Alert.alert(
        'File Too Large',
        `The selected file (${(fileSize / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum size limit of ${(maxSize / (1024 * 1024)).toFixed(1)}MB.`,
        [{ text: 'OK' }]
      );
      return;
    }

    onFileSelect(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (selectedFile) {
    const fileName = 'name' in selectedFile ? selectedFile.name : 'Selected file';
    const fileSize = 'size' in selectedFile ? selectedFile.size : 0;

    return (
      <View style={styles.selectedFileContainer}>
        <View style={styles.fileInfo}>
          <File size={20} color={Colors.light.primary} />
          <View style={styles.fileDetails}>
            <Text style={styles.fileName} numberOfLines={1}>
              {fileName}
            </Text>
            {fileSize > 0 && (
              <Text style={styles.fileSize}>
                {formatFileSize(fileSize)}
              </Text>
            )}
          </View>
        </View>
        {onRemove && (
          <Pressable onPress={onRemove} style={styles.removeButton}>
            <X size={16} color={Colors.light.error} />
          </Pressable>
        )}
      </View>
    );
  }

  // Mobile version without drag and drop
  return (
    <Pressable
      style={[
        styles.uploadContainer,
        disabled && styles.disabled,
      ]}
      onPress={handleFileSelect}
      disabled={disabled}
    >
      <Upload size={24} color={disabled ? Colors.light.inactive : Colors.light.primary} />
      <Text style={[styles.uploadText, disabled && styles.disabledText]}>
        Tap to select file
      </Text>
      <Text style={[styles.uploadSubtext, disabled && styles.disabledText]}>
        Max size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  uploadContainer: {
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.card,
    minHeight: 100,
  },
  disabled: {
    opacity: 0.5,
  },
  uploadText: {
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 8,
    textAlign: 'center',
  },
  uploadSubtext: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginTop: 4,
    textAlign: 'center',
  },
  disabledText: {
    color: Colors.light.inactive,
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileDetails: {
    marginLeft: 8,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.text,
  },
  fileSize: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
});