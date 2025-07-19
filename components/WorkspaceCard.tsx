import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, Users } from 'lucide-react-native';
import { Workspace } from '@/types';
import Colors from '@/constants/colors';
import { useWorkspaces } from '@/hooks/workspace-store';

type WorkspaceCardProps = {
  workspace: Workspace;
  onPress?: () => void;
};

export default function WorkspaceCard({ workspace, onPress }: WorkspaceCardProps) {
  const router = useRouter();
  const { selectWorkspace } = useWorkspaces();
  
  const handlePress = () => {
    selectWorkspace(workspace.id);
    if (onPress) {
      onPress();
    } else {
      router.push('/chat');
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{workspace.icon || '📁'}</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{workspace.name}</Text>
          {workspace.isTeam && (
            <View style={styles.teamBadge}>
              <Users size={12} color={Colors.light.primary} />
              <Text style={styles.teamText}>Team</Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {workspace.description}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Clock size={14} color={Colors.light.subtext} />
          <Text style={styles.date}>Updated {formatDate(workspace.updatedAt)}</Text>
        </View>
        
        <View style={styles.aiServices}>
          {workspace.aiServices.map((aiId, index) => (
            <View 
              key={aiId} 
              style={[
                styles.aiServiceDot,
                { backgroundColor: index === 0 ? '#6200EE' : index === 1 ? '#03DAC6' : '#FFC107' }
              ]} 
            />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginRight: 8,
  },
  teamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  teamText: {
    fontSize: 12,
    color: Colors.light.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginLeft: 4,
  },
  aiServices: {
    flexDirection: 'row',
  },
  aiServiceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
  },
});