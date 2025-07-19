import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(30);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(30);

  useEffect(() => {
    // Logo animation
    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.back(1.2)),
    });
    logoOpacity.value = withTiming(1, { duration: 600 });

    // Title animation
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(400, withTiming(0, { duration: 600 }));

    // Subtitle animation
    subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    subtitleTranslateY.value = withDelay(600, withTiming(0, { duration: 600 }));

    // Buttons animation
    buttonsOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    buttonsTranslateY.value = withDelay(800, withTiming(0, { duration: 600 }));
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoSection}>
            <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>AI</Text>
              </View>
            </Animated.View>
            
            <Animated.Text style={[styles.title, titleAnimatedStyle]}>
              AI Workspace Hub
            </Animated.Text>
            
            <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
              Unify all your AI tools in one powerful workspace. Chat with multiple AI assistants, manage projects, and boost your productivity.
            </Animated.Text>
          </View>

          <Animated.View style={[styles.buttonSection, buttonsAnimatedStyle]}>
            <Button
              title=\"Get Started\"
              onPress={() => router.push('/(auth)/register')}
              variant=\"primary\"
              size=\"large\"
              fullWidth
              style={styles.primaryButton}
            />
            
            <Button
              title=\"Sign In\"
              onPress={() => router.push('/(auth)/login')}
              variant=\"outline\"
              size=\"large\"
              fullWidth
              style={styles.secondaryButton}
            />
            
            <Text style={styles.termsText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    textAlign: 'center' as const,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center' as const,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  buttonSection: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  secondaryButton: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'transparent',
  },
  termsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center' as const,
    marginTop: 8,
    lineHeight: 20,
  },
});