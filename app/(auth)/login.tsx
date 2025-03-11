import React, { useState, useEffect } from 'react';
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
import NetInfo from '@react-native-community/netinfo';

import { Theme } from '../../constants/Theme';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { DEFAULT_USER } from '../../constants/DefaultUser';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    checkNetworkStatus();
    // Set up network state listener
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkNetworkStatus = async () => {
    const netInfo = await NetInfo.fetch();
    setIsOffline(!netInfo.isConnected);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    try {
      if (!validateForm()) return;

      setIsLoading(true);
      setErrors({});

      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific error cases
        if (error.message === 'Incorrect password') {
          setErrors({ password: 'Incorrect password' });
          setPassword(''); // Clear password field for security
        } else if (error.message === 'Email not found') {
          setErrors({ email: 'Email not found' });
        } else if (error.message.includes('Network error')) {
          setErrors({ general: 'Network error - Please check your connection' });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: 'An unexpected error occurred' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const useDefaultCredentials = () => {
    setEmail(DEFAULT_USER.email);
    setPassword('password');
    setErrors({});
  };

  const navigateToRegister = () => {
    router.push('/(auth)/register');
  };

  const navigateToForgotPassword = () => {
    router.push('/(auth)/forgot-password');
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
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
              Sign in to continue
            </Text>

            {isOffline && (
              <Card style={styles.offlineCard}>
                <Text style={[styles.offlineText, { color: Theme.colors.warning }]}>
                  You're offline. Use default credentials:
                </Text>
                <TouchableOpacity onPress={useDefaultCredentials}>
                  <Text style={[styles.defaultCredentials, { color: Theme.colors.warning }]}>
                    Tap to use: user@leafguard.com / password
                  </Text>
                </TouchableOpacity>
              </Card>
            )}

            {errors.general && (
              <Card style={styles.errorCard}>
                <Text style={[styles.errorText, { color: Theme.colors.error }]}>
                  {errors.general}
                </Text>
              </Card>
            )}

            <View style={styles.form}>
              <Input
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors((prev) => ({ ...prev, email: undefined, general: undefined }));
                }}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
                leftIcon={<Ionicons name="mail-outline" size={20} color={Theme.colors.primary} />}
              />

              <Input
                label="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
                }}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                error={errors.password}
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Theme.colors.primary} />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={Theme.colors.primary}
                    />
                  </TouchableOpacity>
                }
              />

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={navigateToForgotPassword}
              >
                <Text style={[styles.forgotPasswordText, { color: Theme.colors.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleLogin}
                isLoading={isLoading}
                style={styles.loginButton}
              />

              <View style={styles.registerContainer}>
                <Text style={[styles.registerText, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                  Don't have an account?
                </Text>
                <TouchableOpacity onPress={navigateToRegister}>
                  <Text style={[styles.registerLink, { color: Theme.colors.primary }]}>
                    {' Sign Up'}
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    marginTop: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  offlineCard: {
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.statusBackground.warning,
  },
  offlineText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  defaultCredentials: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorCard: {
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.statusBackground.error,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 