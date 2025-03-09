import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
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

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  };

  const navigateToForgotPassword = () => {
    router.push('/forgot-password');
  };

  const navigateToRegister = () => {
    router.push('/register');
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
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/Leafguard_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.appName, { color: isDark ? '#FFFFFF' : '#212121' }]}>
              LeafGuard
            </Text>
            <Text style={[styles.tagline, { color: isDark ? '#B0B0B0' : '#757575' }]}>
              Protect your plants with AI-powered disease detection
            </Text>
          </View>

          <View style={styles.formContainer}>
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

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              isPassword
              error={passwordError}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={isDark ? '#9BA1A6' : '#687076'} />}
            />

            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={navigateToForgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { color: Theme.colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button
              title="Login"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.loginButton}
            />

            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: isDark ? '#B0B0B0' : '#757575' }]}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={[styles.registerLink, { color: Theme.colors.primary }]}>
                  {' Register'}
                </Text>
              </TouchableOpacity>
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
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.xxl,
    paddingBottom: Theme.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: Theme.spacing.md,
  },
  appName: {
    fontSize: Theme.typography.fontSize.xxxl,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.xs,
  },
  tagline: {
    fontSize: Theme.typography.fontSize.md,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: Theme.spacing.lg,
  },
  forgotPasswordText: {
    fontSize: Theme.typography.fontSize.sm,
  },
  loginButton: {
    marginBottom: Theme.spacing.xl,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: Theme.typography.fontSize.md,
  },
  registerLink: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
  },
}); 