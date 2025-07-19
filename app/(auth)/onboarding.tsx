import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bot, Zap, Shield, Users, ArrowRight, Check } from 'lucide-react-native';
import Animated, { FadeInRight, FadeInLeft, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

const onboardingSteps = [
  {
    id: 1,
    icon: Bot,
    title: 'Multiple AI Assistants',
    description: 'Connect with ChatGPT, Claude, Gemini, and more AI tools in one unified workspace.',
    color: '#667eea',
  },
  {
    id: 2,
    icon: Zap,
    title: 'Boost Productivity',
    description: 'Organize projects, track usage, and collaborate with team members seamlessly.',
    color: '#764ba2',
  },
  {
    id: 3,
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure. We prioritize your privacy and security.',
    color: '#f093fb',
  },
  {
    id: 4,
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share workspaces, collaborate on projects, and manage team AI usage together.',
    color: '#f5576c',
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[currentStepData.color, `${currentStepData.color}80`]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.progressContainer}>
              {onboardingSteps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index <= currentStep && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>
            
            <Button
              title=\"Skip\"
              onPress={handleSkip}
              variant=\"ghost\"
              size=\"small\"
              style={styles.skipButton}
            />
          </View>

          <Animated.View 
            key={currentStep}
            entering={FadeInRight.delay(200).springify()}
            style={styles.stepContainer}
          >
            <View style={styles.iconContainer}>
              <currentStepData.icon size={80} color=\"#FFFFFF\" />
            </View>
            
            <Text style={styles.stepTitle}>{currentStepData.title}</Text>
            <Text style={styles.stepDescription}>{currentStepData.description}</Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400).springify()}
            style={styles.footer}
          >
            <Button
              title={currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
              onPress={handleNext}
              size=\"large\"
              fullWidth
              style={styles.nextButton}
              icon={
                currentStep === onboardingSteps.length - 1 ? 
                <Check size={20} color=\"#FFFFFF\" /> : 
                <ArrowRight size={20} color=\"#FFFFFF\" />
              }
            />
            
            <Text style={styles.stepCounter}>
              {currentStep + 1} of {onboardingSteps.length}
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 60,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#FFFFFF',
  },
  skipButton: {
    paddingHorizontal: 0,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    textAlign: 'center' as const,
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center' as const,
    lineHeight: 26,
  },
  footer: {
    alignItems: 'center',
    gap: 16,
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  stepCounter: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500' as const,
  },
});