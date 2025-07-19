import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Workspace, Activity } from '@/types';
import { useAuth } from './auth-store';

// Mock workspaces data
const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Research Project',
    description: 'AI-assisted research on renewable energy',
    createdAt: '2025-07-10T14:30:00Z',
    updatedAt: '2025-07-18T09:15:00Z',
    isTeam: true,
    aiServices: ['ai-1', 'ai-2'],
    icon: '🔬',
    recentActivity: [
      {
        id: 'act-1',
        type: 'message',
        content: 'Added new research paper on solar efficiency',
        timestamp: '2025-07-18T09:15:00Z',
      }
    ]
  },
  {
    id: 'ws-2',
    name: 'Essay Writing',
    description: 'Working on college application essays',
    createdAt: '2025-07-12T10:00:00Z',
    updatedAt: '2025-07-17T16:45:00Z',
    isTeam: false,
    aiServices: ['ai-1'],
    icon: '📝',
  },
  {
    id: 'ws-3',
    name: 'Product Design',
    description: 'Collaborative design for new mobile app',
    createdAt: '2025-07-05T08:20:00Z',
    updatedAt: '2025-07-15T11:30:00Z',
    isTeam: true,
    aiServices: ['ai-2', 'ai-3'],
    icon: '🎨',
  },
];

export const [WorkspaceContext, useWorkspaces] = createContextHook(() => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadWorkspaces = async () => {
      if (!user) return;
      
      try {
        const storedWorkspaces = await AsyncStorage.getItem('workspaces');
        if (storedWorkspaces) {
          const parsedWorkspaces = JSON.parse(storedWorkspaces);
          setWorkspaces(parsedWorkspaces);
          
          // Set the most recently updated workspace as current
          if (parsedWorkspaces.length > 0) {
            const sorted = [...parsedWorkspaces].sort(
              (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
            setCurrentWorkspace(sorted[0]);
          }
        } else {
          // For demo purposes, use mock data
          setWorkspaces(mockWorkspaces);
          setCurrentWorkspace(mockWorkspaces[0]);
          await AsyncStorage.setItem('workspaces', JSON.stringify(mockWorkspaces));
        }
      } catch (error) {
        console.error('Failed to load workspaces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkspaces();
  }, [user]);

  const createWorkspace = async (workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString();
      const newWorkspace: Workspace = {
        ...workspace,
        id: `ws-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      
      const updatedWorkspaces = [...workspaces, newWorkspace];
      setWorkspaces(updatedWorkspaces);
      setCurrentWorkspace(newWorkspace);
      await AsyncStorage.setItem('workspaces', JSON.stringify(updatedWorkspaces));
      return newWorkspace;
    } catch (error) {
      console.error('Create workspace failed:', error);
      return null;
    }
  };

  const updateWorkspace = async (id: string, updates: Partial<Workspace>) => {
    try {
      const index = workspaces.findIndex(ws => ws.id === id);
      if (index === -1) return false;
      
      const updatedWorkspace = {
        ...workspaces[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedWorkspaces = [...workspaces];
      updatedWorkspaces[index] = updatedWorkspace;
      
      setWorkspaces(updatedWorkspaces);
      if (currentWorkspace?.id === id) {
        setCurrentWorkspace(updatedWorkspace);
      }
      
      await AsyncStorage.setItem('workspaces', JSON.stringify(updatedWorkspaces));
      return true;
    } catch (error) {
      console.error('Update workspace failed:', error);
      return false;
    }
  };

  const deleteWorkspace = async (id: string) => {
    try {
      const updatedWorkspaces = workspaces.filter(ws => ws.id !== id);
      setWorkspaces(updatedWorkspaces);
      
      if (currentWorkspace?.id === id) {
        setCurrentWorkspace(updatedWorkspaces.length > 0 ? updatedWorkspaces[0] : null);
      }
      
      await AsyncStorage.setItem('workspaces', JSON.stringify(updatedWorkspaces));
      return true;
    } catch (error) {
      console.error('Delete workspace failed:', error);
      return false;
    }
  };

  const addActivity = async (workspaceId: string, activity: Omit<Activity, 'id' | 'timestamp'>) => {
    try {
      const workspace = workspaces.find(ws => ws.id === workspaceId);
      if (!workspace) return false;
      
      const newActivity: Activity = {
        ...activity,
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      
      const updatedActivities = [...(workspace.recentActivity || []), newActivity];
      
      return await updateWorkspace(workspaceId, {
        recentActivity: updatedActivities.slice(-10), // Keep only the 10 most recent activities
      });
    } catch (error) {
      console.error('Add activity failed:', error);
      return false;
    }
  };

  const selectWorkspace = (id: string) => {
    const workspace = workspaces.find(ws => ws.id === id);
    if (workspace) {
      setCurrentWorkspace(workspace);
      return true;
    }
    return false;
  };

  return {
    workspaces,
    currentWorkspace,
    isLoading,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addActivity,
    selectWorkspace,
  };
});