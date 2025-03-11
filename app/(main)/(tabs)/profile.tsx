import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Theme } from '../../../constants/Theme';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { LeafGuardApi } from '../../../services/LeafGuardApi';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#2C3D32' }]}>
            Profile
          </Text>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarContainer, { backgroundColor: Theme.colors.primary }]}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: '#2C3D32' }]}>
                {user?.name || 'User'}
              </Text>
              <Text style={[styles.profileEmail, { color: '#445C4B' }]}>
                {user?.email || 'user@example.com'}
              </Text>
              <View style={[styles.roleBadge, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Text style={[styles.roleText, { color: Theme.colors.primary }]}>
                  {user?.role || 'User'}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <Card style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <Text style={[styles.subscriptionTitle, { color: '#2C3D32' }]}>
              Subscription
            </Text>
            <Ionicons name="star" size={24} color={Theme.colors.secondary} />
          </View>
          <View style={styles.subscriptionDetails}>
            <Text style={[styles.planName, { color: '#2C3D32' }]}>
              {user?.isSubscribed ? 'Premium Plan' : 'Free Plan'}
            </Text>
            <Text style={[styles.planDescription, { color: '#445C4B' }]}>
              {user?.isSubscribed 
                ? 'Unlimited scans, priority support, and advanced features' 
                : `${user?.remainingFreeScans || 0} free scans remaining`}
            </Text>
            {!user?.isSubscribed && (
              <Button
                title="Upgrade to Premium"
                style={styles.upgradeButton}
                onPress={() => {}}
              />
            )}
          </View>
        </Card>

        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: '#2C3D32' }]}>
            Settings
          </Text>
          <Card style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingsItem} onPress={() => {}}>
              <Ionicons name="person-outline" size={24} color={Theme.colors.primary} />
              <Text style={[styles.settingsText, { color: '#2C3D32' }]}>
                Edit Profile
              </Text>
              <Ionicons name="chevron-forward" size={20} color={'#445C4B'} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingsItem} onPress={() => {}}>
              <Ionicons name="notifications-outline" size={24} color={Theme.colors.primary} />
              <Text style={[styles.settingsText, { color: '#2C3D32' }]}>
                Notifications
              </Text>
              <Ionicons name="chevron-forward" size={20} color={'#445C4B'} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingsItem} onPress={() => {}}>
              <Ionicons name="shield-outline" size={24} color={Theme.colors.primary} />
              <Text style={[styles.settingsText, { color: '#2C3D32' }]}>
                Privacy & Security
              </Text>
              <Ionicons name="chevron-forward" size={20} color={'#445C4B'} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingsItem} onPress={() => {}}>
              <Ionicons name="help-circle-outline" size={24} color={Theme.colors.primary} />
              <Text style={[styles.settingsText, { color: '#2C3D32' }]}>
                Help & Support
              </Text>
              <Ionicons name="chevron-forward" size={20} color={'#445C4B'} />
            </TouchableOpacity>
          </Card>
        </View>

        <Button
          title="Logout"
          variant="outline"
          style={styles.logoutButton}
          onPress={handleLogout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },
  header: {
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: 'bold',
  },
  profileCard: {
    marginBottom: Theme.spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.lg,
  },
  avatarText: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.xs,
  },
  profileEmail: {
    fontSize: Theme.typography.fontSize.md,
    marginBottom: Theme.spacing.sm,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.round,
  },
  roleText: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '500',
  },
  subscriptionCard: {
    marginBottom: Theme.spacing.lg,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  subscriptionTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
  },
  subscriptionDetails: {},
  planName: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  planDescription: {
    fontSize: Theme.typography.fontSize.sm,
    marginBottom: Theme.spacing.md,
  },
  upgradeButton: {
    marginTop: Theme.spacing.sm,
  },
  settingsSection: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
    marginBottom: Theme.spacing.sm,
  },
  settingsCard: {
    padding: 0,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.lg,
  },
  settingsText: {
    flex: 1,
    fontSize: Theme.typography.fontSize.md,
    marginLeft: Theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  logoutButton: {
    marginTop: Theme.spacing.md,
  },
}); 