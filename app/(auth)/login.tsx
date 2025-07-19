import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Card variant=\"elevated\" padding=\"large\" style={styles.formCard}>
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
                placeholder=\"Enter your password\"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                showPasswordToggle
                leftIcon={<Lock size={20} color={Colors.light.subtext} />}
                required
              />

              <Button
                title=\"Forgot Password?\"
                onPress={() => router.push('/(auth)/forgot-password')}
                variant=\"ghost\"
                size=\"small\"
                style={styles.forgotButton}
              />

              <Button
                title=\"Sign In\"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                size=\"large\"
                fullWidth
                style={styles.loginButton}
              />
            </Card>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400).springify()}
            style={styles.footer}
          >
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text 
                style={styles.linkText}
                onPress={() => router.push('/(auth)/register')}
              >
                Sign Up
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  loginButton: {
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