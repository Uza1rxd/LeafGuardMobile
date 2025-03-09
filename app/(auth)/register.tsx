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

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'Farmer' | 'Researcher' | 'Admin'>('Farmer');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;

    // Validate name
    if (!name) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

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

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register(email, name, password, role);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  };

  const navigateToLogin = () => {
    router.back();
  };

  const RoleOption = ({ title, isSelected, onSelect }: { title: string; isSelected: boolean; onSelect: () => void }) => (
    <TouchableOpacity
      style={[
        styles.roleOption,
        isSelected && { backgroundColor: isDark ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)' },
        isSelected && { borderColor: Theme.colors.primary },
      ]}
      onPress={onSelect}
    >
      <Text
        style={[
          styles.roleText,
          { color: isDark ? '#FFFFFF' : '#212121' },
          isSelected && { color: Theme.colors.primary },
        ]}
      >
        {title}
      </Text>
      {isSelected && (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={Theme.colors.primary}
          style={styles.checkIcon}
        />
      )}
    </TouchableOpacity>
  );

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
              Create Account
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              error={nameError}
              leftIcon={<Ionicons name="person-outline" size={20} color={isDark ? '#9BA1A6' : '#687076'} />}
            />

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
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              isPassword
              error={passwordError}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={isDark ? '#9BA1A6' : '#687076'} />}
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              error={confirmPasswordError}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={isDark ? '#9BA1A6' : '#687076'} />}
            />

            <Text style={[styles.roleLabel, { color: isDark ? '#FFFFFF' : '#212121' }]}>
              I am a:
            </Text>
            <View style={styles.roleContainer}>
              <RoleOption
                title="Farmer"
                isSelected={role === 'Farmer'}
                onSelect={() => setRole('Farmer')}
              />
              <RoleOption
                title="Researcher"
                isSelected={role === 'Researcher'}
                onSelect={() => setRole('Researcher')}
              />
              <RoleOption
                title="Admin"
                isSelected={role === 'Admin'}
                onSelect={() => setRole('Admin')}
              />
            </View>

            <Button
              title="Register"
              onPress={handleRegister}
              isLoading={isLoading}
              style={styles.registerButton}
            />

            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: isDark ? '#B0B0B0' : '#757575' }]}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={[styles.loginLink, { color: Theme.colors.primary }]}>
                  {' Login'}
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
  roleLabel: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '500',
    marginBottom: Theme.spacing.sm,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.xs,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: Theme.borderRadius.md,
    marginHorizontal: Theme.spacing.xs,
  },
  roleText: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: Theme.spacing.xs,
  },
  registerButton: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: Theme.typography.fontSize.md,
  },
  loginLink: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
  },
}); 