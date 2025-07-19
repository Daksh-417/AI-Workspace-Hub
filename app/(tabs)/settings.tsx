import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Sparkles,
  Moon,
  Trash2
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';

export default function SettingsScreen() {
  const { user, logout, updateProfile } = useAuth();
  
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => logout(),
          style: "destructive"
        }
      ]
    );
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            // In a real app, this would call an API to delete the account
            Alert.alert("Account Deleted", "Your account has been deleted.");
            logout();
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const toggleStudentStatus = () => {
    if (user) {
      updateProfile({ isStudent: !user.isStudent });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          {user?.avatar ? (
            <Image 
              source={{ uri: user.avatar }} 
              style={styles.avatar} 
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>
                {user?.name?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
            {user?.isStudent && (
              <View style={styles.studentBadge}>
                <Sparkles size={12} color={Colors.light.primary} />
                <Text style={styles.studentText}>Student</Text>
              </View>
            )}
          </View>
        </View>
        
        <Pressable style={styles.editProfileButton}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </Pressable>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <Pressable style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <User size={20} color={Colors.light.text} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Personal Information</Text>
          </View>
          <ChevronRight size={20} color={Colors.light.subtext} />
        </Pressable>
        
        <Pressable style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Shield size={20} color={Colors.light.text} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Privacy & Security</Text>
          </View>
          <ChevronRight size={20} color={Colors.light.subtext} />
        </Pressable>
        
        <Pressable style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <CreditCard size={20} color={Colors.light.text} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Subscription & Billing</Text>
          </View>
          <ChevronRight size={20} color={Colors.light.subtext} />
        </Pressable>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Bell size={20} color={Colors.light.text} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: Colors.light.inactive, true: Colors.light.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Moon size={20} color={Colors.light.text} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: Colors.light.inactive, true: Colors.light.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Sparkles size={20} color={Colors.light.text} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Student Status</Text>
            <Text style={styles.settingDescription}>
              Enable student benefits and discounts
            </Text>
          </View>
          <Switch
            value={user?.isStudent || false}
            onValueChange={toggleStudentStatus}
            trackColor={{ false: Colors.light.inactive, true: Colors.light.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <Pressable style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <HelpCircle size={20} color={Colors.light.text} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Help & Support</Text>
          </View>
          <ChevronRight size={20} color={Colors.light.subtext} />
        </Pressable>
      </View>
      
      <View style={styles.actionButtons}>
        <Pressable 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color={Colors.light.text} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
        
        <Pressable 
          style={styles.deleteAccountButton}
          onPress={handleDeleteAccount}
        >
          <Trash2 size={20} color={Colors.light.error} />
          <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
        </Pressable>
      </View>
      
      <Text style={styles.versionText}>AI Workspace Hub v1.0.0</Text>
    </ScrollView>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
  },
  profileSection: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarPlaceholderText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 4,
  },
  studentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  studentText: {
    fontSize: 12,
    color: Colors.light.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  editProfileButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editProfileButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
    paddingLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  actionButtons: {
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 8,
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  deleteAccountButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.error,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 14,
    color: Colors.light.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
});