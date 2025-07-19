import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { Plus, X, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useWorkspaces } from '@/hooks/workspace-store';
import { useAIServices } from '@/hooks/ai-services-store';
import WorkspaceCard from '@/components/WorkspaceCard';

export default function WorkspacesScreen() {
  const { workspaces, createWorkspace } = useWorkspaces();
  const { aiServices } = useAIServices();
  const [modalVisible, setModalVisible] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const [isTeam, setIsTeam] = useState(false);
  const [selectedAIServices, setSelectedAIServices] = useState<string[]>([]);
  const [selectedIcon, setSelectedIcon] = useState('📁');
  
  const connectedServices = aiServices.filter(service => service.isConnected);
  
  const icons = ['📁', '📝', '🔬', '🎨', '💻', '📊', '📚', '🧠', '🤖', '🔍'];
  
  const handleCreateWorkspace = () => {
    if (workspaceName.trim() === '') return;
    
    createWorkspace({
      name: workspaceName,
      description: workspaceDescription,
      isTeam,
      aiServices: selectedAIServices,
      icon: selectedIcon,
    });
    
    // Reset form
    setWorkspaceName('');
    setWorkspaceDescription('');
    setIsTeam(false);
    setSelectedAIServices([]);
    setSelectedIcon('📁');
    setModalVisible(false);
  };
  
  const toggleAIService = (serviceId: string) => {
    if (selectedAIServices.includes(serviceId)) {
      setSelectedAIServices(selectedAIServices.filter(id => id !== serviceId));
    } else {
      setSelectedAIServices([...selectedAIServices, serviceId]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Workspaces</Text>
          <Pressable 
            style={({ pressed }) => [
              styles.createButton,
              pressed && styles.buttonPressed
            ]}
            onPress={() => setModalVisible(true)}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Create</Text>
          </Pressable>
        </View>
        
        {workspaces.length > 0 ? (
          workspaces.map(workspace => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No workspaces yet</Text>
            <Text style={styles.emptyStateText}>
              Create your first workspace to start organizing your AI projects
            </Text>
            <Pressable 
              style={({ pressed }) => [
                styles.emptyStateButton,
                pressed && styles.buttonPressed
              ]}
              onPress={() => setModalVisible(true)}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.emptyStateButtonText}>Create Workspace</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Workspace</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <X size={24} color={Colors.light.text} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Icon</Text>
              <View style={styles.iconsContainer}>
                {icons.map(icon => (
                  <Pressable
                    key={icon}
                    style={[
                      styles.iconButton,
                      selectedIcon === icon && styles.selectedIconButton
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Text style={styles.iconText}>{icon}</Text>
                  </Pressable>
                ))}
              </View>
              
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={workspaceName}
                onChangeText={setWorkspaceName}
                placeholder="Enter workspace name"
                placeholderTextColor={Colors.light.subtext}
              />
              
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={workspaceDescription}
                onChangeText={setWorkspaceDescription}
                placeholder="Enter workspace description"
                placeholderTextColor={Colors.light.subtext}
                multiline
                numberOfLines={3}
              />
              
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Team Workspace</Text>
                <Pressable
                  style={[
                    styles.switch,
                    isTeam && styles.switchActive
                  ]}
                  onPress={() => setIsTeam(!isTeam)}
                >
                  <View style={[
                    styles.switchThumb,
                    isTeam && styles.switchThumbActive
                  ]} />
                </Pressable>
              </View>
              
              <Text style={styles.inputLabel}>Connect AI Services</Text>
              {connectedServices.length > 0 ? (
                <View style={styles.aiServicesContainer}>
                  {connectedServices.map(service => (
                    <Pressable
                      key={service.id}
                      style={[
                        styles.aiServiceButton,
                        selectedAIServices.includes(service.id) && styles.selectedAIServiceButton
                      ]}
                      onPress={() => toggleAIService(service.id)}
                    >
                      <Image 
                        source={{ uri: service.icon }} 
                        style={styles.aiServiceIcon} 
                        resizeMode="contain"
                      />
                      <Text style={[
                        styles.aiServiceName,
                        selectedAIServices.includes(service.id) && styles.selectedAIServiceName
                      ]}>
                        {service.name}
                      </Text>
                      {selectedAIServices.includes(service.id) && (
                        <View style={styles.checkIcon}>
                          <Check size={12} color="#FFFFFF" />
                        </View>
                      )}
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Text style={styles.noServicesText}>
                  No connected AI services. Connect services in the AI Hub.
                </Text>
              )}
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <Pressable 
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.buttonPressed
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={({ pressed }) => [
                  styles.createWorkspaceButton,
                  pressed && styles.buttonPressed,
                  workspaceName.trim() === '' && styles.disabledButton
                ]}
                onPress={handleCreateWorkspace}
                disabled={workspaceName.trim() === ''}
              >
                <Text style={styles.createWorkspaceButtonText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

import { Image } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyState: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  modalBody: {
    paddingHorizontal: 20,
    maxHeight: '70%',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.inactive,
    padding: 2,
  },
  switchActive: {
    backgroundColor: Colors.light.primary,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  switchThumbActive: {
    transform: [{ translateX: 22 }],
  },
  aiServicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  aiServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 8,
  },
  selectedAIServiceButton: {
    backgroundColor: `${Colors.light.primary}10`,
    borderColor: Colors.light.primary,
  },
  aiServiceIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  aiServiceName: {
    fontSize: 14,
    color: Colors.light.text,
  },
  selectedAIServiceName: {
    color: Colors.light.primary,
    fontWeight: '500',
  },
  checkIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  noServicesText: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontStyle: 'italic',
    marginTop: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    marginTop: 16,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
  },
  createWorkspaceButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createWorkspaceButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: Colors.light.inactive,
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  selectedIconButton: {
    borderColor: Colors.light.primary,
    backgroundColor: `${Colors.light.primary}10`,
  },
  iconText: {
    fontSize: 20,
  },
});