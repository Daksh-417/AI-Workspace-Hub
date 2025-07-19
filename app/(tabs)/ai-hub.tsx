import React from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import Colors from '@/constants/colors';
import { useAIServices } from '@/hooks/ai-services-store';
import AIServiceCard from '@/components/AIServiceCard';

export default function AIHubScreen() {
  const { aiServices, connectService, disconnectService } = useAIServices();
  
  const handleConnect = (serviceId: string) => {
    // In a real app, this would open an OAuth flow
    Alert.alert(
      "Connect AI Service",
      "This would open an authentication flow to connect your account. For demo purposes, we'll simulate a successful connection.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Connect", 
          onPress: () => connectService(serviceId)
        }
      ]
    );
  };
  
  const handleDisconnect = (serviceId: string) => {
    Alert.alert(
      "Disconnect AI Service",
      "Are you sure you want to disconnect this AI service?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Disconnect", 
          onPress: () => disconnectService(serviceId),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Hub</Text>
        <Text style={styles.subtitle}>
          Connect and manage your AI services
        </Text>
      </View>
      
      <View style={styles.connectedSection}>
        <Text style={styles.sectionTitle}>Connected Services</Text>
        {aiServices.filter(service => service.isConnected).length > 0 ? (
          aiServices
            .filter(service => service.isConnected)
            .map(service => (
              <AIServiceCard 
                key={service.id} 
                service={service}
                onConnect={() => {}}
                onDisconnect={() => handleDisconnect(service.id)}
              />
            ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No connected AI services. Connect a service below to get started.
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.availableSection}>
        <Text style={styles.sectionTitle}>Available Services</Text>
        {aiServices.filter(service => !service.isConnected).length > 0 ? (
          aiServices
            .filter(service => !service.isConnected)
            .map(service => (
              <AIServiceCard 
                key={service.id} 
                service={service}
                onConnect={() => handleConnect(service.id)}
                onDisconnect={() => {}}
              />
            ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              All available AI services are connected.
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About AI Services</Text>
        <Text style={styles.infoText}>
          AI Workspace Hub integrates with leading AI providers to give you access to the best AI models for your projects. Connect your accounts to use these services within your workspaces.
        </Text>
        <Text style={styles.infoText}>
          Each service has different capabilities and pricing. Usage is tracked and displayed in the Analytics tab.
        </Text>
        <Text style={styles.infoText}>
          Student accounts may receive special pricing or free credits from certain providers.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
  },
  connectedSection: {
    marginBottom: 24,
  },
  availableSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.light.subtext,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 20,
  },
});