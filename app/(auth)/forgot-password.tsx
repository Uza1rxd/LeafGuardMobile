import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

import { Theme } from '../../constants/Theme';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    let isValid = true;

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleForgotPassword = async () => {
    if (!validateForm()) return;

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      Alert.alert(
        'Request Failed',
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  };

  const navigateToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={navigateToLogin} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#212121'} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#212121' }]}>
              Forgot Password
            </Text>
          </View>

          {!isSubmitted ? (
            <View style={styles.formContainer}>
              <Text style={[styles.description, { color: isDark ? '#B0B0B0' : '#757575' }]}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>

              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailError}
                leftIcon={<Ionicons name="mail-outline" size={20} color={isDark ? '#9BA1A6' : '#687076'} />}
              />

              <Button
                title="Send Reset Link"
                onPress={handleForgotPassword}
                isLoading={isLoading}
                style={styles.submitButton}
              />

              <TouchableOpacity onPress={navigateToLogin} style={styles.backToLoginButton}>
                <Text style={[styles.backToLoginText, { color: Theme.colors.primary }]}>
                  Back to Login
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.successContainer}>
              <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)' }]}>
                <Ionicons name="mail" size={60} color={Theme.colors.primary} />
              </View>
              <Text style={[styles.successTitle, { color: isDark ? '#FFFFFF' : '#212121' }]}>
                Check Your Email
              </Text>
              <Text style={[styles.successDescription, { color: isDark ? '#B0B0B0' : '#757575' }]}>
                We've sent a password reset link to {email}. Please check your email and follow the instructions to reset your password.
              </Text>
              <Button
                title="Back to Login"
                onPress={navigateToLogin}
                style={styles.backToLoginButtonSuccess}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  backButton: {
    padding: Theme.spacing.xs,
  },
  title: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    marginLeft: Theme.spacing.md,
  },
  formContainer: {
    width: '100%',
  },
  description: {
    fontSize: Theme.typography.fontSize.md,
    marginBottom: Theme.spacing.lg,
  },
  submitButton: {
    marginTop: Theme.spacing.md,
  },
  backToLoginButton: {
    alignSelf: 'center',
    marginTop: Theme.spacing.xl,
    padding: Theme.spacing.sm,
  },
  backToLoginText: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '500',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.lg,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.lg,
  },
  successTitle: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: Theme.typography.fontSize.md,
    textAlign: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  backToLoginButtonSuccess: {
    width: '100%',
  },
}); 