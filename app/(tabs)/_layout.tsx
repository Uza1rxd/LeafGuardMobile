import { Tabs } from 'expo-router';
import { useColorScheme, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Theme } from '../../constants/Theme';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { isAuthenticated, isLoading } = useAuth();

  // If the user is not authenticated, redirect to the auth screen
  if (!isLoading && !isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerLeft: () => <DrawerToggleButton />,
        headerStyle: {
          backgroundColor: isDark ? Theme.colors.background.dark : Theme.colors.background.light,
        },
        headerTintColor: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light,
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light,
        tabBarStyle: {
          backgroundColor: isDark ? Theme.colors.background.dark : Theme.colors.background.light,
          borderTopColor: isDark ? Theme.colors.border.dark : Theme.colors.border.light,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'LeafGuard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="disease-detection"
        options={{
          title: 'Scan',
          headerTitle: 'Plant Scanner',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'My Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
