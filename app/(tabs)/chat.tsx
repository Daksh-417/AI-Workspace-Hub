import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  Alert
} from 'react-native';
import { Send, Paperclip, ChevronDown, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useWorkspaces } from '@/hooks/workspace-store';
import { useAIServices } from '@/hooks/ai-services-store';
import { useChat } from '@/hooks/chat-store';
import ChatMessage from '@/components/ChatMessage';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function ChatScreen() {
  const { currentWorkspace } = useWorkspaces();
  const { aiServices } = useAIServices();
  const { 
    getWorkspaceMessages, 
    sendMessage, 
    currentAIService, 
    switchAIService, 
    isLoading,
    isSending,
    error,
    clearError
  } = useChat();
  
  const [message, setMessage] = useState('');
  const [showAISelector, setShowAISelector] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  const workspaceMessages = currentWorkspace 
    ? getWorkspaceMessages(currentWorkspace.id)
    : [];
  
  const connectedServices = aiServices.filter(service => service.isConnected);
  const currentService = aiServices.find(service => service.id === currentAIService);
  
  useEffect(() => {
    // Set default AI service if not already set
    if (!currentAIService && connectedServices.length > 0) {
      switchAIService(connectedServices[0].id);
    }
  }, [connectedServices, currentAIService]);
  
  const handleSend = async () => {
    if (!message.trim() || !currentWorkspace || !currentAIService || isSending) return;
    
    const messageToSend = message;
    setMessage(''); // Clear input immediately for better UX
    
    const result = await sendMessage(messageToSend, currentWorkspace.id, currentAIService);
    
    if (result) {
      // Scroll to bottom after sending
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } else {
      // Restore message if sending failed
      setMessage(messageToSend);
    }
  };
  
  const handleSelectAI = (serviceId: string) => {
    switchAIService(serviceId);
    setShowAISelector(false);
  };

  const handleAttachment = () => {
    Alert.alert(
      "Attachments",
      "File attachment feature coming soon!",
      [{ text: "OK" }]
    );
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner text="Loading chat..." />
      </View>
    );
  }
  
  if (!currentWorkspace) {
    return (
      <View style={styles.noWorkspaceContainer}>
        <AlertCircle size={48} color={Colors.light.subtext} />
        <Text style={styles.noWorkspaceTitle}>No Workspace Selected</Text>
        <Text style={styles.noWorkspaceText}>
          Please select or create a workspace to start chatting with AI assistants.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <View style={styles.workspaceInfo}>
          <Text style={styles.workspaceName}>{currentWorkspace.name}</Text>
          <Text style={styles.workspaceIcon}>{currentWorkspace.icon || '📁'}</Text>
        </View>
        
        <Pressable 
          style={styles.aiSelector}
          onPress={() => setShowAISelector(!showAISelector)}
          disabled={connectedServices.length === 0}
        >
          {currentService && (
            <Image 
              source={{ uri: currentService.icon }} 
              style={styles.aiIcon} 
              resizeMode="contain"
            />
          )}
          <Text style={styles.aiName}>
            {currentService ? currentService.name : 'Select AI'}
          </Text>
          <ChevronDown size={16} color={Colors.light.text} />
        </Pressable>
      </View>
      
      {showAISelector && (
        <View style={styles.aiSelectorDropdown}>
          {connectedServices.length > 0 ? (
            connectedServices.map(service => (
              <Pressable
                key={service.id}
                style={[
                  styles.aiOption,
                  service.id === currentAIService && styles.selectedAiOption
                ]}
                onPress={() => handleSelectAI(service.id)}
              >
                <Image 
                  source={{ uri: service.icon }} 
                  style={styles.aiOptionIcon} 
                  resizeMode="contain"
                />
                <Text style={[
                  styles.aiOptionName,
                  service.id === currentAIService && styles.selectedAiOptionName
                ]}>
                  {service.name}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text style={styles.noAIText}>
              No connected AI services. Please connect services in the AI Hub.
            </Text>
          )}
        </View>
      )}
      
      {error && (
        <ErrorMessage 
          message={error} 
          onDismiss={clearError}
          type="error"
        />
      )}
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        {workspaceMessages.length > 0 ? (
          workspaceMessages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))
        ) : (
          <View style={styles.emptyChat}>
            <Text style={styles.emptyChatTitle}>Start a conversation</Text>
            <Text style={styles.emptyChatText}>
              Send a message to start chatting with {currentService?.name || 'AI assistant'}
            </Text>
          </View>
        )}
        
        {isSending && (
          <View style={styles.sendingIndicator}>
            <LoadingSpinner size="small" text="Sending..." />
          </View>
        )}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <Pressable 
          style={styles.attachButton}
          onPress={handleAttachment}
        >
          <Paperclip size={20} color={Colors.light.subtext} />
        </Pressable>
        
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder={`Message ${currentService?.name || 'AI assistant'}...`}
          placeholderTextColor={Colors.light.subtext}
          multiline
          maxLength={1000}
          editable={!isSending && !!currentAIService}
        />
        
        <Pressable 
          style={[
            styles.sendButton,
            (!message.trim() || !currentAIService || isSending) && styles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={!message.trim() || !currentAIService || isSending}
        >
          <Send size={20} color={(!message.trim() || !currentAIService || isSending) ? Colors.light.inactive : '#FFFFFF'} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  workspaceInfo: {
    flex: 1,
  },
  workspaceName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  workspaceIcon: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginTop: 2,
  },
  aiSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
  },
  aiIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    borderRadius: 4,
  },
  aiName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    marginRight: 4,
    flex: 1,
  },
  aiSelectorDropdown: {
    position: 'absolute',
    top: 70,
    right: 16,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minWidth: 200,
  },
  aiOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  selectedAiOption: {
    backgroundColor: `${Colors.light.primary}10`,
  },
  aiOptionIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 4,
  },
  aiOptionName: {
    fontSize: 14,
    color: Colors.light.text,
  },
  selectedAiOptionName: {
    fontWeight: '600',
    color: Colors.light.primary,
  },
  noAIText: {
    fontSize: 14,
    color: Colors.light.subtext,
    padding: 12,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyChatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyChatText: {
    fontSize: 14,
    color: Colors.light.subtext,
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 20,
  },
  sendingIndicator: {
    alignItems: 'center',
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  attachButton: {
    padding: 8,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    marginHorizontal: 8,
    color: Colors.light.text,
  },
  sendButton: {
    backgroundColor: Colors.light.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.light.card,
  },
  noWorkspaceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  noWorkspaceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 12,
  },
  noWorkspaceText: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 22,
  },
});