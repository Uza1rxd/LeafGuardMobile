import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/Theme';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();

  // If the user is not authenticated, redirect to the auth screen
  if (!isLoading && !isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.text.disabled.light,
        tabBarStyle: {
          backgroundColor: Theme.colors.surface.light,
          borderTopColor: Theme.colors.border.light,
          borderTopWidth: 1,
          height: Theme.layout.bottomTabHeight,
          paddingBottom: Theme.spacing.xs,
          paddingTop: Theme.spacing.xs,
          ...Theme.shadows.light.md,
        },
        headerStyle: {
          backgroundColor: Theme.colors.surface.light,
          height: Theme.layout.headerHeight,
          ...Theme.shadows.light.sm,
        },
        headerTitleStyle: {
          fontSize: Theme.typography.fontSize.lg,
          fontWeight: '600',
          color: Theme.colors.text.primary.light,
        },
        headerTintColor: Theme.colors.text.primary.light,
        headerShadowVisible: false,
        tabBarLabelStyle: {
          fontSize: Theme.typography.fontSize.xs,
          fontWeight: '500',
          marginTop: Theme.spacing.xxs,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="disease-detection"
        options={{
          title: 'Detect',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="environmental-data"
        options={{
          title: 'Environment',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cloud-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="disease-trends"
        options={{
          title: 'Trends',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="treatment-management"
        options={{
          title: 'Treatments',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medkit-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="subscription"
        options={{
          title: 'Subscription',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
