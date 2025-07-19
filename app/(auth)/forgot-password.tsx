import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import Colors from '@/constants/colors';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSent(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
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
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            style={styles.successContainer}
          >
            <View style={styles.successIcon}>
              <CheckCircle size={64} color={Colors.light.success} />
            </View>
            
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successSubtitle}>
              We've sent a password reset link to {email}
            </Text>
            
            <Button
              title=\"Back to Sign In\"
              onPress={() => router.push('/(auth)/login')}
              size=\"large\"
              fullWidth
              style={styles.backToLoginButton}
            />
            
            <Button
              title=\"Resend Email\"
              onPress={() => setSent(false)}
              variant=\"ghost\"
              size=\"medium\"
              style={styles.resendButton}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password
          </Text>
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

            <Button
              title=\"Send Reset Link\"
              onPress={handleResetPassword}
              loading={loading}
              disabled={loading}
              size=\"large\"
              fullWidth
              style={styles.resetButton}
            />
          </Card>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
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
    lineHeight: 26,
  },
  formCard: {
    marginBottom: 24,
  },
  resetButton: {
    marginTop: 8,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.light.text,
    textAlign: 'center' as const,
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 18,
    color: Colors.light.subtext,
    textAlign: 'center' as const,
    lineHeight: 26,
    marginBottom: 32,
  },
  backToLoginButton: {
    marginBottom: 16,
  },
  resendButton: {
    marginTop: 8,
  },
});