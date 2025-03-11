import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/Theme';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

interface DrawerIconProps {
  color: string;
  size: number;
}

export default function MainLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && !isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? Theme.colors.background.dark : Theme.colors.background.light,
        },
        headerTintColor: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light,
        drawerStyle: {
          backgroundColor: isDark ? Theme.colors.background.dark : Theme.colors.background.light,
        },
        drawerActiveTintColor: Theme.colors.primary,
        drawerInactiveTintColor: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Home',
          headerTitle: 'LeafGuard',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="environmental-data"
        options={{
          title: 'Environmental Data',
          headerTitle: 'Environmental Data',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="disease-trends"
        options={{
          title: 'Disease Trends',
          headerTitle: 'Disease Trends',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Ionicons name="trending-up-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="treatment-management"
        options={{
          title: 'Treatment Plans',
          headerTitle: 'Treatment Plans',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Ionicons name="medical-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="subscription"
        options={{
          title: 'Subscription',
          headerTitle: 'Subscription',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
} 