import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { Theme } from '../../constants/Theme';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset all errors
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      isValid = false;
    }

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError('Password must contain uppercase, lowercase, and numbers');
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register(name, email, password);
      router.replace('/(auth)/login');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('409') || error.message.includes('exists')) {
          setEmailError('An account with this email already exists');
        } else if (error.message.includes('network')) {
          setEmailError('Network error. Please check your internet connection');
        } else {
          setEmailError(error.message);
        }
      } else {
        setEmailError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Theme.colors.background.dark : Theme.colors.background.light }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={[styles.title, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
              Sign up to get started
            </Text>

            <View style={styles.form}>
              <Input
                label="Name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setNameError('');
                }}
                placeholder="Enter your name"
                autoCapitalize="words"
                autoComplete="name"
                error={nameError}
                leftIcon={<Ionicons name="person-outline" size={20} color={isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light} />}
              />

              <Input
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                }}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={emailError}
                leftIcon={<Ionicons name="mail-outline" size={20} color={isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light} />}
              />

              <Input
                label="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                }}
                placeholder="Create a password"
                isPassword
                error={passwordError}
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light} />}
              />

              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setConfirmPasswordError('');
                }}
                placeholder="Confirm your password"
                isPassword
                error={confirmPasswordError}
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light} />}
              />

              <Button
                title="Sign Up"
                onPress={handleRegister}
                isLoading={isLoading}
                style={styles.registerButton}
              />

              <View style={styles.loginContainer}>
                <Text style={[styles.loginText, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={navigateToLogin}>
                  <Text style={[styles.loginLink, { color: Theme.colors.primary }]}>
                    {' Sign In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  registerButton: {
    marginTop: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 