import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, RefreshControl, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Zap, Clock, Sparkles, Bot, FolderKanban, MessageSquare, BarChart2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useWorkspaces } from '@/hooks/workspace-store';
import { useAIServices } from '@/hooks/ai-services-store';
import WorkspaceCard from '@/components/WorkspaceCard';
import StatCard from '@/components/StatCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { workspaces, isLoading: workspacesLoading } = useWorkspaces();
  const { aiServices, isLoading: servicesLoading } = useAIServices();
  
  const [refreshing, setRefreshing] = React.useState(false);
  
  const connectedServices = aiServices.filter(service => service.isConnected);
  const recentWorkspaces = [...workspaces]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);
  
  const handleCreateWorkspace = () => {
    router.push('/workspaces');
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app, this would refresh data from the server
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  if (workspacesLoading || servicesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner text="Loading dashboard..." />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
          <Text style={styles.subtitle}>Welcome to your AI Workspace Hub</Text>
        </View>
        {user?.isStudent && (
          <View style={styles.studentBadge}>
            <Sparkles size={14} color={Colors.light.primary} />
            <Text style={styles.studentText}>Student</Text>
          </View>
        )}
      </View>
      
      <View style={styles.statsContainer}>
        <StatCard 
          title="Connected AIs" 
          value={connectedServices.length}
          icon={<Bot size={20} color={Colors.light.primary} />}
        />
        <StatCard 
          title="Workspaces" 
          value={workspaces.length}
          icon={<FolderKanban size={20} color="#03DAC6" />}
          color="#03DAC6"
        />
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Workspaces</Text>
          <Pressable onPress={() => router.push('/workspaces')}>
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        </View>
        
        {recentWorkspaces.length > 0 ? (
          recentWorkspaces.map(workspace => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No workspaces yet</Text>
            <Pressable 
              style={({ pressed }) => [
                styles.createButton,
                pressed && styles.buttonPressed
              ]}
              onPress={handleCreateWorkspace}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Workspace</Text>
            </Pressable>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Services</Text>
          <Pressable onPress={() => router.push('/ai-hub')}>
            <Text style={styles.seeAllText}>Manage</Text>
          </Pressable>
        </View>
        
        <View style={styles.aiServicesContainer}>
          {connectedServices.length > 0 ? (
            connectedServices.slice(0, 3).map(service => (
              <Pressable 
                key={service.id}
                style={({ pressed }) => [
                  styles.aiServiceCard,
                  pressed && styles.buttonPressed
                ]}
                onPress={() => router.push('/ai-hub')}
              >
                <View style={styles.aiServiceIconContainer}>
                  <Image 
                    source={{ uri: service.icon }} 
                    style={styles.aiServiceIcon} 
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.aiServiceName} numberOfLines={1}>
                  {service.name}
                </Text>
                {service.usageRemaining !== undefined && service.usageLimit && (
                  <Text style={styles.aiServiceUsage}>
                    {Math.round((service.usageRemaining / service.usageLimit) * 100)}% remaining
                  </Text>
                )}
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No connected AI services</Text>
              <Pressable 
                style={({ pressed }) => [
                  styles.createButton,
                  pressed && styles.buttonPressed
                ]}
                onPress={() => router.push('/ai-hub')}
              >
                <Zap size={16} color="#FFFFFF" />
                <Text style={styles.createButtonText}>Connect AI</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        
        <View style={styles.quickActionsContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.quickActionButton,
              pressed && styles.buttonPressed
            ]}
            onPress={handleCreateWorkspace}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.light.primary}20` }]}>
              <Plus size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.quickActionText}>New Workspace</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.quickActionButton,
              pressed && styles.buttonPressed
            ]}
            onPress={() => router.push('/chat')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.light.secondary}20` }]}>
              <MessageSquare size={20} color={Colors.light.secondary} />
            </View>
            <Text style={styles.quickActionText}>New Chat</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.quickActionButton,
              pressed && styles.buttonPressed
            ]}
            onPress={() => router.push('/analytics')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFC10720' }]}>
              <BarChart2 size={20} color="#FFC107" />
            </View>
            <Text style={styles.quickActionText}>View Analytics</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
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
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
  },
  studentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  studentText: {
    fontSize: 14,
    color: Colors.light.primary,
    marginLeft: 6,
    fontWeight: '600' as const,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500' as const,
  },
  emptyState: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.subtext,
    marginBottom: 16,
    textAlign: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  aiServicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  aiServiceCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '30%',
    minHeight: 100,
  },
  aiServiceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aiServiceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  aiServiceName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  aiServiceUsage: {
    fontSize: 12,
    color: Colors.light.subtext,
    textAlign: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    minHeight: 80,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
});