import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, User, ArrowLeft, GraduationCap } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isStudent, setIsStudent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, isStudent);
      router.push('/(auth)/onboarding');
    } catch (error) {
      Alert.alert('Registration Failed', 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            entering={FadeInUp.delay(100).springify()}
            style={styles.header}
          >
            <Button
              title=\"\"
              onPress={() => router.back()}
              variant=\"ghost\"
              size=\"small\"
              icon={<ArrowLeft size={24} color={Colors.light.text} />}
              style={styles.backButton}
            />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the AI revolution</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Card variant=\"elevated\" padding=\"large\" style={styles.formCard}>
              <Input
                label=\"Full Name\"
                placeholder=\"Enter your full name\"
                value={name}
                onChangeText={setName}
                leftIcon={<User size={20} color={Colors.light.subtext} />}
                required
              />

              <Input
                label=\"Email\"
                placeholder=\"Enter your email\"
                value={email}
                onChangeText={setEmail}
                keyboardType=\"email-address\"
                autoCapitalize=\"none\"
                leftIcon={<Mail size={20} color={Colors.light.subtext} />}
                required
              />

              <Input
                label=\"Password\"
                placeholder=\"Create a password\"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                showPasswordToggle
                leftIcon={<Lock size={20} color={Colors.light.subtext} />}
                required
                helperText=\"Must be at least 6 characters\"
              />

              <Input
                label=\"Confirm Password\"
                placeholder=\"Confirm your password\"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                showPasswordToggle
                leftIcon={<Lock size={20} color={Colors.light.subtext} />}
                required
              />

              <Card 
                variant=\"outlined\" 
                padding=\"medium\"
                onPress={() => setIsStudent(!isStudent)}
                style={[styles.studentCard, isStudent && styles.studentCardActive]}
              >
                <View style={styles.studentOption}>
                  <View style={styles.studentInfo}>
                    <GraduationCap 
                      size={24} 
                      color={isStudent ? Colors.light.primary : Colors.light.subtext} 
                    />
                    <View style={styles.studentText}>
                      <Text style={[styles.studentTitle, isStudent && styles.studentTitleActive]}>
                        I'm a Student
                      </Text>
                      <Text style={styles.studentSubtitle}>
                        Get free access to premium features
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.checkbox, isStudent && styles.checkboxActive]}>
                    {isStudent && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </View>
              </Card>

              <Button
                title=\"Create Account\"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                size=\"large\"
                fullWidth
                style={styles.registerButton}
              />
            </Card>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400).springify()}
            style={styles.footer}
          >
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text 
                style={styles.linkText}
                onPress={() => router.push('/(auth)/login')}
              >
                Sign In
              </Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.light.subtext,
    marginBottom: 8,
  },
  formCard: {
    marginBottom: 24,
  },
  studentCard: {
    marginBottom: 24,
  },
  studentCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: `${Colors.light.primary}10`,
  },
  studentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentText: {
    marginLeft: 12,
    flex: 1,
  },
  studentTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  studentTitleActive: {
    color: Colors.light.primary,
  },
  studentSubtitle: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  registerButton: {
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: 'center' as const,
  },
  linkText: {
    color: Colors.light.primary,
    fontWeight: '600' as const,
  },
});