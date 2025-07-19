import React from 'react';
import { 
  StyleSheet, 
  View, 
  Modal as RNModal, 
  Pressable, 
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
  onBackdropPress?: () => void;
}

export default function Modal({
  visible,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  animationType = 'slide',
  transparent = true,
  onBackdropPress,
}: ModalProps) {
  const handleBackdropPress = () => {
    if (onBackdropPress) {
      onBackdropPress();
    } else {
      onClose();
    }
  };

  const getModalStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallModal;
      case 'large':
        return styles.largeModal;
      case 'fullscreen':
        return styles.fullscreenModal;
      default:
        return styles.mediumModal;
    }
  };

  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.backdrop} onPress={handleBackdropPress}>
          <Pressable style={[styles.modal, getModalStyle()]} onPress={() => {}}>
            {(title || showCloseButton) && (
              <View style={styles.header}>
                {title && <Text style={styles.title}>{title}</Text>}
                {showCloseButton && (
                  <Pressable onPress={onClose} style={styles.closeButton}>
                    <X size={24} color={Colors.light.text} />
                  </Pressable>
                )}
              </View>
            )}
            
            <ScrollView 
              style={styles.content}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {children}
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Sizes
  smallModal: {
    width: '80%',
    maxWidth: 300,
  },
  mediumModal: {
    width: '90%',
    maxWidth: 400,
  },
  largeModal: {
    width: '95%',
    maxWidth: 600,
  },
  fullscreenModal: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    margin: 0,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});