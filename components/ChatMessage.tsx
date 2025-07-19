import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Message } from '@/types';
import Colors from '@/constants/colors';
import { formatTime } from '@/utils/date';

type ChatMessageProps = {
  message: Message;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender.type === 'user';

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.aiContainer
    ]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          {message.sender.avatar ? (
            <Image 
              source={{ uri: message.sender.avatar }} 
              style={styles.avatar} 
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]}>
              <Text style={styles.defaultAvatarText}>
                {message.sender.name.charAt(0)}
              </Text>
            </View>
          )}
        </View>
      )}
      
      <View style={[
        styles.messageContent,
        isUser ? styles.userMessageContent : styles.aiMessageContent
      ]}>
        {!isUser && (
          <Text style={styles.senderName}>{message.sender.name}</Text>
        )}
        
        <Text style={[
          styles.messageText,
          isUser ? styles.userMessageText : styles.aiMessageText
        ]}>
          {message.content}
        </Text>
        
        <Text style={[
          styles.timestamp,
          isUser ? styles.userTimestamp : styles.aiTimestamp
        ]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    marginHorizontal: 8,
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  defaultAvatar: {
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultAvatarText: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
    fontSize: 14,
  },
  messageContent: {
    borderRadius: 16,
    padding: 12,
    maxWidth: '100%',
  },
  userMessageContent: {
    backgroundColor: Colors.light.primary,
    borderBottomRightRadius: 4,
  },
  aiMessageContent: {
    backgroundColor: Colors.light.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: Colors.light.text,
  },
  timestamp: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiTimestamp: {
    color: Colors.light.subtext,
  },
});