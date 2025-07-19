import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { ExternalLink, Check } from 'lucide-react-native';
import { AIService } from '@/types';
import Colors from '@/constants/colors';

type AIServiceCardProps = {
  service: AIService;
  onConnect: () => void;
  onDisconnect: () => void;
};

export default function AIServiceCard({ service, onConnect, onDisconnect }: AIServiceCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: service.icon }} 
          style={styles.icon} 
          resizeMode="contain"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{service.name}</Text>
          <Text style={styles.provider}>{service.provider}</Text>
        </View>
        <View style={[
          styles.statusBadge, 
          service.isConnected ? styles.connectedBadge : styles.disconnectedBadge
        ]}>
          <Text style={[
            styles.statusText,
            service.isConnected ? styles.connectedText : styles.disconnectedText
          ]}>
            {service.isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.description}>{service.description}</Text>
      
      <View style={styles.capabilities}>
        {service.capabilities.map((capability, index) => (
          <View key={index} style={styles.capabilityItem}>
            <Check size={14} color={Colors.light.primary} />
            <Text style={styles.capabilityText}>{capability}</Text>
          </View>
        ))}
      </View>
      
      {service.usageLimit && service.usageRemaining !== undefined && (
        <View style={styles.usageContainer}>
          <View style={styles.usageBarBackground}>
            <View 
              style={[
                styles.usageBarFill, 
                { width: `${(service.usageRemaining / service.usageLimit) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.usageText}>
            {service.usageRemaining} / {service.usageLimit} tokens remaining
          </Text>
        </View>
      )}
      
      <View style={styles.actions}>
        {service.isConnected ? (
          <Pressable 
            style={({ pressed }) => [
              styles.button, 
              styles.disconnectButton,
              pressed && styles.buttonPressed
            ]}
            onPress={onDisconnect}
          >
            <Text style={styles.disconnectButtonText}>Disconnect</Text>
          </Pressable>
        ) : (
          <Pressable 
            style={({ pressed }) => [
              styles.button, 
              styles.connectButton,
              pressed && styles.buttonPressed
            ]}
            onPress={onConnect}
          >
            <Text style={styles.connectButtonText}>Connect</Text>
            <ExternalLink size={16} color="#FFFFFF" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  provider: {
    fontSize: 14,
    color: Colors.light.subtext,
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  connectedBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  disconnectedBadge: {
    backgroundColor: 'rgba(158, 158, 158, 0.1)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  connectedText: {
    color: Colors.light.success,
  },
  disconnectedText: {
    color: Colors.light.inactive,
  },
  description: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  capabilities: {
    marginBottom: 16,
  },
  capabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  capabilityText: {
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 8,
  },
  usageContainer: {
    marginBottom: 16,
  },
  usageBarBackground: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  usageBarFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 3,
  },
  usageText: {
    fontSize: 12,
    color: Colors.light.subtext,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  connectButton: {
    backgroundColor: Colors.light.primary,
  },
  disconnectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 8,
  },
  disconnectButtonText: {
    color: Colors.light.text,
    fontWeight: '500',
  },
});